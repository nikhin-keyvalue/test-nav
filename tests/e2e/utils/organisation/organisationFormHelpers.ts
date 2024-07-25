/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { expect, Page } from '@playwright/test';

import {
  addressFormTestIds,
  ellipsisMenuTestIds,
  organisationDetailTestIds,
  organisationFormTestIds,
} from '../../constants/testIds';
import { OrganisationInputDataProps } from '../../types';
import { checkPhoneNumberInput } from './checkPhoneNumberInput';

export const createNewOrganisation = async (
  page: Page,
  organisationData: OrganisationInputDataProps
) => {
  // enter values in the form
  // KVK number based address lookup test
  const kvkInputField = page.getByTestId(
    `${organisationFormTestIds.kvkNumber}-input`
  );
  await kvkInputField.click();
  await kvkInputField.fill(organisationData.kvkData.KvKNumber);
  await page.getByText('Add organisation').click();

  await expect(
    page.getByTestId(`${organisationFormTestIds.name}-input`)
  ).toHaveValue(organisationData.kvkData.name);
  await expect(page.getByTestId(organisationFormTestIds.website)).toHaveValue(
    organisationData.kvkData.website
  );
  await expect(page.getByText('Netherlands, 2592HC, 63,')).toHaveText(
    organisationData.kvkData.addressString
  );

  // VAT and Organisation Type
  await page
    .getByTestId(organisationFormTestIds.vatNumber)
    .fill(organisationData.VATNumber);
  await page.locator(`#${organisationFormTestIds.type}`).click();
  await page.getByRole('option', { name: organisationData.type }).click();

  // Phone Number test
  await checkPhoneNumberInput(page, organisationData.phoneNumberList);

  // input primary email
  await page
    .getByTestId(`${organisationFormTestIds.email}-input`)
    .fill(organisationData.email);
  await page.getByText('Add organisation').click();

  await page
    .getByTestId(`${organisationFormTestIds.email}-input`)
    .fill(organisationData.alternateEmail);

  await page.getByText('Address', { exact: true }).click();

  // Add address flow check
  await page.locator(`#${organisationFormTestIds.addAddressBtn}`).click();
  await page.getByTestId(addressFormTestIds.country).click();
  await page
    .getByRole('option', { name: organisationData.address.country })
    .click();
  await page
    .getByTestId(`${addressFormTestIds.postalCode}-input`)
    .fill(organisationData.address.postalCode);
  await page
    .getByTestId(`${addressFormTestIds.houseNumber}-input`)
    .fill(organisationData.address.houseNumber);
  await page
    .getByTestId(`${addressFormTestIds.street}-input`)
    .fill(organisationData.address.street);
  await page
    .getByTestId(`${addressFormTestIds.city}-input`)
    .fill(organisationData.address.city);
  await page.getByRole('button', { name: 'Add' }).click();

  // Edit, delete address flow check with primary address change
  await page
    .locator('span')
    .filter({
      hasText: `Mexico, 123456, ${organisationData.address.houseNumber}, baylee`,
    })
    .getByTestId(`${ellipsisMenuTestIds.ellipsisMenuButton}-icon`)
    .click();
  await page.getByRole('menuitem', { name: 'Set as primary' }).click();
  await page
    .locator('span')
    .filter({ hasText: 'Netherlands, 2592HC, 63,' })
    .getByLabel('more')
    .click();
  await page.getByRole('menuitem', { name: 'Delete address' }).click();

  await page
    .getByTestId(`${organisationFormTestIds.submitBtnBottom}-save-btn`)
    .click();

  await expect(page).toHaveURL(/.*details/);
};

export const createNewOrganisationForDetails = async (
  page: Page,
  organisationData: OrganisationInputDataProps
) => {
  // enter values in the form
  // KVK number based address lookup test
  const kvkInputField = page.getByTestId(
    `${organisationFormTestIds.kvkNumber}-input`
  );
  await kvkInputField.click();
  await kvkInputField.fill(organisationData.kvkData.KvKNumber);
  await page.getByText('Add organisation').click();

  await expect(
    page.getByTestId(`${organisationFormTestIds.name}-input`)
  ).toHaveValue(organisationData.kvkData.name);
  await expect(page.getByTestId(organisationFormTestIds.website)).toHaveValue(
    organisationData.kvkData.website
  );

  // VAT and Organisation Type
  await page
    .getByTestId(organisationFormTestIds.vatNumber)
    .fill(organisationData.VATNumber);
  await page.locator(`#${organisationFormTestIds.type}`).click();
  await page.getByRole('option', { name: organisationData.type }).click();

  // Phone Number test
  await checkPhoneNumberInput(page, organisationData.phoneNumberList);

  // input primary email
  await page
    .getByTestId(`${organisationFormTestIds.email}-input`)
    .fill(organisationData.email);
  await page.getByText('Add organisation').click();

  await page
    .getByTestId(`${organisationFormTestIds.email}-input`)
    .fill(organisationData.alternateEmail);

  await page.getByText('Address', { exact: true }).click();

  await page
    .getByTestId(`${organisationFormTestIds.submitBtnBottom}-save-btn`)
    .click();

  await expect(page).toHaveURL(/.*details/);
};

