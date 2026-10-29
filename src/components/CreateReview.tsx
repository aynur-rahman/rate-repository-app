import { useState } from 'react';
import { Formik } from 'formik';
import { useMutation, useApolloClient } from '@apollo/client/react';
import { router } from 'expo-router';
import { CREATE_REVIEW } from '../graphql/queries';
import { reviewSchema } from '../utils/validation';
import type { ReviewValues } from '../types';
import FormField from './FormField'; import FormScreen from './FormScreen'; import Button from './Button'; import Text from './Text'; import { ErrorMessage, errorMessage } from './Feedback';
export default function CreateReview() {
  const [createReview] = useMutation<{ createReview: { id: string; repositoryId: string } }>(CREATE_REVIEW); const client = useApolloClient(); const [error, setError] = useState('');
  const submit = async (values: ReviewValues) => {
    setError('');
    try {
      const { data } = await createReview({ variables: { review: { ...values, rating: Number(values.rating) } } });
      if (!data?.createReview) throw new Error('Review was not created');
      client.cache.evict({ fieldName: 'repositories' });
      client.cache.evict({ id: `Repository:${data.createReview.repositoryId}`, fieldName: 'reviews' });
      client.cache.gc();
      router.replace({ pathname: '/repository/[id]', params: { id: data.createReview.repositoryId } });
    } catch (e) { setError(errorMessage(e)); }
  };
  return <Formik initialValues={{ ownerName: '', repositoryName: '', rating: '', text: '' }} validationSchema={reviewSchema} onSubmit={submit}>{({ handleSubmit, isSubmitting }) => <FormScreen><Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 20 }}>Create a review</Text><FormField name="ownerName" label="Repository owner" autoCapitalize="none" autoCorrect={false} /><FormField name="repositoryName" label="Repository name" autoCapitalize="none" autoCorrect={false} /><FormField name="rating" label="Rating (0–100)" keyboardType="numeric" /><FormField name="text" label="Review" multiline /><ErrorMessage message={error} /><Button disabled={isSubmitting} onPress={() => handleSubmit()}>{isSubmitting ? 'Saving…' : 'Create review'}</Button></FormScreen>}</Formik>;
}
