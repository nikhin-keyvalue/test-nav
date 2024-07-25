import { expect, test } from '@playwright/test';

import enMessages from '../../../../messages/en.json';
import { orgCookieName } from '../../constants/organisationData';
import { organisationDetailTestIds } from '../../constants/testIds';
import { getTestCookie } from '../../utils/common/cookieFunctions';

test.beforeEach(async ({ page, context }) => {
  // Runs before each test and navigates to organisation details
  const orgId = await getTestCookie(context, orgCookieName);
  await page.goto(`/organisations/${orgId}/details`);
  await expect(page).toHaveURL(/.*details/);
});

test('Test: Org Details - Verify action of Edit-button in organisation details page', async ({
  page,
}) => {
  //   verify navigation to edit-page from organisation-details
  await page.getByTestId('organisation-details-edit-btn').click();
  await expect(page).toHaveURL(/.*edit/);

  // click back arrow button
  await page.getByTestId('organisation-edit-page-back-arrow-button').click();
  await expect(page).toHaveURL(/.*details/);
});

test('Test: Org Details - Verify notes section & Add notes functionality', async ({
  page,
}) => {
  await expect(
    page.getByTestId(organisationDetailTestIds.noteBlockHeader)
  ).toHaveText('Notes');
  // A newly created organisation will have no notes to display
  const notesEmptyContainer = page.getByTestId(
    organisationDetailTestIds.notesEmpty
  );

  const isEmptyNotesContainerVisible = await notesEmptyContainer.isVisible();

  if (!isEmptyNotesContainerVisible) {
    // Scroll the element into view using scrollIntoViewIfNeeded
    await notesEmptyContainer.scrollIntoViewIfNeeded();
  }

  // Now the element should be visible, proceed with your expectation
  await expect(notesEmptyContainer).toBeVisible();
  await expect(
    page.getByTestId(`${organisationDetailTestIds.notesEmpty}-primary-text`)
  ).toHaveText('No notes available');

  // click on add notes button and verify the add-note-dialog is visible
  await expect(
    page.getByTestId(organisationDetailTestIds.addNotesBtn)
  ).toBeVisible();
  await page.getByTestId(organisationDetailTestIds.addNotesBtn).click();
  await expect(
    page.getByTestId(`${organisationDetailTestIds.notesDialog}-content`)
  ).toBeVisible();
  await expect(
    page.getByTestId(`${organisationDetailTestIds.notesDialog}-header-text`)
  ).toHaveText('Add note');

  // verify the presence of Add and Cancel buttons in create note dialog
  await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();

  // verify Cancel buttons action
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(
    page.getByTestId(`${organisationDetailTestIds.notesDialog}-content`)
  ).not.toBeVisible();

  // verify add notes dialog form validations are working
  await page.getByTestId(organisationDetailTestIds.addNotesBtn).click();
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForSelector('#note-form-title-helper-text');

  let element = await page.$('#note-form-title-helper-text');
  let textContent = await element?.textContent();

  expect(textContent).toBe(enMessages.validationMessage.mandatoryMessage);

  await page.waitForSelector('#note-form-title-helper-text');

  element = await page.$('#note-form-content-helper-text');
  textContent = await element?.textContent();
  expect(textContent).toBe(enMessages.validationMessage.mandatoryMessage);

  await page
    .getByTestId(`${organisationDetailTestIds.noteTitle}-input`)
    .fill('My note1');
  element = await page.$('#note-form-title-helper-text');
  textContent = await element?.textContent();
  expect(textContent).not.toBe(enMessages.validationMessage.mandatoryMessage);

  await page
    .getByTestId(`${organisationDetailTestIds.noteContent}-input`)
    .fill('My note1 contains some details');
  element = await page.$('#note-form-content-helper-text');
  textContent = await element?.textContent();
  expect(textContent).not.toBe(enMessages.validationMessage.mandatoryMessage);

  await page.getByRole('button', { name: 'Add' }).click();

  await expect(
    page.getByTestId(`${organisationDetailTestIds.topNote}-title`)
  ).toHaveText('My note1');
  await expect(
    page.getByTestId(`${organisationDetailTestIds.topNote}-content`)
  ).toHaveText('My note1 contains some details');

  await page
    .getByTestId(`${organisationDetailTestIds.topNote}-ellipsis-icon`)
    .click();
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(notesEmptyContainer).toBeVisible();
});

