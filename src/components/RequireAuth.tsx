import type { PropsWithChildren } from 'react';
import { Redirect } from 'expo-router';
import useMe from '../hooks/useMe';
import { Loading, ErrorMessage } from './Feedback';
export default function RequireAuth({ children }: PropsWithChildren) {
  const { data, loading, error } = useMe();
  if (loading && !data) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;
  return data?.me ? children : <Redirect href="/sign-in" />;
}
