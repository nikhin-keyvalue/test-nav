import test, { expect } from '@playwright/test';

import { routeRegex, routes } from '@/constants/routes';

import {
  calenderEventTestIds,
  ellipsisMenuTestIds,
  notesTestIds,
  opportunityTestIds,
} from '../../constants/testIds';
import { getIdFromUrl } from '../../utils/common/getIdFromUrl';
import {
  createNewOpportunity,
  editOpportunity,
  editOpportunityEditedInputTestData,
  editOpportunityInputTestData,
  verifyEditedOpportunityInDetailsPage,
} from '../../utils/opportunities/opportunitiesFormHelpers';

// eslint-disable-next-line unused-imports/no-unused-vars
let testOpportunityId: string;

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();

  const newOpportunityTestInputData = editOpportunityInputTestData;
  await page.goto('/opportunities');
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page).toHaveURL(/.*\/opportunities\/new/);
  await createNewOpportunity(page, newOpportunityTestInputData);
  testOpportunityId = getIdFromUrl(page);
  await page.close();
});

test('edit opportunity page: Edit opportunity CTA in list page is functional', async ({
  page,
}) => {
  await page.goto(routes.opportunity.opportunities);
  await expect(page).toHaveURL(routes.opportunity.opportunities);
  await page
    .getByTestId(opportunityTestIds.opportunityListPageSearchTextField)
    .click();
  await page
    .getByTestId(opportunityTestIds.opportunityListPageSearchTextField)
    .getByLabel('Search')
    .fill(editOpportunityInputTestData.name);
  await expect(
    page
      .getByTestId('table-row-0')
      .getByTestId('table-column-0')
      .filter({ hasText: editOpportunityInputTestData.name })
  ).not.toHaveCount(0);

  await page
    .getByTestId(`table-row-0-${ellipsisMenuTestIds.ellipsisMenuButton}-icon`)
    .first()
    .click();
  await page
    .getByTestId(opportunityTestIds.opportunityListPageEllipsisEdit)
    .click();
  await expect(page).toHaveURL(routeRegex.opportunity.opportunitiesEdit);
});

test('edit opportunity page: Customer field and type is disabled and Status is not disabled', async ({
  page,
}) => {
  await page.goto(routes.opportunity.opportunities);
  await expect(page).toHaveURL(routes.opportunity.opportunities);
  await page
    .getByTestId(opportunityTestIds.opportunityListPageSearchTextField)
    .click();
  await page
    .getByTestId(opportunityTestIds.opportunityListPageSearchTextField)
    .getByLabel('Search')
    .fill(editOpportunityInputTestData.name);
  await expect(
    page
      .getByTestId('table-row-0')
      .getByTestId('table-column-0')
      .filter({ hasText: editOpportunityInputTestData.name })
  ).not.toHaveCount(0);

  await page
    .getByTestId(`table-row-0-${ellipsisMenuTestIds.ellipsisMenuButton}-icon`)
    .first()
    .click();
  await page
    .getByTestId(opportunityTestIds.opportunityListPageEllipsisEdit)
    .click();
  await expect(page).toHaveURL(routeRegex.opportunity.opportunitiesEdit);
  const customerInput = page
    .getByTestId(opportunityTestIds.createOpportunityCustomerTextField)
    .getByRole('combobox');
  await expect(customerInput).toHaveClass(/Mui-disabled/);
  // check if customer type is disabled
  /**
   * Represents the customer type element on the edit opportunity page.
   */
  const customerType = page
    .getByTestId(
      opportunityTestIds.createOpportunitySelectControllerCustomerType
    )
    .locator('div')
    .first();

  await expect(customerType).toHaveClass(/Mui-disabled/);

  /**
   * Represents the opportunity status element on the page.
   */
  const opportunityStatus = page
    .getByTestId(opportunityTestIds.createOpportunityStatusTextField)
    .locator('div')
    .first();
  await expect(opportunityStatus).not.toHaveClass(/Mui-disabled/);
});

test('edit opportunity page: Test Edit opportunity', async ({ page }) => {
  // This sample opportunity has the status set to 'Proposal'
  await page.goto(routes.opportunity.opportunities);
  await expect(page).toHaveURL(routes.opportunity.opportunities);
  await page
    .getByTestId(opportunityTestIds.opportunityListPageSearchTextField)
    .click();
  await page
    .getByTestId(opportunityTestIds.opportunityListPageSearchTextField)
    .getByLabel('Search')
    .fill(editOpportunityInputTestData.name);
  await expect(
    page
      .getByTestId('table-row-0')
      .getByTestId('table-column-0')
      .filter({ hasText: editOpportunityInputTestData.name })
  ).not.toHaveCount(0);

  await page
    .getByTestId(`table-row-0-${ellipsisMenuTestIds.ellipsisMenuButton}-icon`)
    .first()
    .click();
  await page
    .getByTestId(opportunityTestIds.opportunityListPageEllipsisEdit)
    .click();
  await expect(page).toHaveURL(routeRegex.opportunity.opportunitiesEdit);

  const editedOpportunityTestInputData = editOpportunityEditedInputTestData;
  await editOpportunity(page, editedOpportunityTestInputData);
  await verifyEditedOpportunityInDetailsPage(
    page,
    editedOpportunityTestInputData
  );
});

