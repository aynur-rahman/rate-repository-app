import { useQuery } from '@apollo/client/react';
import { ME } from '../graphql/queries';
import type { User } from '../types';
export default function useMe() {
  return useQuery<{ me: User | null }>(ME, { fetchPolicy: 'cache-and-network' });
}
