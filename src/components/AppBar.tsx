import { ScrollView, Pressable, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Text from './Text';
import theme from '../theme';
export default function AppBar() {
  const tabs = [{ label: 'Repositories', onPress: () => router.push('/') }, { label: 'Sign in', onPress: () => router.push('/sign-in') }];
  return <View style={styles.bar}><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>{tabs.map(tab => <Pressable key={tab.label} accessibilityRole="button" onPress={tab.onPress} style={({ pressed }) => [styles.tab, pressed && { opacity: 0.6 }]}><Text style={styles.text}>{tab.label}</Text></Pressable>)}</ScrollView></View>;
}
const styles = StyleSheet.create({ bar: { backgroundColor: theme.colors.appBar }, tabs: { flexDirection: 'row', paddingHorizontal: 8 }, tab: { padding: 16, minHeight: 52, justifyContent: 'center' }, text: { color: '#fff', fontWeight: '700' } });
