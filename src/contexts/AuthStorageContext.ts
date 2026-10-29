import { createContext, useContext } from 'react';
import AuthStorage from '../utils/authStorage';
export const AuthStorageContext = createContext<AuthStorage | null>(null);
export const useAuthStorage = () => {
  const storage = useContext(AuthStorageContext);
  if (!storage) throw new Error('Auth storage provider is missing');
  return storage;
};
