import { useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useMutation, useApolloClient } from '@apollo/client/react';
import { router } from 'expo-router';
import useMe from '../hooks/useMe';
import { DELETE_REVIEW } from '../graphql/queries';
import confirmDelete from '../utils/confirmDelete';
import ReviewItem from './ReviewItem'; import { Separator } from './RepositoryList'; import Text from './Text'; import Button from './Button'; import { ErrorMessage, Loading, errorMessage } from './Feedback';
export default function MyReviews() {
  const query = useMe(true); const [remove] = useMutation(DELETE_REVIEW); const client = useApolloClient();
  const [error, setError] = useState(''); const [deleting, setDeleting] = useState<string | null>(null); const fetching = useRef(false);
  const deleteReview = async (id: string, repositoryId: string) => {
    setDeleting(id); setError('');
    try {
      await remove({ variables: { id } });
      client.cache.evict({ id: `Review:${id}` }); client.cache.evict({ fieldName: 'repositories' });
      client.cache.evict({ id: `Repository:${repositoryId}`, fieldName: 'reviews' }); client.cache.gc();
      await query.refetch();
    } catch (e) { setError(errorMessage(e)); }
    finally { setDeleting(null); }
  };
  const more = async () => {
    const page = query.data?.me?.reviews?.pageInfo;
    if (!page?.hasNextPage || query.loading || fetching.current) return;
    fetching.current = true;
    try { await query.fetchMore({ variables: { after: page.endCursor } }); }
    catch (e) { setError(errorMessage(e)); } finally { fetching.current = false; }
  };
  return <FlatList data={query.data?.me?.reviews?.edges.map(edge => edge.node) ?? []} keyExtractor={item => item.id} ItemSeparatorComponent={Separator} ListHeaderComponent={<View><Text style={{ fontWeight: '700', fontSize: 24, padding: 16 }}>My reviews</Text><ErrorMessage message={error || query.error?.message} /></View>} renderItem={({ item }) => <ReviewItem review={item} own><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}><Button onPress={() => router.push({ pathname: '/repository/[id]', params: { id: item.repositoryId } })}>View repository</Button><Button destructive disabled={deleting !== null} onPress={() => confirmDelete(() => void deleteReview(item.id, item.repositoryId))}>{deleting === item.id ? 'Deleting…' : 'Delete review'}</Button></View></ReviewItem>} ListEmptyComponent={!query.loading ? <Text style={{ padding: 16 }}>You have not written any reviews yet.</Text> : null} ListFooterComponent={query.loading ? <Loading /> : null} onEndReached={() => void more()} onEndReachedThreshold={0.5} />;
}
