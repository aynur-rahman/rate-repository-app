import { Slot } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ApolloProvider } from '@apollo/client/react';
import AuthStorage from '../utils/authStorage';
import createApolloClient from '../utils/apolloClient';
import { AuthStorageContext } from '../contexts/AuthStorageContext';
import AppBar from '../components/AppBar';
import theme from '../theme';
const storage = new AuthStorage();
const client = createApolloClient(storage);
export default function RootLayout() {
  return <SafeAreaProvider><AuthStorageContext.Provider value={storage}><ApolloProvider client={client}><SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.appBar }}><StatusBar style="light" /><View style={{ flex: 1, width: '100%', maxWidth: 760, alignSelf: 'center', backgroundColor: theme.colors.background }}><AppBar /><Slot /></View></SafeAreaView></ApolloProvider></AuthStorageContext.Provider></SafeAreaProvider>;
}
