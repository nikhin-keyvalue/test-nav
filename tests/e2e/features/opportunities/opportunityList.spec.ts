import { expect, test } from '@playwright/test';

import { routeRegex, routes } from '@/constants/routes';

import {
  ellipsisMenuTestIds,
  opportunityTestIds,
} from '../../constants/testIds';
import {
  createNewOpportunity,
  OpportunityInputDataProps,
  opportunityListInputTestData,
} from '../../utils/opportunities/opportunitiesFormHelpers';

/** The created opportunity's id is stored in this variable, in case we need the id for future reference */
// let testOpportunityId: string;
let newOpportunityTestInputData: OpportunityInputDataProps;

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();

  newOpportunityTestInputData = opportunityListInputTestData;
  await page.goto(routes.opportunity.opportunities);
  await expect(page).toHaveURL(routeRegex.opportunity.opportunities);
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page).toHaveURL(routeRegex.opportunity.opportunitiesNew);
  await createNewOpportunity(page, newOpportunityTestInputData);
  await page.close();
});

test('opportunity list page: add opportunity button is present and functional', async ({
  page,
}) => {
  await page.goto(routes.opportunity.opportunities);
  await expect(page).toHaveURL(routeRegex.opportunity.opportunities);
  await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page).toHaveURL(/.*opportunities\/new/);
});

test('opportunity list page: table filters are visible', async ({ page }) => {
  await page.goto(routes.opportunity.opportunities);
  await expect(page).toHaveURL(routeRegex.opportunity.opportunities);
  await expect(
    page.getByTestId(opportunityTestIds.opportunitiesListingFilterContainer)
  ).toBeVisible();

  await expect(
    page.getByTestId(opportunityTestIds.simpleDropdownSelectOpportunityStatus)
  ).toBeVisible();

  await expect(
    page.getByTestId(opportunityTestIds.opportunityListPageSearchTextField)
  ).toBeVisible();

  await expect(
    page.getByTestId(opportunityTestIds.opportunitiesFilterDropdownSalesPerson)
  ).toBeVisible();
});

test('opportunity list page: search filter is working', async ({ page }) => {
  await page.goto(routes.opportunity.opportunities);
  await expect(page).toHaveURL(routeRegex.opportunity.opportunities);
  await page
    .getByTestId(opportunityTestIds.opportunityListPageSearchTextField)
    .click();
  await page
    .getByTestId(opportunityTestIds.opportunityListPageSearchTextField)
    .getByLabel('Search')
    .fill(newOpportunityTestInputData.name);

  await expect(
    page.locator('[data-testid="table-column-0"]', {
      hasText: newOpportunityTestInputData.name,
    })
  ).not.toHaveCount(0);
});

test('opportunity list page: ellipsis menu is present in table row and edit action works', async ({
  page,
}) => {
  const quotationStatusFilters = [
    'Quotation',
    'Interest',
    'CustomerDecision',
    'Agreement',
  ];
  const opportunitiesUrlParams = new URLSearchParams([
    ['offset', '0'],
    ['status', quotationStatusFilters.toString()],
  ]);
  await page.goto(
    `${routes.opportunity.opportunities}?${opportunitiesUrlParams.toString()}`
  );
  await expect(page).toHaveURL(routeRegex.opportunity.opportunities);
  await expect(
    page.getByTestId(
      `table-row-0-${ellipsisMenuTestIds.ellipsisMenuButton}-icon`
    )
  ).toBeVisible();
  await page
    .getByTestId(`table-row-0-${ellipsisMenuTestIds.ellipsisMenuButton}-icon`)
    .click();
  await page
    .getByTestId(opportunityTestIds.opportunityListPageEllipsisEdit)
    .click();
  await expect(page).toHaveURL(/.*edit/);
});

test('opportunity list page: column headers are present in the table', async ({
  page,
}) => {
  await page.goto(routes.opportunity.opportunities);
  await expect(page).toHaveURL(routeRegex.opportunity.opportunities);
  await expect(page.getByTestId('name-column-header')).toBeVisible();
  await expect(page.getByTestId('status-column-header')).toBeVisible();
  await expect(page.getByTestId('salespersons-column-header')).toBeVisible();
  await expect(page.getByTestId('dealer-column-header')).toBeVisible();
  await expect(page.getByTestId('customer-column-header')).toBeVisible();
  await expect(page.getByTestId('type-column-header')).toBeVisible();
});

test('opportunity list page: navigate to opportunities details page', async ({
  page,
}) => {
  await page.goto(routes.opportunity.opportunities);
  await page.getByTestId('table-row-0').click();
  await expect(page).toHaveURL(/.*details/);
});

test('opportunity list page: Verify the salesperson filter is working', async ({
  page,
}) => {
  await page.goto(routes.opportunity.opportunities);
  await expect(page).toHaveURL(routeRegex.opportunity.opportunities);
  await page
    .getByTestId(opportunityTestIds.opportunitiesFilterDropdownSalesPerson)
    .getByLabel('Salesperson')
    .click();

  await expect(
    page.getByRole('listbox', { name: 'Salesperson' })
  ).toBeVisible();

  const requestPromise = page.waitForRequest(
    (request) => request.url().includes('/opportunities'),
    {
      timeout: 10000,
    }
  );
  await page.getByRole('listbox').getByRole('option').first().click();
  await requestPromise;
});