export const editOrganisation = async (
  page: Page,
  organisationData: OrganisationInputDataProps
) => {
  // enter values in the form

  await page
    .getByTestId(`${organisationFormTestIds.name}-input`)
    .fill(organisationData.name);

  await page
    .getByTestId(organisationFormTestIds.vatNumber)
    .fill(organisationData.VATNumber);

  // Phone Number test
  await checkPhoneNumberInput(page, organisationData.phoneNumberList);

  // input primary email
  await page
    .getByTestId(`${organisationFormTestIds.email}-input`)
    .fill(organisationData.email);
  await page.getByText('Edit Organisation details').click();

  await page
    .getByTestId(`${organisationFormTestIds.email}-input`)
    .fill(organisationData.alternateEmail);

  await page
    .locator('span')
    .filter({ hasText: organisationData.email })
    .getByLabel('more')
    .click();
  await page.getByRole('menuitem', { name: 'Set as primary' }).click();

  await page.getByText('Address', { exact: true }).click();

  await page
    .getByTestId(`${organisationFormTestIds.submitBtnBottom}-save-btn`)
    .click();

  await expect(page).toHaveURL(/.*details/);
};

export const verifyEditedOrganisationInDetailsPage = async (
  page: Page,
  organisationData: OrganisationInputDataProps
) => {
  const organisationDetailsBlock = page.getByTestId(
    'organisation-details-block'
  );
  await organisationDetailsBlock.waitFor();
  await expect(organisationDetailsBlock).toBeVisible();
  await expect(
    organisationDetailsBlock.getByTestId('first-name-value')
  ).toHaveText(organisationData.name);
  await expect(
    organisationDetailsBlock.getByTestId('kvk-number-value')
  ).toHaveText(organisationData.kvkData.KvKNumber);
  await expect(
    organisationDetailsBlock.getByTestId('vat-number-value')
  ).toHaveText(organisationData.VATNumber);
  await expect(
    organisationDetailsBlock.getByTestId('website-value')
  ).toHaveText(organisationData.website);
  await expect(
    organisationDetailsBlock.getByTestId('primary-phone-value')
  ).toContainText(organisationData.phoneNumberList.alternatePhoneNumber1);
  await expect(
    organisationDetailsBlock.getByTestId('primary-email-value')
  ).toHaveText(organisationData.email);
};

export const deleteExistingOrg = async (orgName: string, page: Page) => {
  await page.getByTestId('table-row-0').getByTestId('table-column-0').click();
  await expect(page).toHaveURL(/.*details/);
  await page.waitForTimeout(3000);

  const checkNotesEmpty = async () =>
    page.getByTestId(organisationDetailTestIds.notesEmpty).isVisible();

  const checkConnectionsEmpty = async () =>
    page.getByTestId(organisationDetailTestIds.connectionsEmpty).isVisible();

  let isNotesEmpty = await checkNotesEmpty();
  const isConnectionsEmpty = await checkConnectionsEmpty();

  while (!isNotesEmpty) {
    await page
      .getByTestId(`${organisationDetailTestIds.topNote}-ellipsis-icon`)
      .click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Yes' }).click();
    await page.waitForTimeout(2000);
    isNotesEmpty = await checkNotesEmpty();
  }

  isNotesEmpty = await checkNotesEmpty();

  if (isNotesEmpty && isConnectionsEmpty) {
    await page.goto('/organisations', { waitUntil: 'networkidle' });
    await page.getByTestId('organisation-listing-filter-container').click();
    await page.getByRole('textbox', { name: 'Search' }).fill(orgName);
    await page.waitForTimeout(2000);

    await expect(
      page.getByTestId('table-row-0').getByTestId('table-column-0')
    ).toHaveText(orgName);

    await page
      .getByTestId(`table-row-0-${ellipsisMenuTestIds.ellipsisMenuButton}-icon`)
      .click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await page.waitForTimeout(2000);
  }
};
