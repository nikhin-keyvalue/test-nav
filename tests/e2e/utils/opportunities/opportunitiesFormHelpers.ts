import { faker } from '@faker-js/faker';
import { expect, Page } from '@playwright/test';

import { routeRegex, routes } from '@/constants/routes';

import { commonTestIds, opportunityTestIds } from '../../constants/testIds';

// TODO can we use the generated type instead of writing a new one?
export interface OpportunityInputDataProps {
  name: string;
  status: string;
  type?: string;
  additionalComments?: string;
  closeDate?: string;
}

export const opportunityListInputTestData: OpportunityInputDataProps = {
  name: 'End to end test opportunity list',
  status: 'Interest',
  additionalComments: 'additional comments: End to end test opportunity list',
};

export const createOpportunityInputTestData: OpportunityInputDataProps = {
  name: 'End to end test create opportunity',
  status: 'Interest',
  additionalComments: 'additional comments: End to end test create opportunity',
};

export const editOpportunityInputTestData: OpportunityInputDataProps = {
  name: 'End to end test edit opportunity',
  status: 'Interest',
  additionalComments: 'additional comments: End to end test edit opportunity',
};
export const editOpportunityEditedInputTestData: OpportunityInputDataProps = {
  name: 'End to end test edit opportunity edited',
  status: 'Proposal',
  additionalComments:
    'edited additional comments: End to end test edit opportunity',
};
export const quickProposalOpportunityInputTestData: OpportunityInputDataProps =
  {
    name: 'e2e test quick proposal sample opportunity',
    status: 'Interest',
    additionalComments:
      'edited additional comments: e2e test quick proposal opportunity',
  };

export const quickPrivateProposalOpportunity: OpportunityInputDataProps = {
  name: 'e2e test quick private proposal opportunity',
  status: 'Interest',
  additionalComments:
    'edited additional comments: e2e test quick private proposal opportunity',
};

export const quickBusinessProposalOpportunity: OpportunityInputDataProps = {
  name: 'e2e test quick business proposal opportunity',
  status: 'Interest',
  additionalComments:
    'edited additional comments: e2e test quick business proposal opportunity',
};

export const opportunityDetailsInputTestData: OpportunityInputDataProps = {
  name: 'End to end test opportunity details',
  status: 'Interest',
  additionalComments:
    'additional comments: End to end test opportunity details',
};

export const opportunityBeforeAll = async (page: Page) => {
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
};

export const getNewOpportunityDetails = (): OpportunityInputDataProps => {
  // create an opportunity to ensure atleast 1 exists
  const inputData: OpportunityInputDataProps = {
    name: `${faker.vehicle.vehicle()} opportunity`,
    status: 'Interest',
    additionalComments: `${faker.lorem.sentence()} - this is e2e test generated`,
  };
  return inputData;
};

