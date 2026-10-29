import { View, StyleSheet } from 'react-native';
import type { PropsWithChildren } from 'react';
import Text from './Text';
import type { Review } from '../types';
import theme from '../theme';
export default function ReviewItem({ review, own = false, children }: PropsWithChildren<{ review: Review; own?: boolean }>) {
  return <View style={styles.card}><View style={styles.row}><View style={styles.rating}><Text style={styles.score}>{review.rating}</Text></View><View style={{ flex: 1 }}><Text style={styles.title}>{own ? review.repository?.fullName : review.user.username}</Text><Text style={styles.date}>{new Date(review.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>{review.text && <Text style={{ lineHeight: 23 }}>{review.text}</Text>}</View></View>{children}</View>;
}
const styles = StyleSheet.create({ card: { padding: 16, backgroundColor: '#fff', gap: 16 }, row: { flexDirection: 'row', gap: 14 }, rating: { width: 50, height: 50, borderRadius: 25, borderColor: theme.colors.primary, borderWidth: 2, alignItems: 'center', justifyContent: 'center' }, score: { color: theme.colors.primary, fontWeight: '700' }, title: { fontWeight: '700', marginBottom: 5 }, date: { color: theme.colors.muted, marginBottom: 8 } });
