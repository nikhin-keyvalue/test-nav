import { expect, Page } from '@playwright/test';

import {
  addressFormTestIds,
  organisationFormTestIds,
} from '../../constants/testIds';

type InputDataType = {
  houseNumber: string;
  city: string;
  postalCode: string;
  street: string;
  country: string;
  postCodeAddressString: string;
};

export const checkPostcode = async (page: Page, inputData: InputDataType) => {
  await page.locator(`#${organisationFormTestIds.addAddressBtn}`).click();
  await page.getByTestId(addressFormTestIds.country).click();
  await page.getByRole('option', { name: 'Austria' }).click();
  await page.getByLabel('Austria').click();
  await expect(
    page.locator(
      '.MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root'
    )
  ).toBeVisible();
  await page.getByRole('option', { name: 'Belgium' }).click();
  await page.getByLabel('Belgium').click();
  await expect(
    page.locator(
      '.MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root'
    )
  ).toBeVisible();
  await page.getByRole('option', { name: 'Denmark' }).click();
  await page.getByLabel('Denmark').click();
  await expect(
    page.locator(
      '.MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root'
    )
  ).toBeVisible();
  await page.getByRole('option', { name: 'France' }).click();
  await page.getByLabel('France').click();
  await expect(
    page.locator(
      '.MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root'
    )
  ).toBeVisible();
  await page.getByRole('option', { name: 'Germany' }).click();
  await page.getByLabel('Germany').click();
  await expect(
    page.locator(
      '.MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root'
    )
  ).toBeVisible();
  await page.getByRole('option', { name: 'Luxembourg' }).click();
  await page.getByLabel('Luxembourg').click();
  await expect(
    page.locator(
      '.MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root'
    )
  ).toBeVisible();
  await page.getByRole('option', { name: 'Spain' }).click();
  await page.getByLabel('Spain').click();
  await expect(
    page.locator(
      '.MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root'
    )
  ).toBeVisible();
  await page.getByRole('option', { name: 'Switzerland' }).click();
  await page.getByLabel('Switzerland').click();
  await expect(
    page.locator(
      '.MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root'
    )
  ).toBeVisible();
  await page.getByRole('option', { name: 'United Kingdom of Great' }).click();
  await page.getByLabel('United Kingdom of Great').click();
  await expect(
    page.locator(
      '.MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root'
    )
  ).toBeVisible();
  await page.getByRole('option', { name: 'Italy' }).click();
  await expect(
    page.locator(
      '.MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root'
    )
  ).not.toBeVisible();

  await page.getByLabel('Italy').click();
  await page.getByRole('option', { name: 'Netherlands' }).click();
  await page.getByLabel('City, street or postcode').click();
  await page.getByLabel('City, street or postcode').fill('amsterdam, balbo');
  await page.getByRole('option', { name: 'Amsterdam, Balboaplein' }).click();
  await page.getByLabel('City, street or postcode').click();
  await page.getByRole('option', { name: 'Amsterdam, Balboaplein 8' }).click();
  await expect(page.getByLabel(inputData.country)).toBeVisible();
  await expect(
    page.getByTestId(`${addressFormTestIds.postalCode}-input`)
  ).toHaveValue(inputData.postalCode);
  await expect(
    page.getByTestId(`${addressFormTestIds.city}-input`)
  ).toHaveValue(inputData.city);
  await expect(
    page.getByTestId(`${addressFormTestIds.street}-input`)
  ).toHaveValue(inputData.street);
  await expect(
    page.getByTestId(`${addressFormTestIds.houseNumber}-input`)
  ).toHaveValue(inputData.houseNumber);
  await page.getByRole('button', { name: 'Add' }).click();
};
