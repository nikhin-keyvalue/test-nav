import { faker } from '@faker-js/faker';
import { expect, Page } from '@playwright/test';

import { VALIDATION_ERROR_MESSAGES } from '../../constants/errors';
import { opportunityTestIds } from '../../constants/testIds';

export const validateRequiredFields = async (page: Page) => {
  await expect(async () => {
    await expect(
      page.getByTestId(
        `${opportunityTestIds.createOpportunityNameTextField}-input`
      )
    ).toBeVisible();
    await page
      .getByTestId(`${opportunityTestIds.createOpportunityNameTextField}-input`)
      .click();
    await page
      .getByTestId(`${opportunityTestIds.createOpportunityNameTextField}-input`)
      .clear();
  }).toPass();

  await expect(async () => {
    await expect(page.getByLabel('Dealership')).toBeVisible();
    await page.getByLabel('Dealership').hover();
    await expect(
      page
        .getByTestId(opportunityTestIds.createOpportunityDealershipTextField)
        .getByLabel('Clear')
    ).toBeVisible();

    await page
      .getByTestId(opportunityTestIds.createOpportunityDealershipTextField)
      .getByLabel('Clear')
      .click();
  }).toPass();

  const saveBtn = await page.getByTestId(
    `${opportunityTestIds.createOpportunitySubmitLineSaveButton}-save-btn`
  );
  await expect(saveBtn).toBeVisible();
  await expect(saveBtn).toBeEnabled();
  await saveBtn.click();
  await expect(
    page.locator(
      `#${opportunityTestIds.createOpportunityCustomerTextField}-helper-text`
    )
  ).toHaveText(VALIDATION_ERROR_MESSAGES.mandatory);
  await expect(
    page.locator(
      `#${opportunityTestIds.createOpportunityDealershipTextField}-helper-text`
    )
  ).toHaveText(VALIDATION_ERROR_MESSAGES.mandatory);

  await expect(
    page.locator(
      `#${opportunityTestIds.createOpportunityNameTextField}-helper-text`
    )
  ).toHaveText(VALIDATION_ERROR_MESSAGES.invalidName);

  await page
    .getByTestId(`${opportunityTestIds.createOpportunityNameTextField}-input`)
    .fill(`${faker.vehicle.vehicle()} opportunity`);

  await expect(async () => {
    await page
      .getByTestId(opportunityTestIds.createOpportunityCustomerTextField)
      .click();
    await expect(
      page
        .getByRole('listbox', { name: 'Customer' })
        .getByRole('option')
        .first()
    ).toBeVisible();
  }).toPass();

  await page.getByRole('listbox', { name: 'Customer' }).first().click();

  await expect(async () => {
    await page.getByLabel('Dealership').click();
    await expect(
      page
        .getByRole('listbox', { name: 'Dealership' })
        .getByRole('option')
        .first()
    ).toBeVisible();
  }).toPass();

  await page.getByRole('listbox', { name: 'Dealership' }).first().click();

  await expect(
    page.locator(
      `#${opportunityTestIds.createOpportunityNameTextField}-helper-text`
    )
  ).not.toBeVisible();
  await expect(
    page.locator(
      `#${opportunityTestIds.createOpportunityCustomerTextField}-helper-text`
    )
  ).not.toBeVisible();
  await expect(
    page.locator(
      `#${opportunityTestIds.createOpportunityDealershipTextField}-helper-text`
    )
  ).not.toBeVisible();
};
