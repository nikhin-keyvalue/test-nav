import { test } from '@playwright/test';

import { TEST_PASSWORD, TEST_USERNAME } from '@/constants/env';

import { waitForAuthToken } from '../utils/common/waitForAuthToken';

test('Authenticate', async ({ page }) => {
  await page.goto('/login');
  // TODO: add these variables in end to end test workflow
  await page.getByTestId('email').fill(TEST_USERNAME as string);
  await page.getByTestId('password').fill(TEST_PASSWORD as string);
  await page.getByTestId('signInButton').click();
  await waitForAuthToken(page, 'Login successfull');
  await page.context().storageState({
    path: 'tests/e2e/storage-states/auth.json',
  });
});
