import { useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useQuery } from '@apollo/client/react';
import { GET_REPOSITORY } from '../graphql/queries';
import type { Repository } from '../types';
import RepositoryItem from './RepositoryItem'; import ReviewItem from './ReviewItem'; import { Separator } from './RepositoryList'; import Text from './Text'; import { Loading, ErrorMessage, errorMessage } from './Feedback';
export default function RepositoryDetail({ id }: { id: string }) {
  const { data, loading, error, fetchMore } = useQuery<{ repository: Repository | null }>(GET_REPOSITORY, { variables: { id, first: 5 }, fetchPolicy: 'cache-and-network', notifyOnNetworkStatusChange: true });
  const fetching = useRef(false); const [pageError, setPageError] = useState('');
  const more = async () => {
    const page = data?.repository?.reviews?.pageInfo;
    if (!page?.hasNextPage || loading || fetching.current) return;
    fetching.current = true;
    try { await fetchMore({ variables: { after: page.endCursor } }); }
    catch (e) { setPageError(errorMessage(e)); }
    finally { fetching.current = false; }
  };
  if (!data?.repository) return loading ? <Loading /> : <ErrorMessage message={error?.message || 'Repository not found'} />;
  const repository = data.repository;
  return <FlatList data={repository.reviews?.edges.map(edge => edge.node) ?? []} keyExtractor={review => review.id} ItemSeparatorComponent={Separator} ListHeaderComponent={<View><RepositoryItem repository={repository} showLink /><Text style={{ padding: 16, fontWeight: '700', fontSize: 20 }}>Reviews</Text><ErrorMessage message={error?.message || pageError} /></View>} renderItem={({ item }) => <ReviewItem review={item} />} ListEmptyComponent={<Text style={{ padding: 16 }}>No reviews yet.</Text>} ListFooterComponent={loading ? <Loading /> : null} onEndReached={() => void more()} onEndReachedThreshold={0.5} />;
}
