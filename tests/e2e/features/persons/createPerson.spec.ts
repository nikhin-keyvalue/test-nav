import { expect, test } from '@playwright/test';

import { addressFormTestIds, personFormTestIds } from '../../constants/testIds';
import { generateUniqueEmailId } from '../../utils/common/generateUniqueEmailId';
import {
  address1,
  address2,
  createNewPerson,
  getNewPersonDetails,
  verifyCreatedPersonInDetailsPage,
} from '../../utils/person/personFormHelpers';
import {
  checkEmailValidation,
  checkPhoneNumberValidation,
  validateRequiredFields,
  verifyInvalidNameInputValidations,
} from '../../utils/person/validateForm';

test.beforeEach(async ({ page }) => {
  // Runs before each test and navigates to create person
  await page.goto('/persons');
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page).toHaveURL(/.*\/persons\/new/);
});

test('test adding a new person, check the asterisk symbol in all required fields', async ({
  page,
}) => {
  const lastNameLabel = page.getByTestId(personFormTestIds.lastName);
  const lastNameLabelElement = lastNameLabel.locator('label').first();
  const lastNameSpanElement = lastNameLabelElement.locator('span').first();

  const typeLabel = page.getByTestId(personFormTestIds.type);
  const typeLabelElement = typeLabel.locator('label').first();
  const typeSpanElement = typeLabelElement.locator('span').first();

  const emailLabel = page.getByTestId(personFormTestIds.newEmail);
  const emailLabelElement = emailLabel.locator('label').first();
  const emailSpanElement = emailLabelElement.locator('span').first();

  await expect(
    lastNameSpanElement,
    'Verify asterisk is present in last name field'
  ).toContainText('*');
  await expect(
    typeSpanElement,
    'Verify asterisk is present in type field'
  ).toContainText('*');
  await expect(
    emailSpanElement,
    'Verify asterisk is present in email field'
  ).toHaveText('*');

  await page.getByRole('button', { name: 'Add address' }).click();
  const countryCodeElement = page.getByTestId(addressFormTestIds.country);
  const postalCodeElement = page.getByTestId(addressFormTestIds.postalCode);
  const houseNumberElement = page.getByTestId(addressFormTestIds.houseNumber);
  const streetElement = page.getByTestId(addressFormTestIds.street);

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

  await page.getByRole('button', { name: 'Cancel' }).click();

  const newPersonData = getNewPersonDetails();

  await createNewPerson(page, newPersonData);

  await verifyCreatedPersonInDetailsPage(page, newPersonData);
});

test('verify that create person page submit buttons and back arrow works', async ({
  page,
}) => {
  await page.getByTestId('create-person-form-header-save-button-top').click();
  // Looking for alteast one validation error to ensure that submit button click works as expected
  await expect(
    page.locator(`#${personFormTestIds.lastName}-helper-text`)
  ).toBeVisible();
  await page
    .getByTestId(`${personFormTestIds.submitBtnBottom}-save-btn`)
    .click();
  await page.getByTestId('create-person-form-header-back-arrow-button').click();
  await expect(page).toHaveURL(/.*persons/);
});

test('create person should show validation errors if required fields are not filled', async ({
  page,
}) => {
  await validateRequiredFields(page);
  await page
    .getByTestId(`${personFormTestIds.submitBtnBottom}-save-btn`)
    .click();
  await expect(page).toHaveURL(/.*details/);
});

test('create person should show validation errors if invalid-name inputs are entered', async ({
  page,
}) => {
  await verifyInvalidNameInputValidations(page);
});

test('create person should show validation error if invalid phone-number is entered', async ({
  page,
}) => {
  await checkPhoneNumberValidation(page);
});

test('verify email input validation', async ({ page }) => {
  await checkEmailValidation(page);
});

test('For person with type=business, additional validation must be checked for', async ({
  page,
}) => {
  await page.getByLabel('Last Name').click();
  await page.getByLabel('Last Name').fill('john');
  await page
    .getByTestId(personFormTestIds.newEmail)
    .locator('input')
    .fill('test+12@gmail.com');
  await page.getByTestId(personFormTestIds.newEmail).press('Enter');
  await page.getByLabel('Type').click();
  await page.getByRole('option', { name: 'Business' }).click();
  await page.getByRole('button', { name: 'Save & Close' }).nth(1).click();
  // auto-complete helpertext is not locatable by id, hence text matched
  await expect(
    page.getByText('Organisation is required for Business Customers')
  ).toBeVisible();

  await page.getByLabel('Business organisation').click();
  // note: if no organisations are created, select option from dropdown could fail. Atleast 1 organisation must be present.
  await page
    .getByRole('listbox', { name: 'Business organisation' })
    .getByRole('option')
    .first()
    .click();
  await expect(
    page.getByText('Organisation is required for Business Customers')
  ).not.toBeVisible();
});

