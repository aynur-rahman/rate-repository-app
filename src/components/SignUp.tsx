import { useState } from 'react';
import { Formik } from 'formik';
import { useMutation } from '@apollo/client/react';
import { router } from 'expo-router';
import { CREATE_USER } from '../graphql/queries';
import useSignIn from '../hooks/useSignIn';
import { signUpSchema } from '../utils/validation';
import type { SignUpValues } from '../types';
import FormField from './FormField'; import FormScreen from './FormScreen'; import Button from './Button'; import Text from './Text'; import { ErrorMessage, errorMessage } from './Feedback';
export default function SignUp() {
  const [createUser] = useMutation(CREATE_USER); const [signIn] = useSignIn(); const [error, setError] = useState('');
  const submit = async ({ username, password }: SignUpValues) => {
    setError('');
    try { await createUser({ variables: { user: { username, password } } }); await signIn({ username, password }); router.replace('/'); }
    catch (e) { setError(errorMessage(e)); }
  };
  return <Formik initialValues={{ username: '', password: '', passwordConfirmation: '' }} validationSchema={signUpSchema} onSubmit={submit}>{({ handleSubmit, isSubmitting }) => <FormScreen><Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 20 }}>Sign up</Text><FormField name="username" label="Username" autoCapitalize="none" autoCorrect={false} /><FormField name="password" label="Password" secureTextEntry autoCapitalize="none" /><FormField name="passwordConfirmation" label="Password confirmation" secureTextEntry autoCapitalize="none" /><ErrorMessage message={error} /><Button disabled={isSubmitting} onPress={() => handleSubmit()}>{isSubmitting ? 'Creating account…' : 'Sign up'}</Button></FormScreen>}</Formik>;
}
