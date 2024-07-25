import { expect, test } from '@playwright/test';

import enMessages from '../../../../messages/en.json';
import { createOrgData } from '../../constants/organisationData';
import {
  addressFormTestIds,
  organisationFormTestIds,
} from '../../constants/testIds';
import { checkPostcode } from '../../utils/organisation/postCodeAddressFlow';
import { checkEmailValidation } from '../../utils/organisation/validateForm';

test.beforeEach(async ({ page }) => {
  // Runs before each test and navigates to create organisation
  await page.goto('/organisations', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page).toHaveURL(/.*\/organisations\/new/);
});

test('Test: Create organisation - PostCode.eu check', async ({ page }) => {
  await checkPostcode(page, createOrgData.postCodetestAddress);
});

test('Test: Create organisation - Address Dialog Validations and checks asterisk symbol for required fields in address dialog', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Add address' }).click();
  const countryCodeElement = page.getByTestId(addressFormTestIds.country);
  const postalCodeElement = page.getByTestId(addressFormTestIds.postalCode);
  const houseNumberElement = page.getByTestId(addressFormTestIds.houseNumber);
  const streetElement = page.getByTestId(addressFormTestIds.street);
  const cityElement = page.getByTestId(addressFormTestIds.city);

  const houseNumberInputElement = houseNumberElement.locator('label').first();
  const houseNumberSpanElement = houseNumberInputElement
    .locator('span')
    .first();

  const postalCodeInputElement = postalCodeElement.locator('label').first();
  const postalCodeSpanElement = postalCodeInputElement.locator('span').first();

  const streetInput = streetElement.locator('label').first();
  const streetSpanElement = streetInput.locator('span').first();

  const countryLabelElement = countryCodeElement.locator('label').first();
  const countrySpanElement = countryLabelElement.locator('span').first();

  await expect(
    houseNumberSpanElement,
    'Asterisk in house number field'
  ).toContainText('*');
  await expect(
    postalCodeSpanElement,
    'Asterisk in postal code field'
  ).toContainText('*');
  await expect(streetSpanElement, 'Asterisk in street field').toContainText(
    '*'
  );
  await expect(
    countrySpanElement,
    'Asterisk in county code field'
  ).toContainText('*');

  await page.getByRole('button', { name: 'Add' }).click();
  await expect(postalCodeElement.getByText('Required field')).toBeVisible();
  await expect(houseNumberElement.getByText('Required field')).toBeVisible();
  await expect(streetElement.getByText('Required field')).toBeVisible();
  await expect(cityElement.getByText('Required field')).not.toBeVisible();
});

test('Test: Create organisation - Verify email input validation and asterisk in name, type and email field', async ({
  page,
}) => {
  const nameInputField = page.getByTestId(organisationFormTestIds.name);
  const nameLabelElement = nameInputField.locator('label').first();
  const nameSpanElement = nameLabelElement.locator('span').first();

  const organisationTypeInputField = page.getByTestId(
    organisationFormTestIds.type
  );
  const organisationTypeLabelElement = organisationTypeInputField
    .locator('label')
    .first();
  const organisationTypeSpanElement = organisationTypeLabelElement
    .locator('span')
    .first();

  const emailInputField = page.getByTestId(organisationFormTestIds.email);
  const emailLabelElement = emailInputField.locator('label').first();
  const emailSpanElement = emailLabelElement.locator('span').first();

  await expect(nameSpanElement, 'Asterisk in name field').toContainText('*');
  await expect(
    organisationTypeSpanElement,
    'Asterisk in name field'
  ).toContainText('*');
  await expect(emailSpanElement, 'Asterisk in name field').toContainText('*');

  await checkEmailValidation(page);
});

test('Test: Create organisation - Basic Form validations fail case', async ({
  page,
}) => {
  const kvkInput = page.getByTestId(
    `${organisationFormTestIds.kvkNumber}-input`
  );
  await kvkInput.click();
  await kvkInput.fill('123');

  await page.getByRole('button', { name: 'Save & Close' }).nth(1).click();
  await expect(
    page
      .getByTestId(organisationFormTestIds.kvkNumber)
      .getByText(enMessages.validationMessage.minEightCharacter)
  ).toBeVisible();

  await expect(
    page
      .getByTestId(organisationFormTestIds.name)
      .getByText(enMessages.validationMessage.mandatoryMessage)
  ).toBeVisible();

  await expect(
    page
      .getByTestId(organisationFormTestIds.type)
      .getByText(enMessages.validationMessage.mandatoryMessage)
  ).toBeVisible();

  await expect(
    page
      .getByTestId(organisationFormTestIds.email)
      .getByText(enMessages.validationMessage.mandatoryMessage)
  ).toBeVisible();
});
