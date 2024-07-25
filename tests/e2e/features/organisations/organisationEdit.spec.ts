import test, { expect } from '@playwright/test';

import {
  editOrgCookieName,
  editOrgData,
  testDataForOrgEdit,
} from '../../constants/organisationData';
import {
  addressFormTestIds,
  organisationDetailTestIds,
  organisationFormTestIds,
} from '../../constants/testIds';
import { getTestCookie } from '../../utils/common/cookieFunctions';
import {
  editOrganisation,
  verifyEditedOrganisationInDetailsPage,
} from '../../utils/organisation/organisationFormHelpers';

let orgId = '';

test.beforeEach(async ({ page, context }) => {
  orgId = (await getTestCookie(context, editOrgCookieName)) as string;
  // navigate to organisation detail
  await page.goto(`/organisations/${orgId}/details`);
  await expect(page).toHaveURL(/.*details/);
});

test('Org Edit : Test the CTAs to navigate to organisations edit page works', async ({
  page,
}) => {
  await page.getByTestId(organisationDetailTestIds.editOrgBtn).click();
  await expect(page).toHaveURL(new RegExp(`/.*${orgId}/edit`));

  await page.goto('/organisations');
  const listRowMenu = page.locator(
    `//table//*[text()='${editOrgData.kvkData.name}']/ancestor::tr//button[@id='long-button']`
  );

  await listRowMenu.click();
  await page.getByRole('menuitem', { name: 'Edit' }).click();
  await expect(page).toHaveURL(new RegExp(`/.*${orgId}/edit`));
});

test('Org Edit : Test edit of an organisation and checks asterisk symbol for required fields', async ({
  page,
}) => {
  // navigate to organisation edit from organisation details page
  await page.getByRole('button', { name: 'Edit' }).click();

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

  await expect(nameSpanElement, 'Asterisk in name field').toContainText('*');
  await expect(
    organisationTypeSpanElement,
    'Asterisk in name field'
  ).toContainText('*');
  await expect(emailLabelElement, 'Asterisk in name field').not.toContainText(
    '*'
  );

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

  await editOrganisation(page, testDataForOrgEdit);

  await verifyEditedOrganisationInDetailsPage(page, testDataForOrgEdit);
});