export const createNewOpportunity = async (
  page: Page,
  opportunityData: OpportunityInputDataProps
) => {
  await page.getByLabel('Name').click();
  await page.getByLabel('Name').fill(opportunityData.name);

  await expect(async () => {
    const personListPromise = page.waitForResponse((response) => {
      if (
        response.url().includes('api/getPersons') &&
        response.status() !== 200
      ) {
        console.log(response.url());
        console.log(response.status());
        throw new Error('API FAILURE');
      }

      return (
        response.url().includes('api/getPersons') && response.status() === 200
      );
    });
    await page
      .getByTestId(opportunityTestIds.createOpportunityCustomerTextField)
      .click();
    await personListPromise;

    await expect(
      page
        .getByRole('listbox', { name: 'Customer' })
        .getByRole('option')
        .first()
    ).toBeVisible();
  }).toPass();

  // TODO cover the case where there are no options visible
  await page.getByRole('listbox', { name: 'Customer' }).first().click();

  // The date is already pre-filled to present date

  await expect(async () => {
    await page
      .getByTestId(opportunityTestIds.createOpportunityDealershipTextField)
      .click();
    await expect(
      page.getByRole('listbox', { name: 'Dealer' }).getByRole('option').first()
    ).toBeVisible();
  }).toPass();

  // TODO cover the case where there are no options visible
  await page.getByRole('listbox', { name: 'Dealer' }).first().click();

  // One salesperson is selected from the dropdown by default
  let leasingCompanyNoOptionsTextCount;
  await expect(async () => {
    const leasingCompanyListPromise = page.waitForResponse((response) => {
      if (
        response
          .url()
          .includes('api/getOrganisations?isActive=true&type=LeasingCompany') &&
        response.status() !== 200
      ) {
        console.log(response.url());
        console.log(response.status());
        throw new Error('API FAILURE');
      }

      return (
        response
          .url()
          .includes('api/getOrganisations?isActive=true&type=LeasingCompany') &&
        response.status() === 200
      );
    });

    await page
      .getByTestId(opportunityTestIds.createOpportunityLeasingCompanyTextField)
      .click();
    await leasingCompanyListPromise;

    leasingCompanyNoOptionsTextCount = await page
      .getByTestId(
        opportunityTestIds.createOpportunityLeasingCompanyNoOptionsText
      )
      .count();

    if (leasingCompanyNoOptionsTextCount === 0) {
      await expect(
        page
          .getByRole('listbox', { name: 'Leasing Company' })
          .getByRole('option')
          .first()
      ).toBeVisible();
    }
  }).toPass();

  if (leasingCompanyNoOptionsTextCount === 0) {
    await page
      .getByRole('listbox', { name: 'Leasing Company' })
      .first()
      .click();
  } else {
    console.info('no leasing companies are available');
    page
      .getByTestId(opportunityTestIds.createOpportunityLeasingCompanyTextField)
      .getByLabel('Leasing Company')
      .blur();
  }

  await page.getByLabel('Additional comments').click();
  await page
    .getByLabel('Additional comments')
    .fill(opportunityData.additionalComments!);

  await expect(
    page.getByRole('button', { name: 'Save & close' }).nth(1)
  ).toBeEnabled();
  await page.getByRole('button', { name: 'Save & close' }).nth(1).click();
  await expect(page).toHaveURL(/.*details/);
};

export const verifyCreatedOpportunityInDetailsPage = async (
  page: Page,
  opportunityData: OpportunityInputDataProps
) => {
  const opportunityDetailsBlockContainer = await page.getByTestId(
    opportunityTestIds.opportunitiesDetailsBlockContainer
  );
  await expect(opportunityDetailsBlockContainer).toBeVisible();
  await expect(
    opportunityDetailsBlockContainer.getByTestId(
      opportunityTestIds.opportunityDetailsBlockNameValue
    )
  ).toHaveText(opportunityData.name);

  await expect(
    opportunityDetailsBlockContainer.getByTestId(
      opportunityTestIds.opportunityDetailsBlockStatusValue
    )
  ).toHaveText(opportunityData.status);

  await expect(
    opportunityDetailsBlockContainer.getByTestId(
      opportunityTestIds.opportunityDetailsBlockStatusValue
    )
  ).toHaveText(opportunityData.status);

  // TODO add assertions for customer name, customer type, dealership, salespersons, leasing company

  await expect(
    opportunityDetailsBlockContainer.getByTestId(
      opportunityTestIds.opportunityDetailsBlockAdditionalCommentsValue
    )
  ).toHaveText(opportunityData.additionalComments!);
};

export const getSampleEditOpportunityData = () => {
  const inputData: OpportunityInputDataProps = {
    name: `${faker.vehicle.vehicle()} opportunity`,
    status: 'Proposal',
    type: 'Private',
    additionalComments: `${faker.lorem.sentence()} - this is e2e test generated`,
  };
  return inputData;
};

