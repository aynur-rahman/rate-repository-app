import { useRef } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_REPOSITORIES } from '../graphql/queries';
import type { Connection, Repository } from '../types';
export default function useRepositories(variables: { orderBy: string; orderDirection: string; searchKeyword: string }) {
  const query = useQuery<{ repositories: Connection<Repository> }>(GET_REPOSITORIES, { variables: { first: 10, ...variables }, fetchPolicy: 'cache-and-network', notifyOnNetworkStatusChange: true });
  const fetching = useRef(false);
  const fetchMore = async () => {
    const pageInfo = query.data?.repositories.pageInfo;
    if (!pageInfo?.hasNextPage || query.loading || fetching.current) return;
    fetching.current = true;
    try { await query.fetchMore({ variables: { after: pageInfo.endCursor } }); }
    finally { fetching.current = false; }
  };
  return { ...query, repositories: query.data?.repositories, fetchMore };
}
