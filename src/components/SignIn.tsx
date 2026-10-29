import { Formik } from 'formik';
import FormField from './FormField';
import FormScreen from './FormScreen';
import Button from './Button';
import Text from './Text';
import { signInSchema } from '../utils/validation';
import type { Credentials } from '../types';
export default function SignIn() {
  const submit = (values: Credentials) => { console.log(values); };
  return <Formik initialValues={{ username: '', password: '' }} validationSchema={signInSchema} onSubmit={submit}>{({ handleSubmit, isSubmitting }) => <FormScreen><Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 20 }}>Sign in</Text><FormField name="username" label="Username" autoCapitalize="none" autoCorrect={false} autoComplete="username" /><FormField name="password" label="Password" secureTextEntry autoCapitalize="none" autoComplete="current-password" /><Button disabled={isSubmitting} onPress={() => handleSubmit()}>Sign in</Button></FormScreen>}</Formik>;
}
