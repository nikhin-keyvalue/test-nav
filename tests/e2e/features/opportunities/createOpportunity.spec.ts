import { expect, test } from '@playwright/test';

import { routeRegex, routes } from '@/constants/routes';

import { VALIDATION_ERROR_MESSAGES } from '../../constants/errors';
import {
  ellipsisMenuTestIds,
  opportunityTestIds,
} from '../../constants/testIds';
import {
  createNewOpportunity,
  createOpportunityInputTestData,
  OpportunityInputDataProps,
  verifyCreatedOpportunityInDetailsPage,
} from '../../utils/opportunities/opportunitiesFormHelpers';
import { validateRequiredFields } from '../../utils/opportunities/validateForm';

/** The created opportunity's id is stored in this variable, in case we need the id for future reference */
// let testOpportunityId: string;
let newOpportunityTestInputData: OpportunityInputDataProps;

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  newOpportunityTestInputData = createOpportunityInputTestData;
  await page.goto(routes.opportunity.opportunitiesNew);
  await expect(page).toHaveURL(routeRegex.opportunity.opportunitiesNew);

  await createNewOpportunity(page, newOpportunityTestInputData);
  await verifyCreatedOpportunityInDetailsPage(
    page,
    newOpportunityTestInputData
  );
  // testOpportunityId = getIdFromUrl(page);
  await page.close();
});

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

  await page.goto(routes.opportunity.opportunitiesNew);
  await expect(page).toHaveURL(routeRegex.opportunity.opportunitiesNew);

  await dealerListPromise;

  await salesPersonListPromise;
});

test('create opportunity page: show validations errors if required fields are not filled', async ({
  page,
}) => {
  await validateRequiredFields(page);
});

test('create opportunity page: show validation error on entering an invalid opportunity name and remove error on entering a valid one', async ({
  page,
}) => {
  const opportunityNameInput = await page.getByTestId(
    `${opportunityTestIds.createOpportunityNameTextField}-input`
  );
  await expect(async () => {
    await expect(opportunityNameInput).toBeVisible();
    await opportunityNameInput.click();
    await opportunityNameInput.clear();
  }).toPass();

  await opportunityNameInput.fill('John Doe#$');

  await expect(async () => {
    await expect(
      page.getByRole('button', { name: 'Save & close' }).nth(1)
    ).toBeEnabled();
    await page.getByRole('button', { name: 'Save & close' }).nth(1).click();
  }).toPass();

  await expect(
    page.locator(
      `#${opportunityTestIds.createOpportunityNameTextField}-helper-text`
    )
  ).toHaveText(VALIDATION_ERROR_MESSAGES.invalidName);

  await opportunityNameInput.clear();
  //  - and . are valid characters
  await opportunityNameInput.fill('John-Doe.');

  await expect(async () => {
    await expect(
      page.getByRole('button', { name: 'Save & close' }).nth(1)
    ).toBeEnabled();
    await page.getByRole('button', { name: 'Save & close' }).nth(1).click();
  }).toPass();
  await expect(
    page.locator(
      `#${opportunityTestIds.createOpportunityNameTextField}-helper-text`
    )
  ).not.toHaveText(VALIDATION_ERROR_MESSAGES.invalidName);
});

test('create opportunity page: Status is "Interest" by default', async ({
  page,
}) => {
  await expect(
    page.getByTestId(opportunityTestIds.createOpportunityStatusTextField)
  ).toBeVisible();

  await expect(
    page.getByTestId(opportunityTestIds.createOpportunityStatusTextField)
  ).toContainText('Interest');
});

/** Teardown */
test.afterAll(async ({ browser }) => {
  /**  This console log is here to track the teardown points in the terminal */
  console.log('START TEARDOWN: createOpportunity.spec');
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
