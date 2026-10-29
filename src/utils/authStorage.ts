import AsyncStorage from '@react-native-async-storage/async-storage';
export default class AuthStorage {
  private key: string;
  constructor(namespace = 'rateRepository') { this.key = `${namespace}:accessToken`; }
  getAccessToken() { return AsyncStorage.getItem(this.key); }
  setAccessToken(token: string) { return AsyncStorage.setItem(this.key, token); }
  removeAccessToken() { return AsyncStorage.removeItem(this.key); }
}
