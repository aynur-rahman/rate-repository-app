import { useLocalSearchParams } from 'expo-router';
import RepositoryDetail from '../../components/RepositoryDetail';
export default function Screen() { const { id } = useLocalSearchParams<{ id: string }>(); return <RepositoryDetail key={id} id={id} />; }
