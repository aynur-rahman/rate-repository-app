import { useApolloClient, useMutation } from '@apollo/client/react';
import { AUTHENTICATE } from '../graphql/queries';
import { useAuthStorage } from '../contexts/AuthStorageContext';
import type { Credentials } from '../types';
export default function useSignIn() {
  const [authenticate, result] = useMutation<{ authenticate: { accessToken: string } }>(AUTHENTICATE);
  const storage = useAuthStorage();
  const client = useApolloClient();
  const signIn = async (credentials: Credentials) => {
    const response = await authenticate({ variables: { credentials } });
    const token = response.data?.authenticate.accessToken;
    if (!token) throw new Error('Sign in did not return an access token');
    await storage.setAccessToken(token);
    await client.resetStore();
    return response;
  };
  return [signIn, result] as const;
}