test('Test: Org Details - Verify Edit and Delete notes functionality', async ({
  page,
}) => {
  // Add the note to be edited
  await page.getByTestId(organisationDetailTestIds.addNotesBtn).click();

  await page
    .getByTestId(`${organisationDetailTestIds.noteTitle}-input`)
    .fill('My note1');

  await page
    .getByTestId(`${organisationDetailTestIds.noteContent}-input`)
    .fill('My note1 contains some details');
  await page.getByRole('button', { name: 'Add' }).click();
  // waiting for note to be added and modal to be closed
  await expect(
    page.getByTestId(`${organisationDetailTestIds.topNote}-title`)
  ).toHaveText('My note1');
  await expect(
    page.getByTestId(`${organisationDetailTestIds.topNote}-content`)
  ).toHaveText('My note1 contains some details');

  //   Edit note CTA
  await page
    .getByTestId(`${organisationDetailTestIds.topNote}-ellipsis-icon`)
    .click();
  await page.getByTestId(`${organisationDetailTestIds.topNote}-edit`).click();

  // verify edit-note dialog is opened on clicking edit note CTA
  await expect(
    page.getByTestId(`${organisationDetailTestIds.topNote}-dialog-content`)
  ).toBeVisible();
  await expect(
    page.getByTestId(`${organisationDetailTestIds.topNote}-dialog-header-text`)
  ).toHaveText('Edit Note');

  // verify that save and cancel buttons are visible in edit-note dialog
  await expect(
    page.getByRole('button', { name: 'Save & Close' })
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();

  // verify cancel button action in edit-note dialog
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(
    page.getByTestId(`${organisationDetailTestIds.topNote}-dialog-content`)
  ).not.toBeVisible();

  await page
    .getByTestId(`${organisationDetailTestIds.topNote}-ellipsis-icon`)
    .click();
  await page.getByTestId(`${organisationDetailTestIds.topNote}-edit`).click();

  // verify edit-notes form validations are working
  await page
    .getByTestId(`${organisationDetailTestIds.noteTitle}-input`)
    .fill('');
  await page
    .getByTestId(`${organisationDetailTestIds.noteContent}-input`)
    .fill('');
  await page.getByRole('button', { name: 'Save & Close' }).click();

  await expect(page.locator('#note-form-title-helper-text')).toHaveText(
    enMessages.validationMessage.mandatoryMessage
  );
  await expect(page.locator('#note-form-content-helper-text')).toHaveText(
    enMessages.validationMessage.mandatoryMessage
  );

  // verify edit-notes functionality
  await page
    .getByTestId(`${organisationDetailTestIds.noteTitle}-input`)
    .fill('Updated My note1');
  await expect(page.locator('#note-form-title-helper-text')).not.toBeVisible();

  await page
    .getByTestId(`${organisationDetailTestIds.noteContent}-input`)
    .fill('My note1 contains updated details');
  await expect(
    page.locator('#note-form-content-helper-text')
  ).not.toBeVisible();

  await page.getByRole('button', { name: 'Save & Close' }).click();

  await expect(
    page.getByTestId(`${organisationDetailTestIds.topNote}-title`)
  ).toHaveText('Updated My note1');
  await expect(
    page.getByTestId(`${organisationDetailTestIds.topNote}-content`)
  ).toHaveText('My note1 contains updated details');

  await page
    .getByTestId(`${organisationDetailTestIds.topNote}-ellipsis-icon`)
    .click();
  await page.getByTestId(`${organisationDetailTestIds.topNote}-delete`).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(
    page.getByTestId(organisationDetailTestIds.notesEmpty)
  ).toBeVisible();
});

test('Test: Org Details - Verify connections', async ({ page }) => {
  const connectionsBlock = page.getByTestId(
    organisationDetailTestIds.connectionsBlock
  );
  // Connections block : Verify the title
  await expect(
    connectionsBlock.getByTestId(
      `${organisationDetailTestIds.connectionsBlock}-title`
    )
  ).toHaveText('Connections');

  // Connections block : Verify the content
  await expect(
    connectionsBlock
      .getByRole('button')
      .and(
        connectionsBlock.getByTestId(organisationDetailTestIds.addConnectionBtn)
      )
  ).toHaveText('Add');

  // Connections block - add menu :  Verify the options
  // // Time out added because initially the notes block takes full width and then readjusts its size which makes the modal to close
  await connectionsBlock
    .getByTestId(organisationDetailTestIds.addConnectionBtn)
    .click();
  await expect(
    page.getByTestId(
      `${organisationDetailTestIds.connectionsBlock}-add-organisation`
    )
  ).toBeVisible();

  // Connections block - add organisation modal :  Verify the content
  await page
    .getByTestId(
      `${organisationDetailTestIds.connectionsBlock}-add-organisation`
    )
    .click();
  await expect(page.getByText('Add Connection')).toBeVisible();
  await expect(page.getByLabel('Relation Type')).toBeVisible();
  await expect(page.getByLabel('Find existing organisation')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Create new organisation' })
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();

  // Add organisation modal: Verify if new organisation page opened on clicking "Create new organisation"
  let organisationPagePromise = page.context().waitForEvent('page');
  await page.getByRole('button', { name: 'Create new organisation' }).click();

  const neworganisationPage = await organisationPagePromise;
  await neworganisationPage.waitForLoadState();
  expect(neworganisationPage.url()).toMatch('organisations/new');

  // Add organisation modal: Check if modal closed on clicking cancel
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByText('Add Connection')).not.toBeVisible();

  // Connections block - add organisation modal :  Verify the content
  await page.getByTestId(organisationDetailTestIds.addConnectionBtn).click();
  await page
    .getByTestId(
      `${organisationDetailTestIds.connectionsBlock}-add-organisation`
    )
    .click();
  await expect(page.getByText('Add Connection')).toBeVisible();
  await expect(page.getByLabel('Relation Type')).toBeVisible();
  await expect(page.getByLabel('Find existing organisation')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Create new organisation' })
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();

  // Add organisation modal: Verify if new organisation page opened on clicking "Create new organisation"
  organisationPagePromise = page.context().waitForEvent('page');
  await page.getByRole('button', { name: 'Create new organisation' }).click();

  const newOrganisationPage = await organisationPagePromise;
  await newOrganisationPage.waitForLoadState();
  expect(newOrganisationPage.url()).toMatch('organisations/new');

  // Add organisation modal: Check if modal closed on clicking cancel
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByText('Add Connection')).not.toBeVisible();
});
