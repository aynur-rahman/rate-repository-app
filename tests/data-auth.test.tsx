import React from 'react';
import { act, fireEvent, render, renderHook, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthStorage from '../src/utils/authStorage';
import useSignIn from '../src/hooks/useSignIn';
import AppBar from '../src/components/AppBar';

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
const mockAuthenticate = jest.fn();
const mockResetStore = jest.fn();
const mockSetAccessToken = jest.fn();
const mockRemoveAccessToken = jest.fn();
const mockReplace = jest.fn();
jest.mock('@apollo/client/react', () => ({ useMutation: () => [mockAuthenticate, {}], useApolloClient: () => ({ resetStore: mockResetStore }) }));
jest.mock('../src/contexts/AuthStorageContext', () => ({ useAuthStorage: () => ({ setAccessToken: mockSetAccessToken, removeAccessToken: mockRemoveAccessToken }) }));
jest.mock('../src/hooks/useMe', () => ({ __esModule: true, default: () => ({ data: { me: { id: 'user', username: 'reader' } } }) }));
jest.mock('expo-router', () => ({ router: { replace: (...args: unknown[]) => mockReplace(...args), push: jest.fn() } }));

beforeEach(async () => {
  await AsyncStorage.clear();
  mockAuthenticate.mockReset(); mockResetStore.mockReset(); mockSetAccessToken.mockReset(); mockRemoveAccessToken.mockReset(); mockReplace.mockReset();
});

test('token storage persists across instances and isolates namespaces', async () => {
  const first = new AuthStorage('first'); const second = new AuthStorage('second');
  expect(await first.getAccessToken()).toBeNull();
  await first.setAccessToken('first-token'); await second.setAccessToken('second-token');
  expect(await new AuthStorage('first').getAccessToken()).toBe('first-token');
  await first.removeAccessToken();
  expect(await first.getAccessToken()).toBeNull();
  expect(await second.getAccessToken()).toBe('second-token');
});

test('sign in awaits token persistence before resetting active Apollo queries', async () => {
  const events: string[] = [];
  let persist!: () => void;
  mockAuthenticate.mockImplementation(async () => { events.push('authenticate'); return { data: { authenticate: { accessToken: 'token' } } }; });
  mockSetAccessToken.mockImplementation(() => new Promise<void>(resolve => { persist = () => { events.push('persist'); resolve(); }; }));
  mockResetStore.mockImplementation(async () => { events.push('reset'); });
  const { result } = await renderHook(() => useSignIn());
  let pending!: Promise<unknown>;
  await act(async () => { pending = result.current[0]({ username: 'reader', password: 'secret' }); });
  await waitFor(() => expect(mockSetAccessToken).toHaveBeenCalledWith('token'));
  expect(mockResetStore).not.toHaveBeenCalled();
  await act(async () => { persist(); await pending; });
  expect(events).toEqual(['authenticate', 'persist', 'reset']);
  expect(mockAuthenticate).toHaveBeenCalledWith({ variables: { credentials: { username: 'reader', password: 'secret' } } });
});

test('failed authentication leaves token storage and cached queries untouched', async () => {
  mockAuthenticate.mockRejectedValue(new Error('Invalid credentials'));
  const { result } = await renderHook(() => useSignIn());
  await expect(result.current[0]({ username: 'reader', password: 'wrong' })).rejects.toThrow('Invalid credentials');
  expect(mockSetAccessToken).not.toHaveBeenCalled(); expect(mockResetStore).not.toHaveBeenCalled();
});

test('missing authentication token is rejected before storage changes', async () => {
  mockAuthenticate.mockResolvedValue({ data: {} });
  const { result } = await renderHook(() => useSignIn());
  await expect(result.current[0]({ username: 'reader', password: 'secret' })).rejects.toThrow();
  expect(mockSetAccessToken).not.toHaveBeenCalled(); expect(mockResetStore).not.toHaveBeenCalled();
});

test('sign out waits for token removal before resetting queries and navigating', async () => {
  const events: string[] = []; let remove!: () => void;
  mockRemoveAccessToken.mockImplementation(() => new Promise<void>(resolve => { remove = () => { events.push('remove'); resolve(); }; }));
  mockResetStore.mockImplementation(async () => { events.push('reset'); });
  mockReplace.mockImplementation(() => { events.push('navigate'); });
  const screen = await render(<AppBar />);
  await fireEvent.press(screen.getByText('Sign out'));
  expect(mockRemoveAccessToken).toHaveBeenCalledTimes(1);
  expect(mockResetStore).not.toHaveBeenCalled();
  await act(async () => { remove(); });
  await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/'));
  expect(events).toEqual(['remove', 'reset', 'navigate']);
});
