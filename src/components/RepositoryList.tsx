import { useState } from 'react';
import { FlatList, Pressable, TextInput, View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useDebounce } from 'use-debounce';
import useRepositories from '../hooks/useRepositories';
import RepositoryItem from './RepositoryItem';
import Text from './Text';
import { Loading, ErrorMessage } from './Feedback';
import type { Connection, Repository } from '../types';
import theme from '../theme';
export const Separator = () => <View style={{ height: 10 }} />;
export function RepositoryListContainer({ repositories, onSelect, onEndReached, header, loading = false }: { repositories?: Connection<Repository>; onSelect?: (id: string) => void; onEndReached?: () => void; header?: React.ReactElement; loading?: boolean }) {
  return <FlatList data={repositories?.edges.map(edge => edge.node) ?? []} keyExtractor={item => item.id} ItemSeparatorComponent={Separator} renderItem={({ item }) => <Pressable accessibilityRole="button" accessibilityLabel={`View ${item.fullName}`} onPress={() => onSelect?.(item.id)}><RepositoryItem repository={item} /></Pressable>} ListHeaderComponent={header} ListEmptyComponent={!loading ? <Text style={{ padding: 20 }}>No repositories found.</Text> : null} ListFooterComponent={loading ? <Loading /> : null} onEndReached={onEndReached} onEndReachedThreshold={0.5} keyboardShouldPersistTaps="handled" />;
}
export default function RepositoryList() {
  const [search, setSearch] = useState('');
  const [debounced] = useDebounce(search, 500);
  const [order, setOrder] = useState('latest');
  const query = useRepositories({ orderBy: order === 'latest' ? 'CREATED_AT' : 'RATING_AVERAGE', orderDirection: order === 'lowest' ? 'ASC' : 'DESC', searchKeyword: debounced });
  const [pageError, setPageError] = useState('');
  const more = () => { void query.fetchMore().catch((e: Error) => setPageError(e.message)); };
  return <RepositoryListContainer repositories={query.repositories} onSelect={id => router.push({ pathname: '/repository/[id]', params: { id } })} onEndReached={more} loading={query.loading} header={<View style={styles.filters}><Text style={styles.title}>Repositories</Text><TextInput accessibilityLabel="Search repositories" placeholder="Search by repository or owner" value={search} onChangeText={setSearch} style={styles.search} /><Text>Sort repositories</Text><Picker style={{ minHeight: 48, backgroundColor: theme.colors.surface, color: theme.colors.text }} accessibilityLabel="Sort repositories" selectedValue={order} onValueChange={setOrder}><Picker.Item label="Latest repositories" value="latest" /><Picker.Item label="Highest rated repositories" value="highest" /><Picker.Item label="Lowest rated repositories" value="lowest" /></Picker><ErrorMessage message={query.error?.message || pageError} /></View>} />;
}
const styles = StyleSheet.create({ filters: { padding: 16, gap: 8 }, title: { fontSize: 24, fontWeight: '700', marginBottom: 6 }, search: { minHeight: 48, backgroundColor: '#fff', padding: 12, borderRadius: 5, fontSize: 16, fontFamily: theme.fontFamily, color: theme.colors.text, borderWidth: 1, borderColor: theme.colors.border } });
