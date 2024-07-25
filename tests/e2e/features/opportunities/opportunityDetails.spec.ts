import { expect, test } from '@playwright/test';

import { EVENT_TYPE } from '@/components/blocks/calendar/constants';
import { routeRegex, routes } from '@/constants/routes';
import { generateSession } from '@/utils/common';

import {
  calendarEventTypes,
  createOpportunityEventData,
} from '../../constants/opportunityData';
import { createQuotationData } from '../../constants/quotationData';
import {
  calenderEventTestIds,
  generalTestIds,
  opportunityTestIds,
} from '../../constants/testIds';
import { getIdFromUrl } from '../../utils/common/getIdFromUrl';
import {
  createNewOpportunity,
  opportunityDetailsInputTestData,
} from '../../utils/opportunities/opportunitiesFormHelpers';
import { createNewQuotationWithPurchaseVehicle } from '../../utils/quotations/quotationFormHelpers';

const uniqueOppName = opportunityDetailsInputTestData.name + generateSession(5);
let createdProposalId = '';

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  opportunityDetailsInputTestData.name = uniqueOppName;
  await page.goto(routes.opportunity.opportunities, {
    waitUntil: 'networkidle',
  });
  await page.getByTestId(opportunityTestIds.opportunityAddButton).click();
  await expect(page).toHaveURL(routes.opportunity.opportunitiesNew);
  await createNewOpportunity(page, opportunityDetailsInputTestData);
});

test.beforeEach(async ({ page }) => {
  await page.goto(routes.opportunity.opportunities, {
    waitUntil: 'networkidle',
  });
  await expect(page).toHaveURL(routes.opportunity.opportunities);
  await page
    .getByTestId(opportunityTestIds.opportunityListPageSearchTextField)
    .click();
  await page
    .getByTestId(opportunityTestIds.opportunityListPageSearchTextField)
    .getByLabel('Search')
    .fill(uniqueOppName);
  await expect(
    page
      .getByTestId('table-row-0')
      .getByTestId('table-column-0')
      .filter({ hasText: uniqueOppName })
  ).not.toHaveCount(0);

  await page.getByTestId('table-row-0').first().click();
  await expect(page).toHaveURL(routeRegex.opportunity.opportunitiesDetails);
});

test('Opportunity details page: Verify Opportunity details section has expected fields', async ({
  page,
}) => {
  await expect(
    page.getByTestId(opportunityTestIds.opportunitiesDetailsBlockContainer)
  ).toContainText('Name');
  await expect(
    page.getByTestId(opportunityTestIds.opportunitiesDetailsBlockContainer)
  ).toContainText('Status');
  await expect(
    page.getByTestId(opportunityTestIds.opportunitiesDetailsBlockContainer)
  ).toContainText('Customer');
  await expect(
    page.getByTestId(opportunityTestIds.opportunitiesDetailsBlockContainer)
  ).toContainText('Customer type');
  await expect(
    page.getByTestId(opportunityTestIds.opportunitiesDetailsBlockContainer)
  ).toContainText('Dealership');
  await expect(
    page.getByTestId(opportunityTestIds.opportunitiesDetailsBlockContainer)
  ).toContainText('Salesperson(s)');
  await expect(
    page.getByTestId(opportunityTestIds.opportunitiesDetailsBlockContainer)
  ).toContainText('Leasing Company');
  await expect(
    page.getByTestId(opportunityTestIds.opportunitiesDetailsBlockContainer)
  ).toContainText('Additional comments');
});

test('Opportunity details page: Verify Edit, status changes, redirects are working properly', async ({
  page,
}) => {
  const statusValue = await page
    .getByTestId(opportunityTestIds.opportunityDetailsBlockStatusValue)
    .innerText();
  expect(statusValue).toBe(opportunityDetailsInputTestData.status);

  // Check if button is redirecting to opportunity edit page
  await expect(
    page.getByTestId(opportunityTestIds.opportunitiesDetailsBlockContainerTitle)
  ).toBeVisible();
  await expect(
    page
      .getByTestId(opportunityTestIds.opportunitiesDetailsBlockContainer)
      .getByRole('button', { name: 'Edit' })
  ).toBeVisible();
  await page
    .getByTestId(opportunityTestIds.opportunitiesDetailsBlockContainer)
    .getByRole('button', { name: 'Edit' })
    .click();

  await expect(page).toHaveURL(routeRegex.opportunity.opportunitiesEdit);
  const opportunityId = getIdFromUrl(page);
  await page.goto(
    `${routes.opportunity.opportunities}/${opportunityId}/details`,
    {
      waitUntil: 'networkidle',
    }
  );

  // Redirect back to opportunity details page
  await expect(page).toHaveURL(routeRegex.opportunity.opportunitiesDetails);

  // Check if click on person name redirects to person details page
  await expect(
    page.getByTestId(
      opportunityTestIds.opportunityDetailsBlockCustomerNameValue
    )
  ).toBeVisible();
  await page
    .getByTestId(opportunityTestIds.opportunityDetailsBlockCustomerNameValue)
    .click();
  await expect(page).toHaveURL(routeRegex.person.personDetails);
});

