import test, { expect } from '@playwright/test';

import {
  addressFormTestIds,
  ellipsisMenuTestIds,
  personFormTestIds,
} from '../../constants/testIds';
import { getIdFromUrl } from '../../utils/common/getIdFromUrl';
import {
  createNewPerson,
  editPerson,
  getNewPersonDetails,
  getSampleEditPersonData,
  verifyEditedPersonInDetailsPage,
} from '../../utils/person/personFormHelpers';

test('test the CTAs to navigate to person edit page works', async ({
  page,
}) => {
  const newPersonData1 = getNewPersonDetails();

  // navigate to person menu
  await page.goto('/persons');
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page).toHaveURL(/.*\/persons\/new/);

  //   creating a new person to make sure that atleast one person exists
  await createNewPerson(page, newPersonData1);
  const personId = getIdFromUrl(page);

  //   verify navigation to edit-page from person-details
  await page.getByRole('button', { name: 'Edit' }).click();
  await expect(page).toHaveURL(new RegExp(`/.*${personId}/edit`));

  //   verify navigation to edit-page from person-listing
  await page.goto('/persons');
  await page
    .getByTestId(`table-row-0-${ellipsisMenuTestIds.ellipsisMenuButton}-icon`)
    .first()
    .click();
  await page.getByTestId('person-table-menu-edit-person').click();
  await expect(page).toHaveURL(/.*\/edit/);
});

test('test edit of a person', async ({ page }) => {
  const newPersonData1 = getNewPersonDetails();

  // navigate to person menu
  await page.goto('/persons');
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page).toHaveURL(/.*\/persons\/new/);

  //   creating a new person to make sure that atleast one person exists
  await createNewPerson(page, newPersonData1);

  // navigate to person edit from person details page
  await page.getByRole('button', { name: 'Edit' }).click();

  const lastNameLabel = page.getByTestId(personFormTestIds.lastName);
  const lastNameLabelElement = lastNameLabel.locator('label').first();
  const lastNameSpanElement = lastNameLabelElement.locator('span').first();

  const typeLabel = page.getByTestId(personFormTestIds.type);
  const typeLabelElement = typeLabel.locator('label').first();
  const typeSpanElement = typeLabelElement.locator('span').first();

  const emailLabel = page.getByTestId(personFormTestIds.newEmail);
  const emailLabelElement = emailLabel.locator('label').first();

  await expect(
    lastNameSpanElement,
    'Verify asterisk is present in last name field'
  ).toContainText('*');
  await expect(
    typeSpanElement,
    'Verify asterisk is present in type field'
  ).toContainText('*');
  await expect(
    emailLabelElement,
    'Verify asterisk is present in email field'
  ).not.toContainText('*');

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

  const sampleEditPersonData = getSampleEditPersonData();
  await editPerson(page, sampleEditPersonData);

  await verifyEditedPersonInDetailsPage(page, sampleEditPersonData);
});
