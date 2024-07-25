import test, { expect } from '@playwright/test';

import { routeRegex, routes } from '@/constants/routes';
import { DeliveryStatus } from '@/containers/deliveries/api/type';

import { deliveryTestIds } from '../../constants/testIds';

test.beforeEach(async ({ page }) => {
  const dealerListPromise = page.waitForResponse((response) => {
    if (response.url().includes('/api/dealers') && response.status() !== 200) {
      console.log(response.url());
      console.log(response.status());
      throw new Error('API FAILURE');
    }

    return response.url().includes('/api/dealers') && response.status() === 200;
  });

  const salesPersonListPromise = page.waitForResponse((response) => {
    if (
      response.url().includes('/api/salespersons') &&
      response.status() !== 200
    ) {
      console.log(response.url());
      console.log(response.status());
      throw new Error('API FAILURE');
    }

    return (
      response.url().includes('/api/salespersons') && response.status() === 200
    );
  });

  await page.goto(routes.delivery.deliveries);
  await expect(page).toHaveURL(routeRegex.delivery.deliveries);

  await dealerListPromise;

  await salesPersonListPromise;
});

test('delivery list page: table filters are visible', async ({ page }) => {
  await expect(
    page.getByTestId(deliveryTestIds.deliverySearchTextField)
  ).toBeVisible();

  await expect(
    page.getByTestId(deliveryTestIds.simpleDropdownSelectDeliveryStatus)
  ).toBeVisible();

  await expect(
    page.getByTestId(deliveryTestIds.deliveryFiltersSalespersonDropdown)
  ).toBeVisible();

  await expect(
    page.getByTestId(deliveryTestIds.deliveryFiltersDealerDropdown)
  ).toBeVisible();

  await expect(
    page.getByTestId(deliveryTestIds.deliveryFiltersCustomerDropdown)
  ).toBeVisible();
});

test('delivery list page: search filter is working', async ({ page }) => {
  await page.getByTestId(deliveryTestIds.deliverySearchTextField).click();

  const deliverySearchRegex = /\/deliveries.*name=Delivery/;

  const deliverySearchRequestPromise = page.waitForRequest(
    // eslint-disable-next-line arrow-body-style
    (request) => {
      return (
        !!request.url().match(deliverySearchRegex)?.length &&
        request.method() === 'GET'
      );
    },
    {
      timeout: 10000,
    }
  );

  await page
    .getByTestId(deliveryTestIds.deliverySearchTextField)
    .getByLabel('Search')
    // TODO search for a specific delivery after creating it from opportunity details page
    .fill('Delivery');

  await deliverySearchRequestPromise;
});

test('delivery list page: ellipsis menu is present in table row and edit action works', async ({
  page,
}) => {
  await expect(
    page.getByTestId('table-row-0-ellipsis-menu-button-icon')
  ).toBeVisible();
  await page.getByTestId('table-row-0-ellipsis-menu-button-icon').click();
  await page.getByTestId(deliveryTestIds.deliveryListPageEllipsisEdit).click();
  await expect(page).toHaveURL(routeRegex.delivery.deliveriesEdit);
});

test('delivery list page: navigate to delivery details page', async ({
  page,
}) => {
  // Note: This is under the assumption that there is at least one delivery in the list
  await page.getByTestId('table-row-0').click();
  await expect(page).toHaveURL(routeRegex.delivery.deliveriesIdDetails);
});

test('delivery list page: status filter works', async ({ page }) => {
  await page
    .getByTestId(deliveryTestIds.simpleDropdownSelectDeliveryStatus)
    .click();
  const deliveryStatus: DeliveryStatus = 'RequestOrder';
  const deliveriesStatusFilteredUrlRegex = new RegExp(
    `deliveries.*status=${deliveryStatus}.*`
  );

  const deliveryListStatusFilterRequestPromise = page.waitForRequest(
    (request) =>
      !!request.url().match(deliveriesStatusFilteredUrlRegex)?.length &&
      request.method() === 'GET',
    {
      timeout: 10000,
    }
  );
  await page
    .getByTestId(deliveryTestIds.deliveriesListingFilterContainer)
    .getByTestId(deliveryTestIds.simpleDropdownSelectDeliveryStatusRequestOrder)
    .click();
  await deliveryListStatusFilterRequestPromise;
  // TODO add coverage to check if the delivery is visible in the table
});

