import { test, expect } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';

const graphql = async (request: APIRequestContext, query: string, variables = {}, token = '') => {
  const response = await request.post('http://localhost:4000', { data: { query, variables }, headers: { authorization: token ? `Bearer ${token}` : '' } });
  expect(response.ok()).toBeTruthy();
  const result = await response.json();
  expect(result.errors).toBeUndefined();
  return result.data;
};

test('repository filtering and ordering use server variables and isolate cached results', async ({ page }) => {
  const variables: Record<string, unknown>[] = [];
  page.on('request', request => {
    if (request.url() === 'http://localhost:4000/' && request.method() === 'POST') {
      const body = request.postDataJSON();
      if (body.operationName === 'Repositories') variables.push(body.variables);
    }
  });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'View jaredpalmer/formik', exact: true })).toBeVisible();
  await page.getByLabel('Search repositories').fill('formik');
  await expect(page.getByRole('button', { name: /^View / })).toHaveCount(1);
  await page.getByLabel('Sort repositories').selectOption('highest');
  await expect.poll(() => variables.some(value => value.orderBy === 'RATING_AVERAGE' && value.orderDirection === 'DESC' && value.searchKeyword === 'formik')).toBe(true);
  await page.getByLabel('Sort repositories').selectOption('lowest');
  await expect.poll(() => variables.some(value => value.orderBy === 'RATING_AVERAGE' && value.orderDirection === 'ASC')).toBe(true);
  await page.getByLabel('Search repositories').fill('not-a-real-course-repository-xyz');
  await expect(page.getByText('No repositories found.')).toBeVisible();
  await page.getByLabel('Search repositories').fill('');
  await expect.poll(() => page.getByRole('button', { name: /^View / }).count()).toBeGreaterThan(1);
});

test('validates sign in and reports rejected credentials without losing input', async ({ page }) => {
  await page.goto('/sign-in');
  await page.getByRole('button', { name: 'Sign in', exact: true }).last().click();
  await expect(page.getByText('Username is required')).toBeVisible();
  await expect(page.getByText('Password is required')).toBeVisible();
  await page.getByLabel('Username', { exact: true }).fill('kalle');
  await page.getByLabel('Password', { exact: true }).fill('wrong-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).last().click();
  await expect(page.getByText('Invalid username or password', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Username', { exact: true })).toHaveValue('kalle');
});

test('registers, persists login, creates a review, cancels and confirms deletion, then signs out', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const username = `native${Date.now()}`;
  await page.goto('/sign-up');
  await page.getByLabel('Username', { exact: true }).fill(username);
  await page.getByLabel('Password', { exact: true }).fill('course-test-password');
  await page.getByLabel('Password confirmation', { exact: true }).fill('different');
  await page.getByRole('button', { name: 'Sign up', exact: true }).last().click();
  await expect(page.getByText('Passwords must match')).toBeVisible();
  await page.getByLabel('Password confirmation', { exact: true }).fill('course-test-password');
  await page.getByRole('button', { name: 'Sign up', exact: true }).last().click();
  await expect(page.getByRole('button', { name: 'Sign out', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Create a review', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Create a review', exact: true }).click();
  await page.getByLabel('Repository owner', { exact: true }).fill('jaredpalmer');
  await page.getByLabel('Repository name', { exact: true }).fill('formik');
  await page.getByLabel('Rating (0–100)', { exact: true }).fill('101');
  await page.getByRole('button', { name: 'Create review', exact: true }).click();
  await expect(page.getByText('Rating must be at most 100')).toBeVisible();
  await page.getByLabel('Rating (0–100)', { exact: true }).fill('88');
  await page.getByLabel('Review', { exact: true }).fill(`Local integration review ${username}`);
  await page.getByRole('button', { name: 'Create review', exact: true }).click();
  await expect(page).toHaveURL(/repository\/jaredpalmer.formik/);
  await expect(page.getByRole('button', { name: 'Open in GitHub' })).toBeVisible();
  await expect.poll(async () => {
    if (await page.getByText(`Local integration review ${username}`, { exact: true }).isVisible()) return true;
    await page.mouse.move(200, 650);
    await page.mouse.wheel(0, 650);
    return false;
  }, { timeout: 15000 }).toBe(true);
  await page.getByRole('button', { name: 'My reviews', exact: true }).click();
  await expect(page.getByText(`Local integration review ${username}`, { exact: true })).toBeVisible();
  page.once('dialog', dialog => dialog.dismiss());
  await page.getByRole('button', { name: 'Delete review' }).click();
  await expect(page.getByText(`Local integration review ${username}`, { exact: true })).toBeVisible();
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Delete review' }).click();
  await expect(page.getByText('You have not written any reviews yet.')).toBeVisible();
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
  await page.goto('/my-reviews');
  await expect(page).toHaveURL(/sign-in/);
});

test('repository reviews fetch the next cursor page without duplicates', async ({ page, request }) => {
  const suffix = Date.now();
  for (let i = 0; i < 7; i++) {
    const credentials = { username: `page${suffix}${i}`, password: 'pagination-password' };
    await graphql(request, 'mutation($user:CreateUserInput!){createUser(user:$user){id}}', { user: credentials });
    const data = await graphql(request, 'mutation($credentials:AuthenticateInput!){authenticate(credentials:$credentials){accessToken}}', { credentials });
    await graphql(request, 'mutation($review:CreateReviewInput!){createReview(review:$review){id}}', { review: { ownerName: 'jaredpalmer', repositoryName: 'formik', rating: 80, text: `Pagination ${suffix} item ${i}` } }, data.authenticate.accessToken);
  }
  await page.setViewportSize({ width: 390, height: 600 });
  const cursors: string[] = [];
  page.on('request', request => {
    if (request.url() === 'http://localhost:4000/' && request.method() === 'POST') {
      const body = request.postDataJSON();
      if (body.operationName === 'Repository' && body.variables.after) cursors.push(body.variables.after);
    }
  });
  await page.goto('/repository/jaredpalmer.formik');
  await expect(page.getByRole('button', { name: 'Open in GitHub' })).toBeVisible();
  await expect.poll(async () => {
    if (await page.getByText(`Pagination ${suffix} item 6`, { exact: true }).isVisible()) return true;
    await page.mouse.move(200, 450);
    await page.mouse.wheel(0, 600);
    return false;
  }, { timeout: 25000, intervals: [250, 500, 1000] }).toBe(true);
  expect(cursors.length).toBeGreaterThan(0);
  await expect(page.getByText(`Pagination ${suffix} item 0`, { exact: true })).toHaveCount(1);
  await expect(page.getByText(`Pagination ${suffix} item 6`, { exact: true })).toHaveCount(1);
});

test('narrow layout has no horizontal document overflow and unknown repositories show an error', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await expect(page.getByLabel('Search repositories')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto('/repository/missing.repository');
  await expect(page.getByText('Repository not found', { exact: true })).toBeVisible();
});
