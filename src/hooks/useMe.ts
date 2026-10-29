import { useQuery } from '@apollo/client/react';
import { ME } from '../graphql/queries';
import type { User } from '../types';
export default function useMe(includeReviews = false) {
  return useQuery<{ me: User | null }>(ME, { variables: { includeReviews, first: 10 }, fetchPolicy: 'cache-and-network', notifyOnNetworkStatusChange: true });
}