test('Opportunity details page: Calendar event is creation, edit, delete', async ({
  page,
}) => {
  // Creates an event
  await expect(
    page.getByTestId(calenderEventTestIds.addCalenderEvent)
  ).toBeVisible();
  await page.getByTestId(calenderEventTestIds.addCalenderEvent).click();
  await expect(
    page.getByTestId(`${calenderEventTestIds.calenderDialog}-header-text`)
  ).toBeVisible();
  await page.getByLabel('Event Type *').click();
  await expect(page.getByRole('listbox')).toContainText(
    calendarEventTypes[EVENT_TYPE.TEST_DRIVE]
  );
  await expect(page.getByRole('listbox')).toContainText(
    calendarEventTypes[EVENT_TYPE.PHONE_CALL]
  );
  await expect(page.getByRole('listbox')).toContainText(
    calendarEventTypes[EVENT_TYPE.ONLINE_MEETING]
  );
  await expect(page.getByRole('listbox')).toContainText(
    calendarEventTypes[EVENT_TYPE.SHOWROOM_APPOINTMENT]
  );
  await page
    .getByRole('option', { name: calendarEventTypes[EVENT_TYPE.TEST_DRIVE] })
    .click();
  await page
    .getByTestId(calenderEventTestIds.startTime)
    .getByLabel('Choose time')
    .click();
  await page.getByLabel('4 hours').click();
  await page.getByRole('button', { name: 'OK' }).click();

  const calendarTitleInput = page.getByTestId(
    `${calenderEventTestIds.title}-input`
  );
  await calendarTitleInput.fill(createOpportunityEventData.title);
  await page.getByTestId(generalTestIds.customModalSubmit).click();

  await page.waitForLoadState();

  const firstCalendarEvent = await page.getByTestId(
    `${calenderEventTestIds.calendarEventViewItem}-0`
  );
  firstCalendarEvent.waitFor({ state: 'visible' });

  await expect(firstCalendarEvent).toContainText(
    createOpportunityEventData.title
  );
  console.log('CALENDAR EVENT CREATED: opportunityDetails.spec');

  // Edits an event
  await firstCalendarEvent.getByTestId('ellipsis-menu-button-icon').click();
  await expect(page.getByRole('menu')).toContainText('Edit event');
  await expect(page.getByRole('menu')).toContainText('Delete event');
  await page.getByRole('menuitem', { name: 'Edit event' }).click();
  await expect(
    page.getByLabel(calendarEventTypes[EVENT_TYPE.TEST_DRIVE])
  ).toContainText(calendarEventTypes[EVENT_TYPE.TEST_DRIVE]);

  await expect(
    page.getByTestId('text-field-with-controller-title-input')
  ).toHaveValue(createOpportunityEventData.title);

  await page.getByLabel('Event Type *').click();
  await page
    .getByRole('option', {
      name: calendarEventTypes[EVENT_TYPE.SHOWROOM_APPOINTMENT],
    })
    .click();
  await calendarTitleInput.click();

  await calendarTitleInput.fill(createOpportunityEventData.editedTitle);
  await expect(
    page.getByTestId(generalTestIds.customModalSubmit)
  ).toBeVisible();
  await page.getByTestId(generalTestIds.customModalSubmit).click();

  const editedCalendarEvent = await page
    .getByTestId(`${calenderEventTestIds.calendarEventViewItem}-0`)
    .getByText(createOpportunityEventData.editedTitle);

  await editedCalendarEvent.waitFor({ state: 'visible' });

  await expect(editedCalendarEvent).toContainText(
    createOpportunityEventData.editedTitle
  );
  console.log('CALENDAR EVENT EDITED: opportunityDetails.spec');

  // Deletes an event
  await firstCalendarEvent.getByTestId('ellipsis-menu-button-icon').click();
  await expect(page.getByRole('menu')).toContainText('Delete event');
  await page.getByRole('menuitem', { name: 'Delete event' }).click();
  const deleteSubmitButton = await page.getByTestId(
    generalTestIds.customModalSubmit
  );
  await expect(deleteSubmitButton).toBeVisible();
  await deleteSubmitButton.click();

  await editedCalendarEvent.waitFor({ state: 'detached' });
  await expect(editedCalendarEvent).not.toBeVisible();
  console.log('CALENDAR EVENT DELETED: opportunityDetails.spec');
});

