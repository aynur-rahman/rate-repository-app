import { useState } from 'react';
import { Formik } from 'formik';
import { router } from 'expo-router';
import FormField from './FormField';
import FormScreen from './FormScreen';
import Button from './Button';
import Text from './Text';
import { ErrorMessage, errorMessage } from './Feedback';
import useSignIn from '../hooks/useSignIn';
import { signInSchema } from '../utils/validation';
import type { Credentials } from '../types';
export const SignInContainer = ({ onSubmit, error }: { onSubmit: (values: Credentials) => void | Promise<void>; error?: string }) => <Formik initialValues={{ username: '', password: '' }} validationSchema={signInSchema} onSubmit={onSubmit}>{({ handleSubmit, isSubmitting }) => <FormScreen><Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 20 }}>Sign in</Text><FormField name="username" label="Username" autoCapitalize="none" autoCorrect={false} autoComplete="username" /><FormField name="password" label="Password" secureTextEntry autoCapitalize="none" autoComplete="current-password" /><ErrorMessage message={error} /><Button disabled={isSubmitting} onPress={() => handleSubmit()}>{isSubmitting ? 'Signing in…' : 'Sign in'}</Button></FormScreen>}</Formik>;
export default function SignIn() {
  const [signIn] = useSignIn(); const [error, setError] = useState('');
  const submit = async (values: Credentials) => { setError(''); try { await signIn(values); router.replace('/'); } catch (e) { setError(errorMessage(e)); } };
  return <SignInContainer onSubmit={submit} error={error} />;
}
