import { expect, Page } from '@playwright/test';

import getAuthToken from './getAuthToken';

export const waitForAuthToken = (page: Page, message: string) =>
  expect(async () => {
    const authToken = await getAuthToken(page);
    expect(authToken).toBeTruthy();
  }, message ?? 'Auth token present in cookies').toPass({
    intervals: [2000, 3000, 5000],
    timeout: 15000,
  });