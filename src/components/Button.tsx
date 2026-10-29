import { Pressable, StyleSheet } from 'react-native';
import Text from './Text';
import theme from '../theme';
export default function Button({ children, onPress, disabled = false, destructive = false }: { children: string; onPress: () => void; disabled?: boolean; destructive?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, destructive && styles.destructive, (pressed || disabled) && styles.dim]}><Text style={styles.label}>{children}</Text></Pressable>;
}
const styles = StyleSheet.create({ button: { backgroundColor: theme.colors.primary, minHeight: 48, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }, destructive: { backgroundColor: theme.colors.error }, label: { color: '#fff', fontWeight: '700' }, dim: { opacity: 0.65 } });
