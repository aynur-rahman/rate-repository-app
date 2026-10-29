import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import AuthStorage from './authStorage';
export default function createApolloClient(storage: AuthStorage) {
  const uri = process.env.EXPO_PUBLIC_APOLLO_URI;
  if (!uri) throw new Error('Set EXPO_PUBLIC_APOLLO_URI in .env before starting the app');
  const auth = new SetContextLink(async previous => {
    const token = await storage.getAccessToken();
    return { headers: { ...previous.headers, authorization: token ? `Bearer ${token}` : '' } };
  });
  return new ApolloClient({ link: auth.concat(new HttpLink({ uri })), cache: new InMemoryCache() });
}
