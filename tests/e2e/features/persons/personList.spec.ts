import test, { expect } from '@playwright/test';

import { ellipsisMenuTestIds } from '../../constants/testIds';
import {
  createNewPerson,
  getNewPersonDetails,
} from '../../utils/person/personFormHelpers';

const BEFORE_EACH_EXCLUSION_LIST = [
  'Verify the presence of Add person button and its action',
  'Verify the table filters are present in person listing page',
  'Verify the search name filter working',
];

test.beforeEach(async ({ page }) => {
  // Note: skip tests that don't need beforeEach hook to run
  if (BEFORE_EACH_EXCLUSION_LIST.includes(test.info().title)) return;

  const newPersonData = getNewPersonDetails();

  await page.goto('/persons');
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page).toHaveURL(/.*\/persons\/new/);

  await createNewPerson(page, newPersonData);

  await page.goto('/persons');
  await expect(page).toHaveURL(/.*\/persons/);
});

test('Verify the presence of Add person button and its action', async ({
  page,
}) => {
  await page.goto('/persons');
  await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
  await page.getByRole('button', { name: 'Add' }).click();

  await expect(page).toHaveURL(/.*persons\/new/);
});

test('Verify the table filters are present in person listing page', async ({
  page,
}) => {
  await page.goto('/persons');

  await expect(
    page.getByTestId('person-listing-filter-container')
  ).toBeVisible();
  await expect(page.locator('input#search-name-filter')).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'type' })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'phase' })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'status' })).toBeVisible();
});

test('Verify the search name filter working', async ({ page }) => {
  // create a new person to ensure atleast 1 person exists
  const newPersonData = getNewPersonDetails();

  await page.goto('/persons');
  await page.getByRole('button', { name: 'Add' }).click();

  await createNewPerson(page, newPersonData);

  await page.goto('/persons');
  await page.getByTestId('person-listing-filter-container').click();
  await page
    .getByRole('textbox', { name: 'Search' })
    .fill(newPersonData.firstName);

  await expect(
    page.locator('[data-testid="table-column-0"]', {
      hasText: newPersonData.firstName,
    })
  ).not.toHaveCount(0);
});

/* ------------- END OF TESTS THAT DON'T NEED BEFORE EACH HOOK -----------------*/

test('Verify ellipsis menu is visible in table row and edit person from table row is working', async ({
  page,
}) => {
  await expect(
    page.getByTestId(
      `table-row-0-${ellipsisMenuTestIds.ellipsisMenuButton}-icon`
    )
  ).toBeVisible();
  await page
    .getByTestId(`table-row-0-${ellipsisMenuTestIds.ellipsisMenuButton}-icon`)
    .click();
  await page.getByTestId('person-table-menu-edit-person').click();
  await expect(page).toHaveURL(/.*edit/);
});

test('Verify the relevant column headers are present for the table', async ({
  page,
}) => {
  await expect(page.getByTestId('firstName-column-header')).toBeVisible();
  await expect(page.getByTestId('lastName-column-header')).toBeVisible();
  await expect(page.getByTestId('type-column-header')).toBeVisible();
  await expect(page.getByTestId('phase-column-header')).toBeVisible();
  await expect(page.getByTestId('email-column-header')).toBeVisible();
  await expect(page.getByTestId('phoneNumber-column-header')).toBeVisible();
  await expect(page.getByTestId('address-column-header')).toBeVisible();
  await expect(page.getByTestId('status-column-header')).toBeVisible();
});

test('Verify person-details-page navigation on table row click', async ({
  page,
}) => {
  await page.getByTestId('table-row-0').click();
  await expect(page).toHaveURL(/.*details/);
});

test('Verify the person-type filter working', async ({ page }) => {
  await page.getByRole('combobox', { name: 'type' }).click();
  await page
    .locator('li')
    .filter({ hasText: 'Private' })
    .locator('input[type="checkbox"]')
    .click();
  await page.locator('#menu-type div').first().click();

  await expect(
    page.getByTestId('table-row-0').getByRole('cell', { name: 'Private' })
  ).toBeVisible();
});

test('Verify the phase filter working', async ({ page }) => {
  await page.getByRole('combobox', { name: 'phase' }).click();
  await page
    .locator('li')
    .filter({ hasText: 'Relation' })
    .locator('input[type="checkbox"]')
    .click();
  await page.locator('#menu-phase div').first().click();

  await expect(
    page.getByTestId('table-row-0').getByRole('cell', { name: 'Relation' })
  ).toBeVisible();
});

test('Verify the status filter working', async ({ page }) => {
  await page.getByRole('combobox', { name: 'status' }).click();
  await page
    .locator('li')
    .filter({ hasText: /^Active$/ })
    .locator('input[type="checkbox"]')
    .click();
  await page.locator('#menu-isActive div').first().click();

  await expect(
    page.getByTestId('table-row-0').getByRole('cell', { name: 'Active' })
  ).toBeVisible();
});

test('Verify the person-table-pagination section is visible', async ({
  page,
}) => {
  await expect(page.locator('.MuiTablePagination-actions')).toBeVisible();
  await expect(page.getByLabel('Go to previous page')).toBeVisible();
  await expect(page.getByLabel('Go to previous page')).toBeDisabled();
  await expect(page.getByLabel('Go to next page')).toBeVisible();

  await expect(page.locator('#person-table-pagination-select')).toBeVisible();
  await expect(
    page.locator('#person-table-pagination-select-label')
  ).toHaveText('Rows:');
});
