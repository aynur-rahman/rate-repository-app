import { gql } from '@apollo/client';
import { createCache } from '../src/utils/apolloClient';

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

const LIST = gql`
  query TestRepositories($first: Int, $after: String, $orderBy: AllRepositoriesOrderBy, $orderDirection: OrderDirection, $searchKeyword: String) {
    repositories(first: $first, after: $after, orderBy: $orderBy, orderDirection: $orderDirection, searchKeyword: $searchKeyword) {
      edges { cursor node { id fullName } }
      pageInfo { hasNextPage endCursor }
    }
  }
`;
const DETAIL = gql`
  query TestRepository($id: ID!, $first: Int, $after: String) {
    repository(id: $id) {
      id reviews(first: $first, after: $after) {
        edges { cursor node { id rating } }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
`;
const page = (ids: string[], hasNextPage = false, review = false) => ({
  __typename: review ? 'ReviewConnection' : 'RepositoryConnection',
  edges: ids.map(id => ({
    __typename: review ? 'ReviewEdge' : 'RepositoryEdge', cursor: `cursor-${id}`,
    node: review ? { __typename: 'Review', id, rating: 80 } : { __typename: 'Repository', id, fullName: `owner/${id}` },
  })),
  pageInfo: { __typename: 'PageInfo', hasNextPage, endCursor: `cursor-${ids.at(-1)}` },
});
const base = { first: 2, orderBy: 'CREATED_AT', orderDirection: 'DESC', searchKeyword: '' };
const ids = (data: any) => data.repositories.edges.map((edge: any) => edge.node.id);

test('repository pagination appends the next page and carries the final cursor', () => {
  const cache = createCache();
  cache.writeQuery({ query: LIST, variables: base, data: { repositories: page(['a', 'b'], true) } });
  cache.writeQuery({ query: LIST, variables: { ...base, after: 'cursor-b' }, data: { repositories: page(['c', 'd']) } });
  const result: any = cache.readQuery({ query: LIST, variables: base });
  expect(ids(result)).toEqual(['a', 'b', 'c', 'd']);
  expect(result.repositories.pageInfo).toEqual({ __typename: 'PageInfo', hasNextPage: false, endCursor: 'cursor-d' });
});

test('sorting directions and search keywords retain independent pagination results', () => {
  const cache = createCache();
  const variants = [base, { ...base, orderBy: 'RATING_AVERAGE' }, { ...base, orderBy: 'RATING_AVERAGE', orderDirection: 'ASC' }, { ...base, searchKeyword: 'react' }];
  variants.forEach((variables, index) => cache.writeQuery({ query: LIST, variables, data: { repositories: page([`repo-${index}`], true) } }));
  cache.writeQuery({ query: LIST, variables: { ...variants[3], after: 'cursor-repo-3' }, data: { repositories: page(['search-next']) } });
  variants.forEach((variables, index) => expect(ids(cache.readQuery({ query: LIST, variables }))).toEqual(index === 3 ? ['repo-3', 'search-next'] : [`repo-${index}`]));
});

test('a fresh first page replaces previously paginated results after a refetch', () => {
  const cache = createCache();
  cache.writeQuery({ query: LIST, variables: base, data: { repositories: page(['a', 'b'], true) } });
  cache.writeQuery({ query: LIST, variables: { ...base, after: 'cursor-b' }, data: { repositories: page(['c']) } });
  cache.writeQuery({ query: LIST, variables: base, data: { repositories: page(['new', 'a'], true) } });
  expect(ids(cache.readQuery({ query: LIST, variables: base }))).toEqual(['new', 'a']);
});

test('review pages append within their repository without contaminating another repository', () => {
  const cache = createCache();
  const write = (id: string, reviews: string[], after?: string) => cache.writeQuery({ query: DETAIL, variables: { id, first: 2, after }, data: { repository: { __typename: 'Repository', id, reviews: page(reviews, !after, true) } } });
  write('one', ['review-a', 'review-b']);
  write('two', ['review-other']);
  write('one', ['review-c'], 'cursor-review-b');
  const read = (id: string) => cache.readQuery<any>({ query: DETAIL, variables: { id, first: 2 } })!.repository.reviews.edges.map((edge: any) => edge.node.id);
  expect(read('one')).toEqual(['review-a', 'review-b', 'review-c']);
  expect(read('two')).toEqual(['review-other']);
});
