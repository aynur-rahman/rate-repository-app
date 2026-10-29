import { ActivityIndicator, View } from 'react-native';
import Text from './Text';
import theme from '../theme';
export const ErrorMessage = ({ message }: { message?: string }) => message ? <Text accessibilityRole="alert" style={{ color: theme.colors.error, padding: 12 }}>{message}</Text> : null;
export const Loading = () => <View style={{ padding: 20 }}><ActivityIndicator accessibilityLabel="Loading" color={theme.colors.primary} /></View>;
export const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'Something went wrong. Please try again.';
