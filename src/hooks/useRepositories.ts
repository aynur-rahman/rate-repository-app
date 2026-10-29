import { useQuery } from '@apollo/client/react';
import { GET_REPOSITORIES } from '../graphql/queries';
import type { Connection, Repository } from '../types';
export default function useRepositories() {
  const query = useQuery<{ repositories: Connection<Repository> }>(GET_REPOSITORIES, { fetchPolicy: 'cache-and-network' });
  return { ...query, repositories: query.data?.repositories };
}
