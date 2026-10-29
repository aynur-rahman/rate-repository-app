import { Alert, Platform } from 'react-native';
export default function confirmDelete(onConfirm: () => void) {
  if (Platform.OS === 'web') {
    if (window.confirm('Delete this review? This action cannot be undone.')) onConfirm();
    return;
  }
  Alert.alert('Delete review', 'Are you sure you want to delete this review?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: onConfirm },
  ], { cancelable: true });
}
