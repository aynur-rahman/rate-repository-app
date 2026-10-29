import { useField } from 'formik';
import { View, TextInput, StyleSheet } from 'react-native';
import type { TextInputProps } from 'react-native';
import Text from './Text';
import theme from '../theme';
export default function FormField({ name, label, ...props }: TextInputProps & { name: string; label: string }) {
  const [field, meta, helpers] = useField<string>(name);
  const invalid = Boolean(meta.touched && meta.error);
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput {...props} accessibilityLabel={label} value={field.value} onChangeText={value => void helpers.setValue(value)} onBlur={() => void helpers.setTouched(true)} placeholderTextColor={theme.colors.muted} style={[styles.input, props.multiline && styles.multiline, invalid && styles.invalid, props.style]} />{invalid && <Text accessibilityRole="alert" style={styles.error}>{meta.error}</Text>}</View>;
}
const styles = StyleSheet.create({ field: { marginBottom: 16 }, label: { marginBottom: 6 }, input: { fontFamily: theme.fontFamily, fontSize: 16, color: theme.colors.text, borderColor: theme.colors.border, borderWidth: 1, padding: 12, minHeight: 48, borderRadius: 5, backgroundColor: '#fff' }, multiline: { minHeight: 110, textAlignVertical: 'top' }, invalid: { borderColor: theme.colors.error, borderWidth: 2 }, error: { color: theme.colors.error, marginTop: 6 } });