test('Opportunity details page: Check proposal add navigation and empty proposal list case', async ({
  page,
}) => {
  await expect(
    page.getByTestId(opportunityTestIds.opportunityQuoteEmptyPlaceholder)
  ).toBeVisible();
  await page.getByTestId(opportunityTestIds.addQuotationButton).click();

  await expect(page).toHaveURL(routeRegex.quotation.quotationsNewOpportunityId);
  await page.getByTestId('-back-arrow-button').getByRole('img').click();
  await expect(page).toHaveURL(routeRegex.opportunity.opportunitiesDetails);
});

test('Opportunity details page: Check if the proposal accordion opens and closes', async ({
  page,
  context,
}) => {
  createdProposalId = await createNewQuotationWithPurchaseVehicle(
    page,
    createQuotationData
  );

  await expect(page).toHaveURL(routeRegex.opportunity.opportunitiesDetails);
  const firstProposalAccordion = await page.getByTestId(createdProposalId);
  firstProposalAccordion.waitFor({ state: 'attached' });
  await firstProposalAccordion.click();

  await expect(page.getByTestId('update-status-button')).toBeVisible();

  const editButton = await page.locator(
    `#${opportunityTestIds.accordionEditButton}`
  );
  const printButton = await page.locator(
    `#${opportunityTestIds.accordionPrintButton}`
  );
  const duplicateButton = await page.locator(
    `#${opportunityTestIds.accordionDuplicateButton}`
  );
  const deleteButton = await page.locator(
    `#${opportunityTestIds.accordionDeleteButton}`
  );

  await expect(editButton).toBeVisible();
  await expect(printButton).toBeVisible();
  await expect(duplicateButton).toBeVisible();
  await expect(deleteButton).toBeVisible();

  // Verify edit click is working
  await editButton.click();
  await expect(page).toHaveURL(routeRegex.quotation.quotationsEdit);
  await page.getByTestId('-back-arrow-button').click();

  // Verify duplicate click is working
  await firstProposalAccordion.click();
  await duplicateButton.click();
  await expect(page).toHaveURL(routeRegex.quotation.duplicateQuotation);
  await page.getByTestId('-back-arrow-button').click();

  // Verify print click is working
  await firstProposalAccordion.click();
  await printButton.click();

  const pdfGenerateButton = await page.getByTestId(
    generalTestIds.customModalSubmit
  );

  // Improve the case for pdf later
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    pdfGenerateButton.click(),
  ]);

  await page.on('response', async (response) => {
    const headers = response.headers();
    if (
      headers['content-type'] &&
      headers['content-type'].includes('application/pdf')
    ) {
      console.log('The content is a PDF.');
    } else {
      console.log('The content is not a PDF.');
    }
  });

  await page.waitForTimeout(5000);

  newPage.close();

  // Deletes the newly created quotation
  await deleteButton.click();
  const deleteSubmitButton = await page.getByTestId(
    generalTestIds.customModalSubmit
  );
  await expect(deleteSubmitButton).toBeVisible();
  await deleteSubmitButton.click();

  await firstProposalAccordion.waitFor({ state: 'detached' });
  await expect(firstProposalAccordion).not.toBeVisible();
  console.log('PROPOSAL DELETED: opportunityDetails.spec');
  await context.close();
});

test.afterAll(async ({ browser }) => {
  console.log('START TEARDOWN: opportunityDetails.spec');
  const page = await browser.newPage();
  await page.goto(routes.opportunity.opportunities, {
    waitUntil: 'networkidle',
  });
  await expect(page).toHaveURL(routes.opportunity.opportunities);
  await page
    .getByTestId(opportunityTestIds.opportunityListPageSearchTextField)
    .click();
  await page
    .getByTestId(opportunityTestIds.opportunityListPageSearchTextField)
    .getByLabel('Search')
    .fill(uniqueOppName);
  await expect(
    page
      .getByTestId('table-row-0')
      .getByTestId('table-column-0')
      .filter({ hasText: uniqueOppName })
  ).not.toHaveCount(0);

  await page
    .getByTestId('table-row-0-ellipsis-menu-button-icon')
    .first()
    .click();

  const opportunityDeleteRequestPromise = page.waitForRequest(
    (request) =>
      request.url().includes(routes.opportunity.opportunities) &&
      request.method() === 'POST',
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
