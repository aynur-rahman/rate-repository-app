import { Link } from 'expo-router';
import { View } from 'react-native';
import Text from '../components/Text';
export default function NotFound() { return <View style={{ padding: 20 }}><Text>Page not found.</Text><Link href="/">Return to repositories</Link></View>; }
