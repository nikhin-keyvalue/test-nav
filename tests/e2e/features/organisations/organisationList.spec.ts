import test, { expect } from '@playwright/test';

test('Org List: Verify the presence of Add button and its action from organistions list view', async ({
  page,
}) => {
  await page.goto('/organisations');
  await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
  await page.getByRole('button', { name: 'Add' }).click();

  await expect(page).toHaveURL(/.*\/organisations\/new/);
});

test('Org List: Verify the table filters are present in organisations listing page', async ({
  page,
}) => {
  await page.goto('/organisations');

  await expect(
    page.getByTestId('organisation-listing-filter-container')
  ).toBeVisible();
  await expect(page.locator('input#search-name-filter')).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'type' })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'phase' })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'status' })).toBeVisible();
});

test('Org List: Verify the search name filter working', async ({ page }) => {
  await page.goto('/organisations');
  await page.getByTestId('organisation-listing-filter-container').click();
  await page.getByRole('textbox', { name: 'Search' }).fill('Orite');

  await expect(
    page.locator('[data-testid="table-column-0"]', {
      hasText: 'Orite',
    })
  ).not.toHaveCount(0);
});

test('Org List: Verify the relevant column headers are present for the table', async ({
  page,
}) => {
  await page.goto('/organisations');
  await expect(page.getByTestId('name-column-header')).toBeVisible();
  await expect(page.getByTestId('type-column-header')).toBeVisible();
  await expect(page.getByTestId('phase-column-header')).toBeVisible();
  await expect(page.getByTestId('email-column-header')).toBeVisible();
  await expect(page.getByTestId('phoneNumber-column-header')).toBeVisible();
  await expect(page.getByTestId('address-column-header')).toBeVisible();
  await expect(page.getByTestId('status-column-header')).toBeVisible();
});

test('Org List: Verify organisation-details-page navigation on table row click', async ({
  page,
}) => {
  await page.goto('/organisations');
  await page.getByTestId('table-row-0').click();
  await expect(page).toHaveURL(/.*details/);
});

test('Org List: Verify the phase filter working', async ({ page }) => {
  await page.goto('/organisations');
  await page.getByTestId('organisations-filter-phase-dropdown').click();
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

test('Org List: Verify the status filter working', async ({ page }) => {
  await page.goto('/organisations');
  await page.getByTestId('organisations-filter-status-dropdown').click();
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

test('Org List: Verify the organisation-table-pagination section is visible', async ({
  page,
}) => {
  await page.goto('/organisations');
  await expect(page.locator('.MuiTablePagination-actions')).toBeVisible();
  await expect(page.getByLabel('Go to previous page')).toBeVisible();
  await expect(page.getByLabel('Go to previous page')).toBeDisabled();
  await expect(page.getByLabel('Go to next page')).toBeVisible();

  await expect(
    page.locator('#organisation-table-pagination-select')
  ).toBeVisible();
  await expect(
    page.locator('#organisation-table-pagination-select-label')
  ).toHaveText('Rows:');
});

test('Org List: Verify the organisation-type filter working', async ({
  page,
}) => {
  await page.goto('/organisations');
  await page.getByTestId('organisations-filter-type-dropdown').click();
  await page
    .getByTestId('organisations-filter-type-dropdown-organisation')
    .click();
  await page.waitForTimeout(2000);
  await page.mouse.click(80, 1);

  await expect(
    page.getByTestId('table-row-0').getByTestId('table-column-1')
  ).toContainText('Organisation');
});
