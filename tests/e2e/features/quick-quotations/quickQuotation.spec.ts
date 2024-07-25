import test, { expect } from '@playwright/test';

import { routeRegex, routes } from '@/constants/routes';

import {
  businessPersonTestData,
  endToEndTestReadOnlyOrganisation,
} from '../../constants/testData';
import { quickProposalIds } from '../../constants/testIds';
import {
  createNewOpportunity,
  deleteOpportunityFromList,
  OpportunityInputDataProps,
  quickBusinessProposalOpportunity,
  quickPrivateProposalOpportunity,
  quickProposalOpportunityInputTestData,
  verifyCreatedOpportunityInDetailsPage,
} from '../../utils/opportunities/opportunitiesFormHelpers';
import {
  completeAddOpportunityDetailsStep,
  selectPersonFromDropDown,
} from '../../utils/quick-quotation/util';

let newOpportunityTestInputData: OpportunityInputDataProps;

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  newOpportunityTestInputData = quickProposalOpportunityInputTestData;
  await page.goto(routes.opportunity.opportunitiesNew);
  await expect(page).toHaveURL(routeRegex.opportunity.opportunitiesNew);

  await createNewOpportunity(page, newOpportunityTestInputData);
  await verifyCreatedOpportunityInDetailsPage(
    page,
    newOpportunityTestInputData
  );
  await page.close();
});

test.beforeEach(async ({ page }) => {
  await page.goto(routes.quotation.quotationsQuick, {
    waitUntil: 'networkidle',
  });
  await expect(page).toHaveURL(routeRegex.quotation.quotationsQuick);
});

test('quick quotation page: Go to create quotation page by using a pre-existing opportunity', async ({
  page,
}) => {
  await expect(
    page.getByTestId(quickProposalIds.quickProposalHeading)
  ).toBeVisible();
  await page
    .getByTestId('find-opportunity-text-field')
    .locator('div')
    .first()
    .click();

  await page
    .getByTestId('find-opportunity-text-field')
    .getByLabel('Find opportunity')
    .fill(newOpportunityTestInputData.name);

  await page.getByTestId('find-opportunity-text-field-listbox').first().click();
  await expect(
    page.getByTestId(quickProposalIds.quickProposalPersonDetailsTitle)
  ).toBeVisible();
  await expect(
    page.getByTestId(quickProposalIds.quickProposalOpportunityDetailsName)
  ).toBeVisible();
  await page
    .getByTestId(quickProposalIds.quickQuotationSubmitLineSaveBtn)
    .click();
  await expect(page).toHaveURL(routeRegex.quotation.quotationsNewOpportunityId);
});

test('quick quotation page: Go to create quotation page via Private proposal flow', async ({
  page,
}) => {
  await page
    .getByTestId(quickProposalIds.quickQuotationCreateNewOpportunityButton)
    .click();
  await expect(
    page.getByTestId(quickProposalIds.quickQuotationIsThereOpportunityTitle)
  ).toBeVisible();
  await page.getByTestId(quickProposalIds.privateQuotationRadioButton).click();

  await expect(
    page.getByTestId(quickProposalIds.quickProposalIsPersonAvailableTitle)
  ).toBeVisible();

  const privatePersonListRequestRegex =
    /.*\/api\/getPersons\?isActive=true&type=Private&limit=50/;

  await selectPersonFromDropDown({
    page,
    personTestData: businessPersonTestData,
    personListRequestRegex: privatePersonListRequestRegex,
  });

  await completeAddOpportunityDetailsStep({
    opportunityTestData: quickPrivateProposalOpportunity,
    page,
  });

  await page
    .getByTestId(quickProposalIds.quickQuotationSubmitLineSaveBtn)
    .click();

  await expect(page).toHaveURL(routeRegex.quotation.quotationsNewOpportunityId);
});

test('quick quotation page: Go to create quotation page via Business proposal flow', async ({
  page,
}) => {
  await page
    .getByTestId(quickProposalIds.quickQuotationCreateNewOpportunityButton)
    .click();
  await expect(
    page.getByTestId(quickProposalIds.quickQuotationIsThereOpportunityTitle)
  ).toBeVisible();
  await page.getByTestId(quickProposalIds.businessQuotationRadioButton).click();
  await expect(
    page.getByTestId(
      quickProposalIds.quickProposalAreOrganisationAvailableTitle
    )
  ).toBeVisible();
  const organisationListRequestRegex =
    /.*\/api\/getOrganisations\?isActive=true&limit=50/;

  await page
    .getByTestId(quickProposalIds.findOrganisationTextField)
    .locator('div')
    .first()
    .click();

  const organisationListRequestPromise = page.waitForResponse(
    (response) => {
      if (
        !!response.url().match(organisationListRequestRegex)?.length &&
        response.status() !== 200
      ) {
        console.log('organisation list failed');
        console.log(response.url());
        console.log(response.status());
        throw new Error('API FAILURE');
      }
      return (
        !!response.url().match(organisationListRequestRegex)?.length &&
        response.request().method() === 'GET' &&
        response.status() === 200
      );
    },
    {
      timeout: 10000,
    }
  );
  await page
    .getByTestId(quickProposalIds.findOrganisationTextField)
    .getByLabel('Find organisation')
    .fill(endToEndTestReadOnlyOrganisation);

  await organisationListRequestPromise;
  await page
    .getByTestId(`${quickProposalIds.findOrganisationTextField}-listbox`)
    .first()
    .click();
  await expect(page.getByTestId('organisation-details-block')).toBeVisible();

  /** select a person from dropdown */
  const businessPersonListRequestRegex =
    /.*\/api\/getPersons\?isActive=true&type=Business&organisationId=[A-Za-z0-9]+&limit=50/;

  await selectPersonFromDropDown({
    page,
    personTestData: businessPersonTestData,
    personListRequestRegex: businessPersonListRequestRegex,
  });

  await completeAddOpportunityDetailsStep({
    opportunityTestData: quickBusinessProposalOpportunity,
    page,
  });
  await page
    .getByTestId(quickProposalIds.quickQuotationSubmitLineSaveBtn)
    .click();

  await expect(page).toHaveURL(routeRegex.quotation.quotationsNewOpportunityId);
});

/** Teardown */
test.afterAll(async ({ browser }) => {
  /**  This console log is here to track the teardown points in the terminal */
  console.log('START TEARDOWN: quickQuotation.spec');
  const page = await browser.newPage();
  await deleteOpportunityFromList({
    page,
    opportunityInputDataProps: newOpportunityTestInputData,
  });
  await deleteOpportunityFromList({
    page,
    opportunityInputDataProps: quickPrivateProposalOpportunity,
  });
  await deleteOpportunityFromList({
    page,
    opportunityInputDataProps: quickBusinessProposalOpportunity,
  });
  await page.close();
});
