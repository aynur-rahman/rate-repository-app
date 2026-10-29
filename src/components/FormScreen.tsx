import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import type { PropsWithChildren } from 'react';
import theme from '../theme';
export default function FormScreen({ children }: PropsWithChildren) {
  return <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, backgroundColor: theme.colors.surface, flexGrow: 1 }}>{children}</ScrollView></KeyboardAvoidingView>;
}
