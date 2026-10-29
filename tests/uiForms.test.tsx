import { act, fireEventAsync as fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { useMutation, useApolloClient } from '@apollo/client/react';
import { router } from 'expo-router';
import { SignInContainer } from '../src/components/SignIn';
import SignUp from '../src/components/SignUp';
import CreateReview from '../src/components/CreateReview';
import useSignIn from '../src/hooks/useSignIn';
import theme from '../src/theme';

jest.mock('expo-router', () => ({ router: { replace: jest.fn() } }));
jest.mock('@apollo/client/react', () => ({ useMutation: jest.fn(), useApolloClient: jest.fn() }));
jest.mock('../src/hooks/useSignIn', () => ({ __esModule: true, default: jest.fn() }));

const mutation = jest.fn();
const signIn = jest.fn();
const cache = { evict: jest.fn(), gc: jest.fn() };
beforeEach(() => {
  jest.mocked(useMutation).mockReturnValue([mutation, {}] as never);
  jest.mocked(useApolloClient).mockReturnValue({ cache } as never);
  jest.mocked(useSignIn).mockReturnValue([signIn, {}] as never);
  mutation.mockReset();
  signIn.mockReset();
});

describe('SignInContainer', () => {
  it('submits the filled username and password as its first argument asynchronously', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    await render(<SignInContainer onSubmit={onSubmit} />);
    await fireEvent.changeText(screen.getByLabelText('Username'), 'reader');
    await fireEvent.changeText(screen.getByLabelText('Password'), 'secret');
    await fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][0]).toEqual({ username: 'reader', password: 'secret' });
    expect(screen.getByLabelText('Password')).toHaveProp('secureTextEntry', true);
  });

  it('blocks an empty submission and marks both fields invalid', async () => {
    const onSubmit = jest.fn();
    await render(<SignInContainer onSubmit={onSubmit} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByText('Username is required')).toHaveStyle({ color: theme.colors.error });
    expect(screen.getByText('Password is required')).toHaveStyle({ color: theme.colors.error });
    expect(screen.getByLabelText('Username')).toHaveStyle({ borderColor: theme.colors.error });
    expect(screen.getByLabelText('Password')).toHaveStyle({ borderColor: theme.colors.error });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('prevents a second submission while the first is pending', async () => {
    let finish!: () => void;
    const onSubmit = jest.fn(() => new Promise<void>(resolve => { finish = resolve; }));
    await render(<SignInContainer onSubmit={onSubmit} />);
    await fireEvent.changeText(screen.getByLabelText('Username'), 'reader');
    await fireEvent.changeText(screen.getByLabelText('Password'), 'secret');
    await fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const button = screen.getByRole('button', { name: 'Signing in…' });
    expect(button).toBeDisabled();
    await fireEvent.press(button);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    await act(async () => finish());
  });
});

describe('SignUp', () => {
  it('rejects short usernames and mismatched confirmation before creating a user', async () => {
    await render(<SignUp />);
    await fireEvent.changeText(screen.getByLabelText('Username'), 'ab');
    await fireEvent.changeText(screen.getByLabelText('Password'), 'secret');
    await fireEvent.changeText(screen.getByLabelText('Password confirmation'), 'different');
    await fireEvent.press(screen.getByRole('button', { name: 'Sign up' }));
    expect(await screen.findByText('Username must have at least 5 characters')).toBeOnTheScreen();
    expect(screen.getByText('Passwords must match')).toBeOnTheScreen();
    expect(mutation).not.toHaveBeenCalled();
    expect(signIn).not.toHaveBeenCalled();
  });

  it('creates the account, signs it in, then navigates to the repository list', async () => {
    mutation.mockResolvedValue({ data: { createUser: { id: 'user-1' } } });
    signIn.mockResolvedValue({});
    await render(<SignUp />);
    await fireEvent.changeText(screen.getByLabelText('Username'), 'reader');
    await fireEvent.changeText(screen.getByLabelText('Password'), 'secret');
    await fireEvent.changeText(screen.getByLabelText('Password confirmation'), 'secret');
    await fireEvent.press(screen.getByRole('button', { name: 'Sign up' }));
    await waitFor(() => expect(router.replace).toHaveBeenCalledWith('/'));
    expect(mutation).toHaveBeenCalledWith({ variables: { user: { username: 'reader', password: 'secret' } } });
    expect(signIn).toHaveBeenCalledWith({ username: 'reader', password: 'secret' });
    expect(mutation.mock.invocationCallOrder[0]).toBeLessThan(signIn.mock.invocationCallOrder[0]);
    expect(signIn.mock.invocationCallOrder[0]).toBeLessThan(jest.mocked(router.replace).mock.invocationCallOrder[0]);
  });
});

describe('CreateReview', () => {
  const fill = async (rating: string) => {
    await fireEvent.changeText(screen.getByLabelText('Repository owner'), 'jaredpalmer');
    await fireEvent.changeText(screen.getByLabelText('Repository name'), 'formik');
    await fireEvent.changeText(screen.getByLabelText('Rating (0–100)'), rating);
  };

  it('rejects a rating outside the valid range without sending a mutation', async () => {
    await render(<CreateReview />);
    await fill('101');
    await fireEvent.press(screen.getByRole('button', { name: 'Create review' }));
    expect(await screen.findByText('Rating must be at most 100')).toBeOnTheScreen();
    expect(mutation).not.toHaveBeenCalled();
  });

  it('allows rating zero and an omitted text, and opens the created review repository', async () => {
    mutation.mockResolvedValue({ data: { createReview: { id: 'review-1', repositoryId: 'jaredpalmer.formik' } } });
    await render(<CreateReview />);
    await fill('0');
    await fireEvent.press(screen.getByRole('button', { name: 'Create review' }));
    await waitFor(() => expect(router.replace).toHaveBeenCalledWith({ pathname: '/repository/[id]', params: { id: 'jaredpalmer.formik' } }));
    expect(mutation).toHaveBeenCalledWith({ variables: { review: { ownerName: 'jaredpalmer', repositoryName: 'formik', rating: 0, text: '' } } });
  });

  it('preserves input and exposes an API error when creation fails', async () => {
    mutation.mockRejectedValue(new Error('You already reviewed this repository'));
    await render(<CreateReview />);
    await fill('80');
    await fireEvent.changeText(screen.getByLabelText('Review'), 'Useful forms');
    await fireEvent.press(screen.getByRole('button', { name: 'Create review' }));
    expect(await screen.findByText('You already reviewed this repository')).toBeOnTheScreen();
    expect(screen.getByLabelText('Review')).toHaveProp('value', 'Useful forms');
    expect(screen.getByLabelText('Rating (0–100)')).toHaveProp('value', '80');
    expect(router.replace).not.toHaveBeenCalled();
  });
});