test('delivery list page: Verify the salesperson filter is working', async ({
  page,
}) => {
  await page
    .getByTestId(deliveryTestIds.deliveryFiltersSalespersonDropdown)
    .getByLabel('Salesperson')
    .click();

  await expect(
    page.getByRole('listbox', { name: 'Salesperson' })
  ).toBeVisible();

  const deliveriesSalespersonFilteredUrlRegex =
    /\/deliveries.*salespersonId=.*/;

  const deliveryListSalespersonFilterRequestPromise = page.waitForRequest(
    (request) =>
      !!request.url().match(deliveriesSalespersonFilteredUrlRegex)?.length &&
      request.method() === 'GET',
    {
      timeout: 10000,
    }
  );
  await page.getByRole('listbox').getByRole('option').first().click();
  await deliveryListSalespersonFilterRequestPromise;
});

test('delivery list page: dealership filter works', async ({ page }) => {
  await page
    .getByTestId(deliveryTestIds.deliveryFiltersDealerDropdown)
    .getByLabel('Dealership')
    .click();

  await expect(page.getByRole('listbox', { name: 'Dealership' })).toBeVisible();

  const deliveriesDealershipFilteredUrlRegex = /\/deliveries.*dealerId=.*/;

  const deliveryListDealershipFilterRequestPromise = page.waitForRequest(
    (request) =>
      !!request.url().match(deliveriesDealershipFilteredUrlRegex)?.length &&
      request.method() === 'GET',
    {
      timeout: 10000,
    }
  );
  await page.getByRole('listbox').getByRole('option').first().click();
  await deliveryListDealershipFilterRequestPromise;
});

test('delivery list page: customer filter works', async ({ page }) => {
  await page
    .getByTestId(deliveryTestIds.deliveryFiltersCustomerDropdown)
    .getByLabel('Customer')
    .click();
  await expect(page.getByRole('listbox', { name: 'Customer' })).toBeVisible();

  const deliveriesCustomerFilteredUrlRegex = /\/deliveries.*customerId=.*/;

  const deliveryListCustomerFilterRequestPromise = page.waitForRequest(
    (request) =>
      !!request.url().match(deliveriesCustomerFilteredUrlRegex)?.length &&
      request.method() === 'GET',
    {
      timeout: 10000,
    }
  );
  await page.getByRole('listbox').getByRole('option').first().click();
  await deliveryListCustomerFilterRequestPromise;
});

test('delivery list page: column headers are present in the table', async ({
  page,
}) => {
  await expect(page.getByTestId('name-column-header')).toBeVisible();
  await expect(page.getByTestId('status-column-header')).toBeVisible();
  await expect(page.getByTestId('salespersons-column-header')).toBeVisible();
  await expect(page.getByTestId('dealer-column-header')).toBeVisible();
  await expect(page.getByTestId('customer-column-header')).toBeVisible();
  await expect(page.getByTestId('type-column-header')).toBeVisible();
  await expect(page.getByTestId('opportunity-column-header')).toBeVisible();
  await expect(page.getByTestId('quotation-column-header')).toBeVisible();
});

test('delivery list page: delivery-table-pagination section is visible', async ({
  page,
}) => {
  await expect(page.locator('.MuiTablePagination-actions')).toBeVisible();
  await expect(page.getByLabel('Go to previous page')).toBeVisible();
  await expect(page.getByLabel('Go to previous page')).toBeDisabled();
  await expect(page.getByLabel('Go to next page')).toBeVisible();

  await expect(
    page.locator(`#${deliveryTestIds.deliveryTablePaginationSelect}`)
  ).toBeVisible();
  await expect(
    page.locator(`#${deliveryTestIds.deliveryTablePaginationSelectLabel}`)
  ).toHaveText('Rows:');
});
