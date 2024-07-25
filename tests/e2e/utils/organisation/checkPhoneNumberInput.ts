import { Page } from '@playwright/test';

type InputDataType = {
    phone: string;
    alternatePhoneNumber1: string;
    alternatePhoneNumber2: string;
    alternatePhoneNumber2Text: string;
  }

export const checkPhoneNumberInput = async (page: Page, inputData: InputDataType) => {
  await page.getByTestId('phone-number-input').click();
  await  page.getByTestId('phone-number-input').fill(inputData.phone);
  await page.getByText('Phone').click();

  // Phone number test - alternate number with paranthesis and hyphens and submit on Enter
  await page.getByLabel('Phone number country').selectOption('US');
  await  page.getByTestId('phone-number-input').click();
  await page
    .getByPlaceholder('Add phone number')
    .fill(inputData.alternatePhoneNumber2);
  await page.getByTestId('phone-number-input').press('Enter');

  await page.getByLabel('Phone number country').selectOption('NL');
  await page.getByTestId('phone-number-input').click();
  await page
    .getByPlaceholder('Add phone number')
    .fill(inputData.alternatePhoneNumber1);
  await page.getByText('Phone').click();
  await page
    .locator('span')
    .filter({ hasText: inputData.alternatePhoneNumber1 })
    .getByLabel('more')
    .click();
  await page.getByRole('menuitem', { name: 'Set as primary' }).click();

  // Delete phone number flow
  await page
    .locator('span')
    .filter({ hasText: inputData.phone })
    .getByLabel('more')
    .click();
  await page.getByRole('menuitem', { name: 'Delete phone number' }).click();
};
