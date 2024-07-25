import { expect, test } from '@playwright/test';

import { storageStatePath } from '../../../playwright.config';
import {
  createOrgData,
  editOrgCookieName,
  editOrgData,
  orgCookieName,
  testDataForOrgEdit,
} from '../constants/organisationData';
import { organisationListTestIds } from '../constants/testIds';
import { setTestCookie } from '../utils/common/cookieFunctions';
import {
  createNewOrganisation,
  createNewOrganisationForDetails,
  deleteExistingOrg,
} from '../utils/organisation/organisationFormHelpers';

let isOrgListEmpty;

test('Test: Create organisation - Delete Existing Organisation 1', async ({
  page,
}, testInfo) => {
  await page.goto('/organisations', { waitUntil: 'networkidle' });
  await page.getByTestId('organisation-listing-filter-container').click();
  await page
    .getByRole('textbox', { name: 'Search' })
    .fill(createOrgData.kvkData.name);
  await page.waitForTimeout(3000);
  isOrgListEmpty = await page
    .getByTestId(organisationListTestIds.orgListEmpty)
    .isVisible();
  if (!isOrgListEmpty)
    await deleteExistingOrg(createOrgData.kvkData.name, page);
});

test('Test: Create organisation - Delete Existing Organisation 2', async ({
  page,
}) => {
  await page.goto('/organisations', { waitUntil: 'networkidle' });
  await page.getByTestId('organisation-listing-filter-container').click();
  await page
    .getByRole('textbox', { name: 'Search' })
    .fill(testDataForOrgEdit.name);
  await page.waitForTimeout(3000);
  isOrgListEmpty = await page
    .getByTestId(organisationListTestIds.orgListEmpty)
    .isVisible();
  if (!isOrgListEmpty) await deleteExistingOrg(testDataForOrgEdit.name, page);
  await page.goto('/organisations', { waitUntil: 'networkidle' });
  await page.getByTestId('organisation-listing-filter-container').click();
  await page
    .getByRole('textbox', { name: 'Search' })
    .fill(editOrgData.kvkData.name);
  await page.waitForTimeout(3000);
  isOrgListEmpty = await page
    .getByTestId(organisationListTestIds.orgListEmpty)
    .isVisible();
  if (!isOrgListEmpty) await deleteExistingOrg(editOrgData.kvkData.name, page);
});

test('Test: Create organisation - Happy Flow with all fields filled', async ({
  page,
  context,
}, testInfo) => {
  await page.goto('/organisations/new', { waitUntil: 'networkidle' });
  await createNewOrganisation(page, createOrgData);
  let urlParts = page.url().split('/');
  let id = urlParts[urlParts.length - 2];
  expect(id).toBeTruthy();
  setTestCookie(page, orgCookieName, id);
  await page.goto('/organisations', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page).toHaveURL(/.*\/organisations\/new/);
  await createNewOrganisationForDetails(page, editOrgData);
  urlParts = page.url().split('/');
  id = urlParts[urlParts.length - 2];
  expect(id).toBeTruthy();
  setTestCookie(page, editOrgCookieName, id);
  const projectName = testInfo.project.name.split('-')[0];
  await page.context().storageState({
    path: `${storageStatePath}/${projectName}.json`,
  });
});
