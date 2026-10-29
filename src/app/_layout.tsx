import { Slot } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AppBar from '../components/AppBar';
import theme from '../theme';
export default function RootLayout() {
  return <SafeAreaProvider><SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.appBar }}><StatusBar style="light" /><View style={{ flex: 1, width: '100%', maxWidth: 760, alignSelf: 'center', backgroundColor: theme.colors.background }}><AppBar /><Slot /></View></SafeAreaView></SafeAreaProvider>;
}
