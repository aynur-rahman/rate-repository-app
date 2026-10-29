import { useState } from 'react';
import { ScrollView, Pressable, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useApolloClient } from '@apollo/client/react';
import { useAuthStorage } from '../contexts/AuthStorageContext';
import useMe from '../hooks/useMe';
import Text from './Text'; import { ErrorMessage, errorMessage } from './Feedback';
import theme from '../theme';
export default function AppBar() {
  const { data } = useMe(); const storage = useAuthStorage(); const client = useApolloClient();
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const signOut = async () => { setBusy(true); setError(''); try { await storage.removeAccessToken(); await client.resetStore(); router.replace('/'); } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); } };
  const tabs = [{ label: 'Repositories', onPress: () => router.push('/') }, data?.me
    ? { label: busy ? 'Signing out…' : 'Sign out', onPress: () => void signOut() }
    : { label: 'Sign in', onPress: () => router.push('/sign-in') }];
  return <View style={styles.bar}><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>{tabs.map(tab => <Pressable key={tab.label} accessibilityRole="button" disabled={busy} onPress={tab.onPress} style={({ pressed }) => [styles.tab, pressed && { opacity: 0.6 }]}><Text style={styles.text}>{tab.label}</Text></Pressable>)}</ScrollView><ErrorMessage message={error} /></View>;
}
const styles = StyleSheet.create({ bar: { backgroundColor: theme.colors.appBar }, tabs: { flexDirection: 'row', paddingHorizontal: 8 }, tab: { padding: 16, minHeight: 52, justifyContent: 'center' }, text: { color: '#fff', fontWeight: '700' } });
