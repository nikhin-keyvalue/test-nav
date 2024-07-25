import { expect, Page } from '@playwright/test';

import { VALIDATION_ERROR_MESSAGES } from '../../constants/errors';
import { organisationFormTestIds } from '../../constants/testIds';

export const checkEmailValidation = async (page: Page) => {
  const emailElement = page.getByTestId(organisationFormTestIds.email);
  await emailElement.locator('input').click();
  await emailElement.locator('input').fill('123456789');
  await emailElement.press('Enter');
  await expect(
    emailElement.getByText(VALIDATION_ERROR_MESSAGES.invalidEmail)
  ).toBeVisible();
  await emailElement.locator('input').fill('test+12@gmail.com');
  await page.getByText('Email', { exact: true }).click();
  await expect(
    emailElement.getByText(VALIDATION_ERROR_MESSAGES.invalidEmail)
  ).not.toBeVisible();
};
