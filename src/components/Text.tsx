import { Text as NativeText, StyleSheet } from 'react-native';
import type { TextProps } from 'react-native';
import theme from '../theme';
export default function Text({ style, ...props }: TextProps) {
  return <NativeText {...props} style={[styles.text, style]} />;
}
const styles = StyleSheet.create({ text: { color: theme.colors.text, fontSize: 16, fontFamily: theme.fontFamily } });
