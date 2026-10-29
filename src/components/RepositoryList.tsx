import { FlatList, View } from 'react-native';
import useRepositories from '../hooks/useRepositories';
import RepositoryItem from './RepositoryItem';
import Text from './Text';
import { Loading, ErrorMessage } from './Feedback';
export const Separator = () => <View style={{ height: 10 }} />;
export default function RepositoryList() {
  const { repositories, loading, error } = useRepositories();
  return <FlatList data={repositories?.edges.map(edge => edge.node) ?? []} keyExtractor={item => item.id} ItemSeparatorComponent={Separator} renderItem={({ item }) => <RepositoryItem repository={item} />} ListHeaderComponent={<ErrorMessage message={error?.message} />} ListEmptyComponent={!loading ? <Text style={{ padding: 20 }}>No repositories found.</Text> : null} ListFooterComponent={loading ? <Loading /> : null} />;
}