test('Set as primary and delete email functionalities checked', async ({
  page,
}) => {
  const email1 = generateUniqueEmailId();

  await page.getByLabel('Last Name').click();
  await page.getByLabel('Last Name').fill('john');
  await page.getByLabel('Type').click();
  await page.getByRole('option', { name: 'Private' }).click();
  await page.getByLabel('Add e-mail address').click();
  await page.getByLabel('Add e-mail address').fill(email1);
  await page.getByLabel('Add e-mail address').press('Enter');
  const email2 = generateUniqueEmailId();
  await page.getByLabel('Add e-mail address').click();
  await page.getByLabel('Add e-mail address').fill(email2);
  await page.getByLabel('Add e-mail address').press('Enter');
  await page
    .locator('span')
    .filter({ hasText: email2 })
    .getByLabel('more')
    .click();
  await page.getByRole('menuitem', { name: 'Set as primary' }).click();
  await page
    .locator('span')
    .filter({ hasText: email1 })
    .getByLabel('more')
    .click();
  await page.getByRole('menuitem', { name: 'Delete e-mail' }).click();
  await page.getByRole('button', { name: 'Save & Close' }).nth(1).click();
  // note: expecting to go to details page once create person request succeeds
  await expect(page).toHaveURL(/.*details/);
  // note: expect to find the primary email correctly in details page
  await expect(page.getByTestId('primary-email-value')).toHaveText(email2);
});

test('verify set as primary and delete Address functionality', async ({
  page,
}) => {
  // filling out mandatory fields
  const email1 = generateUniqueEmailId();

  await page.getByLabel('Last Name').click();
  await page.getByLabel('Last Name').fill('john');
  await page.getByLabel('Type').click();
  await page.getByRole('option', { name: 'Private' }).click();
  await page.getByLabel('Add e-mail address').click();
  await page.getByLabel('Add e-mail address').fill(email1);
  await page.getByLabel('Add e-mail address').press('Enter');

  // Add address1
  await page.getByRole('button', { name: 'Add address' }).click();
  await page.getByTestId(addressFormTestIds.country).click();
  await page.getByRole('option', { name: address1.country }).click();
  await page.getByTestId(`${addressFormTestIds.postalCode}-input`).click();
  await page
    .getByTestId(`${addressFormTestIds.postalCode}-input`)
    .fill(address1.postalCode);
  await page.getByTestId(`${addressFormTestIds.houseNumber}-input`).click();
  await page
    .getByTestId(`${addressFormTestIds.houseNumber}-input`)
    .fill(address1.houseNumber);
  await page.getByTestId(`${addressFormTestIds.street}-input`).click();
  await page
    .getByTestId(`${addressFormTestIds.street}-input`)
    .fill(address1.street);
  await page.getByTestId(`${addressFormTestIds.city}-input`).click();
  await page
    .getByTestId(`${addressFormTestIds.city}-input`)
    .fill(address1.city);
  await page.getByRole('button', { name: 'Add' }).click();

  // Add address2
  await page.getByRole('button', { name: 'Add address' }).click();
  await page.getByTestId(addressFormTestIds.country).click();
  await page.getByRole('option', { name: address2.country }).click();
  await page.getByTestId(`${addressFormTestIds.postalCode}-input`).click();
  await page
    .getByTestId(`${addressFormTestIds.postalCode}-input`)
    .fill(address2.postalCode);
  await page.getByTestId(`${addressFormTestIds.houseNumber}-input`).click();
  await page
    .getByTestId(`${addressFormTestIds.houseNumber}-input`)
    .fill(address2.houseNumber);
  await page.getByTestId(`${addressFormTestIds.street}-input`).click();
  await page
    .getByTestId(`${addressFormTestIds.street}-input`)
    .fill(address2.street);
  await page.getByTestId(`${addressFormTestIds.city}-input`).click();
  await page
    .getByTestId(`${addressFormTestIds.city}-input`)
    .fill(address2.city);
  await page.getByRole('button', { name: 'Add' }).click();

  // Edit, delete address flow check with primary address change
  await page
    .locator('span')
    .filter({ hasText: 'Angola, 456789, 2, heret' })
    .getByLabel('more')
    .click();
  await page.getByRole('menuitem', { name: 'Set as primary' }).click();
  await page
    .locator('span')
    .filter({ hasText: 'Brazil, 345678, 3, lehar' })
    .getByLabel('more')
    .click();
  await page.getByRole('menuitem', { name: 'Delete address' }).click();

  await page.getByRole('button', { name: 'Save & Close' }).nth(1).click();
  await expect(page).toHaveURL(/.*details/);

  await expect(page.getByTestId('primary-address-value')).toHaveText(
    'AO, 2, heret street, 456789, heron'
  );
});
