import { Image, StyleSheet, View } from 'react-native';
import * as Linking from 'expo-linking';
import { useState } from 'react';
import Text from './Text';
import Button from './Button';
import { ErrorMessage, errorMessage } from './Feedback';
import type { Repository } from '../types';
import theme from '../theme';
export const formatCount = (value = 0) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value);
export default function RepositoryItem({ repository, showLink = false }: { repository: Repository; showLink?: boolean }) {
  const [error, setError] = useState('');
  const open = async () => { try { if (repository.url) await Linking.openURL(repository.url); } catch (e) { setError(errorMessage(e)); } };
  return <View testID="repositoryItem" style={styles.card}>
    <View style={styles.heading}>{repository.ownerAvatarUrl && <Image source={{ uri: repository.ownerAvatarUrl }} accessibilityLabel={`${repository.fullName} avatar`} style={styles.avatar} />}<View style={styles.summary}><Text style={styles.name}>{repository.fullName}</Text>{repository.description && <Text style={styles.description}>{repository.description}</Text>}{repository.language && <View style={styles.tag}><Text style={styles.language}>{repository.language}</Text></View>}</View></View>
    <View style={styles.stats}>{[[repository.stargazersCount, 'Stars'], [repository.forksCount, 'Forks'], [repository.reviewCount, 'Reviews'], [repository.ratingAverage, 'Rating']].map(([value, label]) => <View key={String(label)} style={styles.stat}><Text style={styles.number}>{formatCount(typeof value === 'number' ? value : 0)}</Text><Text style={styles.caption}>{label}</Text></View>)}</View>
    {showLink && repository.url && <Button onPress={() => void open()}>Open in GitHub</Button>}<ErrorMessage message={error} />
  </View>;
}
const styles = StyleSheet.create({ card: { backgroundColor: theme.colors.surface, padding: 16 }, heading: { flexDirection: 'row', gap: 14 }, avatar: { width: 50, height: 50, borderRadius: 5 }, summary: { flex: 1 }, name: { fontWeight: '700', marginBottom: 6 }, description: { color: theme.colors.muted, lineHeight: 23, marginBottom: 8 }, tag: { alignSelf: 'flex-start', backgroundColor: theme.colors.primary, borderRadius: 4, paddingHorizontal: 7, paddingVertical: 4 }, language: { color: '#fff', fontSize: 14 }, stats: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 16, gap: 4 }, stat: { alignItems: 'center', flex: 1 }, number: { fontWeight: '700', marginBottom: 5 }, caption: { fontSize: 14, color: theme.colors.muted } });