test('edit opportunity page: Edit option is disabled for Closed Won or Closed Lost opportunities in opportunities list page', async ({
  page,
}) => {
  // TODO create closed won and closed lost opportunities
  await page.goto(
    `${routes.opportunity.opportunities}?offset=0&status=ClosedWon%2CClosedLost`
  );
  const closedStatusUrlRegex =
    /status=(ClosedWon|ClosedLost|ClosedWon%2CClosedLost|ClosedLost%2CClosedWon)/;
  await expect(page).toHaveURL(closedStatusUrlRegex);

  // At least one of the two elements is visible, possibly both.
  await expect(
    page
      .getByTestId(`${opportunityTestIds.opportunityTable}-no-data`)
      .or(page.getByTestId(`${opportunityTestIds.opportunityTable}-body`))
  ).toBeVisible();

  const noDataUiVisible = await page
    .getByTestId(`${opportunityTestIds.opportunityTable}-no-data`)
    .isVisible();
  if (!noDataUiVisible) {
    const rowCount = await page
      .getByTestId(`${opportunityTestIds.opportunityTable}-body`)
      .locator('tr')
      .count();

    if (rowCount > 0) {
      await page
        .getByTestId(
          `table-row-0-${ellipsisMenuTestIds.ellipsisMenuButton}-icon`
        )
        .click();
      await expect(
        page.getByTestId(opportunityTestIds.opportunityListPageEllipsisEdit)
      ).toBeVisible();

      await expect(
        page.getByTestId(opportunityTestIds.opportunityListPageEllipsisEdit)
      ).toHaveClass(/Mui-disabled/);
    }
  }
});

test('edit opportunity page: Asterisk symbol in create notes, calender event, ', async ({
  page,
}) => {
  await page.goto(routes.opportunity.opportunities);
  await expect(page).toHaveURL(routes.opportunity.opportunities);
  await page
    .getByTestId(opportunityTestIds.opportunityListPageSearchTextField)
    .click();
  await page
    .getByTestId(opportunityTestIds.opportunityListPageSearchTextField)
    .getByLabel('Search')
    .fill(editOpportunityInputTestData.name);
  await expect(
    page
      .getByTestId('table-row-0')
      .getByTestId('table-column-0')
      .filter({ hasText: editOpportunityInputTestData.name })
  ).not.toHaveCount(0);

  await page.getByTestId('table-row-0').first().click();

  await page.getByTestId('add-calender-event-button').click();

  const eventTypeElement = page.getByTestId(calenderEventTestIds.eventType);
  const eventTypeLabel = eventTypeElement.locator('label').first();
  const eventTypeSpanElement = eventTypeLabel.locator('span').first();

  const startDateElement = page.getByTestId(calenderEventTestIds.date);
  const startDateLabel = startDateElement.locator('label').first();
  const startDateSpanElement = startDateLabel.locator('span').first();

  const startTimeElement = page.getByTestId(calenderEventTestIds.date);
  const startTimeLabel = startTimeElement.locator('label').first();
  const startTimeSpanElement = startTimeLabel.locator('span').first();

  const endTimeElement = page.getByTestId(calenderEventTestIds.date);
  const endTimeLabel = endTimeElement.locator('label').first();
  const endTimeSpanElement = endTimeLabel.locator('span').first();

  const eventTitleElement = page.getByTestId(calenderEventTestIds.date);
  const eventTitleLabel = eventTitleElement.locator('label').first();
  const eventTitleSpanElement = eventTitleLabel.locator('span').first();

  const emailElement = page.getByTestId(calenderEventTestIds.date);
  const emailLabel = emailElement.locator('label').first();
  const emailSpanElement = emailLabel.locator('span').first();

  await expect(eventTypeSpanElement).toHaveText('*');
  await expect(startDateSpanElement).toHaveText('*');
  await expect(startTimeSpanElement).toHaveText('*');
  await expect(endTimeSpanElement).toHaveText('*');
  await expect(eventTitleSpanElement).toHaveText('*');
  await expect(emailSpanElement).toHaveText('*');

  await page.getByTestId('create-edit-event-dialog-close-btn').click();

  await page.getByTestId('notes-section-add-btn').click();

  const notesTitleElement = page.getByTestId(notesTestIds.noteFormTitle);
  const notesTitleLabel = notesTitleElement.locator('label').first();
  const notesTitleSpanElement = notesTitleLabel.locator('span').first();

  const notesContentElement = page.getByTestId(notesTestIds.noteFormContent);
  const notesContentLabel = notesContentElement.locator('label').first();
  const notesContentSpanElement = notesContentLabel.locator('span').first();

  await expect(notesTitleSpanElement).toHaveText('*');
  await expect(notesContentSpanElement).toHaveText('*');

  await page.getByTestId('notes-section-dialog-close-btn').click();
});

/** Teardown */
test.afterAll(async ({ browser }) => {
  console.log('START TEARDOWN: editOpportunity.spec');
  const page = await browser.newPage();
  await page.goto(routes.opportunity.opportunities);
  await expect(page).toHaveURL(routes.opportunity.opportunities);
  await page
    .getByTestId(opportunityTestIds.opportunityListPageSearchTextField)
    .click();
  await page
    .getByTestId(opportunityTestIds.opportunityListPageSearchTextField)
    .getByLabel('Search')
    .fill(editOpportunityEditedInputTestData.name);
  await expect(
    page
      .getByTestId('table-row-0')
      .getByTestId('table-column-0')
      .filter({ hasText: editOpportunityEditedInputTestData.name })
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
