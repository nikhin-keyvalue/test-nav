import { expect, Page } from '@playwright/test';

import { PersonTestData } from '../../constants/testData';
import { opportunityTestIds, quickProposalIds } from '../../constants/testIds';
import { OpportunityInputDataProps } from '../opportunities/opportunitiesFormHelpers';

export const selectPersonFromDropDown = async ({
  page,
  personTestData,
  personListRequestRegex,
}: {
  page: Page;
  personTestData: PersonTestData;
  personListRequestRegex: RegExp;
}) => {
  await expect(
    page.getByTestId(quickProposalIds.quickProposalIsPersonAvailableTitle)
  ).toBeVisible();

  await page
    .getByTestId('find-person-text-field')
    .locator('div')
    .first()
    .click();

  const personListResponsePromise = page.waitForResponse(
    (response) => {
      if (
        !!response.url().match(personListRequestRegex)?.length &&
        response.status() !== 200
      ) {
        console.log('person list  failed');
        console.log(response.url());
        console.log(response.status());
        throw new Error('API FAILURE');
      }
      return (
        !!response.url().match(personListRequestRegex)?.length &&
        response.request().method() === 'GET' &&
        response.status() === 200
      );
    },
    {
      timeout: 10000,
    }
  );

  await page
    .getByTestId('find-person-text-field')
    .getByLabel('Find person')
    .fill(personTestData.firstName);

  await personListResponsePromise;

  await page.getByTestId('find-person-text-field-listbox').first().click();

  await expect(page.getByTestId('person-details-block')).toBeVisible();
};

export const completeAddOpportunityDetailsStep = async ({
  page,
  opportunityTestData,
}: {
  page: Page;
  opportunityTestData: OpportunityInputDataProps;
}) => {
  await expect(
    page.getByTestId(quickProposalIds.quickProposalOpportunityFormContainer)
  ).toBeVisible();
  await page
    .getByTestId(`${opportunityTestIds.createOpportunityNameTextField}-input`)
    .fill(opportunityTestData.name);

  const opportunityDetailResponsePromise = page.waitForResponse(
    async (response) => {
      if (
        response.url().includes('/quotations/quick') &&
        response.status() !== 200
      ) {
        console.log(response.url());
        console.log(response.status());
        throw new Error('API FAILURE');
      }
      const payload = await response.request().postDataJSON();

      return (
        response.url().includes('/quotations/quick') &&
        response.status() === 200 &&
        Array.isArray(payload) &&
        payload.length === 1 &&
        typeof payload[0] === 'string'
      );
    },
    { timeout: 10000 }
  );

  await page
    .getByTestId(quickProposalIds.opportunitySaveAndProceedButton)
    .click();

  /** wait for the opportunity detail response */
  await opportunityDetailResponsePromise;
  await expect(
    page.getByTestId(quickProposalIds.quickProposalOpportunityDetailsName)
  ).toBeVisible();
};