test('opportunity list page: dealership filter works', async ({ page }) => {
  await page.goto(routes.opportunity.opportunities);
  await expect(page).toHaveURL(routeRegex.opportunity.opportunities);
  await page
    .getByTestId(opportunityTestIds.opportunitiesFilterDropdownDealer)
    .getByLabel('Dealership')
    .click();

  await expect(page.getByRole('listbox', { name: 'Dealership' })).toBeVisible();

  const requestPromise = page.waitForRequest(
    (request) => request.url().includes('/opportunities'),
    {
      timeout: 10000,
    }
  );
  await page.getByRole('listbox').getByRole('option').first().click();
  await requestPromise;
});

test('opportunity list page: customer filter works', async ({ page }) => {
  await page.goto(routes.opportunity.opportunities);
  await expect(page).toHaveURL(routeRegex.opportunity.opportunities);
  await page
    .getByTestId(opportunityTestIds.opportunitiesFilterDropdownCustomer)
    .getByLabel('Customer')
    .click();
  await expect(page.getByRole('listbox', { name: 'Customer' })).toBeVisible();

  const requestPromise = page.waitForRequest(
    (request) => request.url().includes('/opportunities'),
    {
      timeout: 10000,
    }
  );
  await page.getByRole('listbox').getByRole('option').first().click();
  await requestPromise;
});

test('opportunity list page: status filter works', async ({ page }) => {
  await page.goto(routes.opportunity.opportunities);
  await expect(page).toHaveURL(routeRegex.opportunity.opportunities);

  await page
    .getByTestId(opportunityTestIds.simpleDropdownSelectOpportunityStatus)
    .click();

  const requestPromise = page.waitForRequest(
    (request) => request.url().includes('/opportunities'),
    {
      timeout: 10000,
    }
  );
  await page
    .getByTestId(opportunityTestIds.opportunitiesListingFilterContainer)
    .getByText('Interest')
    .click();
  await requestPromise;

  await expect(
    page
      .getByTestId('table-row-0')
      .getByTestId('table-column-1')
      .getByText('Interest')
  ).toBeVisible();
});

test('opportunity list page: opportunity-table-pagination section is visible', async ({
  page,
}) => {
  await page.goto(routes.opportunity.opportunities);
  await expect(page).toHaveURL(routeRegex.opportunity.opportunities);
  await expect(page.locator('.MuiTablePagination-actions')).toBeVisible();
  await expect(page.getByLabel('Go to previous page')).toBeVisible();
  await expect(page.getByLabel('Go to previous page')).toBeDisabled();
  await expect(page.getByLabel('Go to next page')).toBeVisible();

  await expect(
    page.locator(`#${opportunityTestIds.opportunityTablePaginationSelect}`)
  ).toBeVisible();
  await expect(
    page.locator(`#${opportunityTestIds.opportunityTablePaginationSelectLabel}`)
  ).toHaveText('Rows:');
});

/** Teardown */
test.afterAll(async ({ browser }) => {
  /**  This console log is here to track the teardown points in the terminal */
  console.log('START TEARDOWN: opportunityList.spec');
  const page = await browser.newPage();
  await page.goto(routes.opportunity.opportunities);
  await expect(page).toHaveURL(routes.opportunity.opportunities);
  await page
    .getByTestId(opportunityTestIds.opportunityListPageSearchTextField)
    .click();
  await page
    .getByTestId(opportunityTestIds.opportunityListPageSearchTextField)
    .getByLabel('Search')
    .fill(newOpportunityTestInputData.name);
  await expect(
    page
      .getByTestId('table-row-0')
      .getByTestId('table-column-0')
      .filter({ hasText: newOpportunityTestInputData.name })
  ).not.toHaveCount(0);

  await page
    .getByTestId(`table-row-0-${ellipsisMenuTestIds.ellipsisMenuButton}-icon`)
    .first()
    .click();

  const opportunityDeleteRequestPromise = page.waitForRequest(
    (request) =>
      request.url().includes('/opportunities') && request.method() === 'POST',
    {
      timeout: 10000,
    }
  );
  const opportunityDeleteResponsePromise = page.waitForResponse(
    (response) => {
      if (
        response.url().includes('opportunities') &&
        response.status() !== 200
      ) {
        console.log('delete opportunity call failed');
        console.log(response.url());
        console.log(response.status());
        throw new Error('API FAILURE');
      }

      return (
        response.url().includes('opportunities') &&
        response.request().method() === 'POST' &&
        response.status() === 200
      );
    },
    { timeout: 10000 }
  );
  await page
    .getByTestId(opportunityTestIds.opportunityListPageEllipsisDelete)
    .click();
  await opportunityDeleteRequestPromise;
  await opportunityDeleteResponsePromise;
  await page.close();
});