export const editOpportunity = async (
  page: Page,
  opportunityData: OpportunityInputDataProps
) => {
  await page.getByLabel('Name').click();
  await page.getByLabel('Name').fill(opportunityData.name);

  await page
    .getByTestId(opportunityTestIds.createOpportunityStatusTextField)
    .click();
  await page.getByRole('option', { name: opportunityData.status }).click();

  await page
    .getByTestId(
      opportunityTestIds.createOpportunityAdditionalCommentsTextField
    )
    .click();
  await page
    .getByTestId(
      `${opportunityTestIds.createOpportunityAdditionalCommentsTextField}-input`
    )
    .clear();
  await page
    .getByTestId(
      `${opportunityTestIds.createOpportunityAdditionalCommentsTextField}-input`
    )
    .fill(opportunityData.additionalComments!);
  await page
    .getByTestId(
      `${opportunityTestIds.editOpportunitySubmitLineSaveButton}-save-btn`
    )
    .click();
  await expect(page).toHaveURL(/.*details/);
};

export const verifyEditedOpportunityInDetailsPage = async (
  page: Page,
  opportunityData: OpportunityInputDataProps
) => {
  const opportunityDetailsBlock = page.getByTestId(
    opportunityTestIds.opportunitiesDetailsBlockContainer
  );
  await opportunityDetailsBlock.waitFor();
  await expect(opportunityDetailsBlock).toBeVisible();
  await expect(
    opportunityDetailsBlock.getByTestId(
      opportunityTestIds.opportunityDetailsBlockNameValue
    )
  ).toHaveText(opportunityData.name);
  await expect(
    opportunityDetailsBlock.getByTestId(
      opportunityTestIds.opportunityDetailsBlockStatusValue
    )
  ).toHaveText(opportunityData.status);
  await expect(
    opportunityDetailsBlock.getByTestId(
      'opportunity-details-block-additional-comments-value'
    )
  ).toHaveText(opportunityData.additionalComments!);
};

export const deleteOpportunityFromList = async ({
  page,
  opportunityInputDataProps,
}: {
  page: Page;
  opportunityInputDataProps: OpportunityInputDataProps;
}) => {
  await page.goto(routes.opportunity.opportunities);
  await expect(page).toHaveURL(routes.opportunity.opportunities);
  await page
    .getByTestId(opportunityTestIds.opportunityListPageSearchTextField)
    .click();

  const opportunityListSearchCallRegex =
    /.*\/opportunities\?.*(?=.*offset=\d+)(?=.*name=[^&]*).*/;
  const opportunityListSearchResponsePromise = page.waitForResponse(
    (response) => {
      if (
        !!response.url().match(opportunityListSearchCallRegex)?.length &&
        response.status() !== 200
      ) {
        console.log('opportunity list search failed');
        console.log(response.url());
        console.log(response.status());
        throw new Error('API FAILURE');
      }

      return (
        !!response.url().match(opportunityListSearchCallRegex)?.length &&
        response.request().method() === 'GET' &&
        response.status() === 200
      );
    },
    { timeout: 10000 }
  );

  await page
    .getByTestId(opportunityTestIds.opportunityListPageSearchTextField)
    .getByLabel('Search')
    .fill(opportunityInputDataProps.name);

  await opportunityListSearchResponsePromise;
  await page.waitForLoadState('networkidle');
  /** wait for dom paint to complete */
  await page.waitForTimeout(3000);

  const listItemCount = await page
    .getByTestId('table-row-0')
    .getByTestId('table-column-0')
    .filter({ hasText: opportunityInputDataProps.name })
    .count();

  /** delete the opportunity is there is a search result */
  if (listItemCount > 0) {
    await expect(
      page
        .getByTestId('table-row-0')
        .getByTestId('table-column-0')
        .filter({ hasText: opportunityInputDataProps.name })
    ).not.toHaveCount(0);

    await page
      .getByTestId(`table-row-0-${commonTestIds.ellipsisMenuButtonIcon}`)
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
    await page.getByTestId('opportunity-list-page-ellipsis-delete').click();
    console.log(`deleting ${opportunityInputDataProps.name}`);
    await opportunityDeleteRequestPromise;
    await opportunityDeleteResponsePromise;
  }
};
