import { expect, Page } from '@playwright/test';

import { VALIDATION_ERROR_MESSAGES } from '../../constants/errors';
import { personFormTestIds } from '../../constants/testIds';
import { generateUniqueEmailId } from '../common/generateUniqueEmailId';

export const validateRequiredFields = async (page: Page) => {
  const email = generateUniqueEmailId();
  await page
    .getByTestId(`${personFormTestIds.submitBtnBottom}-save-btn`)
    .click();
  await expect(
    page.locator(`#${personFormTestIds.lastName}-helper-text`)
  ).toHaveText(VALIDATION_ERROR_MESSAGES.mandatory);
  await expect(
    page.locator(`#${personFormTestIds.type}-helper-text`)
  ).toHaveText(VALIDATION_ERROR_MESSAGES.mandatory);
  await expect(
    page.locator(`#${personFormTestIds.newEmail}-helper-text`)
  ).toHaveText(VALIDATION_ERROR_MESSAGES.mandatory);

  await page.getByTestId(`${personFormTestIds.lastName}-input`).click();
  await page.getByTestId(`${personFormTestIds.lastName}-input`).fill('john');
  await page.getByLabel('Type').click();
  await page.getByRole('option', { name: 'Private' }).click();
  await page.getByTestId(`${personFormTestIds.newEmail}-input`).click();
  await page.getByTestId(`${personFormTestIds.newEmail}-input`).fill(email);
  await page.getByTestId(`${personFormTestIds.newEmail}-input`).press('Enter');

  await expect(
    page.locator(`#${personFormTestIds.lastName}-helper-text`)
  ).not.toBeVisible();
  await expect(
    page.locator(`#${personFormTestIds.type}-helper-text`)
  ).not.toBeVisible();
  await expect(
    page.locator(`#${personFormTestIds.newEmail}-helper-text`)
  ).not.toBeVisible();
};

export const verifyInvalidNameInputValidations = async (page: Page) => {
  await page.getByTestId(`${personFormTestIds.initials}-input`).click();
  await page.getByTestId(`${personFormTestIds.initials}-input`).fill('[jo');
  await page.getByTestId(`${personFormTestIds.firstName}-input`).click();
  await page.getByTestId(`${personFormTestIds.firstName}-input`).fill(']]]]]]');
  await page.getByTestId(`${personFormTestIds.middleName}-input`).click();
  await page
    .getByTestId(`${personFormTestIds.middleName}-input`)
    .fill('()=>{}');
  await page.getByTestId(`${personFormTestIds.lastName}-input`).click();
  await page.getByTestId(`${personFormTestIds.lastName}-input`).fill('333');
  await page.getByRole('button', { name: 'Save & Close' }).nth(1).click();
  expect(page.locator(`#${personFormTestIds.initials}-helper-text`)).toHaveText(
    VALIDATION_ERROR_MESSAGES.invalidName
  );
  expect(
    page.locator(`#${personFormTestIds.firstName}-helper-text`)
  ).toHaveText(VALIDATION_ERROR_MESSAGES.invalidName);
  expect(
    page.locator(`#${personFormTestIds.middleName}-helper-text`)
  ).toHaveText(VALIDATION_ERROR_MESSAGES.invalidName);
  expect(page.locator(`#${personFormTestIds.lastName}-helper-text`)).toHaveText(
    VALIDATION_ERROR_MESSAGES.invalidName
  );

  await page.getByTestId(`${personFormTestIds.initials}-input`).click();
  await page.getByTestId(`${personFormTestIds.initials}-input`).fill('b');
  await page.getByTestId(`${personFormTestIds.firstName}-input`).click();
  await page.getByTestId(`${personFormTestIds.firstName}-input`).fill('bella');
  await page.getByTestId(`${personFormTestIds.middleName}-input`).click();
  await page.getByTestId(`${personFormTestIds.middleName}-input`).fill('usuf');
  await page.getByTestId(`${personFormTestIds.lastName}-input`).click();
  await page.getByTestId(`${personFormTestIds.lastName}-input`).fill('ali');

  await expect(
    page.locator(`#${personFormTestIds.initials}-helper-text`)
  ).not.toBeVisible();
  await expect(
    page.locator(`#${personFormTestIds.firstName}-helper-text`)
  ).not.toBeVisible();
  await expect(
    page.locator(`#${personFormTestIds.middleName}-helper-text`)
  ).not.toBeVisible();
  await expect(
    page.locator(`#${personFormTestIds.lastName}-helper-text`)
  ).not.toBeVisible();
};

export const checkPhoneNumberValidation = async (page: Page) => {
  /* Note: verify that the default selected country-code=NL in code (Netherlands) for the phone number input field.
   Test may need to be updated if default-selected-country is changed. Current validation is applicable for country-code=NL
   */
  await page.getByTestId('phone-number-input').click();
  await page.getByTestId('phone-number-input').fill('12345678987654321');
  await page.getByTestId('phone-number-input').press('Enter');
  await expect(page.getByTestId('phone-number-input-helper-text')).toHaveText(
    VALIDATION_ERROR_MESSAGES.invalidPhoneNumber
  );

  await page.getByTestId('phone-number-input').click();
  await page.getByTestId('phone-number-input').fill('123456789');
  await page.getByTestId('phone-number-input').press('Enter');
  await expect(
    page.getByTestId('phone-number-input-helper-text')
  ).not.toBeVisible();
};

export const checkEmailValidation = async (page: Page) => {
  await page.getByTestId(personFormTestIds.newEmail).locator('input').click();
  await page
    .getByTestId(personFormTestIds.newEmail)
    .locator('input')
    .fill('123456789');
  await page.getByTestId(personFormTestIds.newEmail).press('Enter');
  await expect(
    page.locator(`#${personFormTestIds.newEmail}-helper-text`)
  ).toHaveText(VALIDATION_ERROR_MESSAGES.invalidEmail);

  await page
    .getByTestId(personFormTestIds.newEmail)
    .locator('input')
    .fill('test+12@gmail.com');
  await page.getByTestId(personFormTestIds.newEmail).press('Enter');
  await expect(page.locator('#newEmail-helper-text')).not.toBeVisible();
};
