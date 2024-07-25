import { expect, test } from '@playwright/test';

import { notesTestIds } from '../../constants/testIds';
import {
  createNewPerson,
  getNewPersonDetails,
} from '../../utils/person/personFormHelpers';

test.beforeEach(async ({ page }) => {
  // Runs before each test and creates a new person
  const newPersonData = getNewPersonDetails();

  await page.goto('/persons');
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page).toHaveURL(/.*\/persons\/new/);

  await createNewPerson(page, newPersonData);
});

test('Verify action of Edit-button in person details page', async ({
  page,
}) => {
  //   verify navigation to edit-page from person-details
  await page.getByRole('button', { name: 'Edit' }).click();
  await expect(page).toHaveURL(/.*edit/);

  // click back arrow button
  await page.getByTestId('edit-person-page-back-arrow-button').click();
  await expect(page).toHaveURL(/.*details/);
});

test('Verify notes section & Add notes functionality', async ({ page }) => {
  await expect(page.getByTestId('person-details-notes-title')).toHaveText(
    'Notes'
  );
  // A newly created person will have no notes to display
  await expect(
    page.getByTestId('person-details-notes-empty-data-container')
  ).toBeVisible();
  await expect(
    page.getByTestId('person-details-notes-empty-data-container-primary-text')
  ).toHaveText('No notes available');

  // click on add notes button and verify the add-note-dialog is visible
  await expect(page.getByTestId('person-details-notes-add-btn')).toBeVisible();
  await page.getByTestId('person-details-notes-add-btn').click();
  await expect(
    page.getByTestId('person-details-notes-dialog-content')
  ).toBeVisible();
  await expect(
    page.getByTestId('person-details-notes-dialog-header-text')
  ).toHaveText('Add note');

  // verify the presence of Add and Cancel buttons in create note dialog
  await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();

  // verify Cancel buttons action
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(
    page.getByTestId('person-details-notes-dialog-content')
  ).not.toBeVisible();

  // verify add notes dialog form validations are working
  await page.getByTestId('person-details-notes-add-btn').click();
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.locator('#note-form-title-helper-text')).toHaveText(
    'Please fill this required field'
  );
  await expect(page.locator('#note-form-content-helper-text')).toHaveText(
    'Please fill this required field'
  );

  await page.getByTestId(`${notesTestIds.noteFormTitle}-input`).click();
  await page
    .getByTestId(`${notesTestIds.noteFormTitle}-input`)
    .fill('My note1');

  await expect(page.locator('#note-form-title-helper-text')).not.toBeVisible();

  await page.getByTestId(`${notesTestIds.noteFormContent}-input`).click();
  await page
    .getByTestId(`${notesTestIds.noteFormContent}-input`)
    .fill('My note1 contains some details');

  await expect(
    page.locator('#note-form-content-helper-text')
  ).not.toBeVisible();

  await page.getByRole('button', { name: 'Add' }).click();
  // waiting for note to be added and modal to be closed
  await page.waitForTimeout(2000);

  await expect(page.getByTestId('person-details-notes-0-title')).toHaveText(
    'My note1'
  );
  await expect(page.getByTestId('person-details-notes-0-content')).toHaveText(
    'My note1 contains some details'
  );
});

test('Verify Edit notes functionality', async ({ page }) => {
  // Add the note to be edited
  await page.getByTestId('person-details-notes-add-btn').click();

  await page.getByTestId(`${notesTestIds.noteFormTitle}-input`).click();
  await page
    .getByTestId(`${notesTestIds.noteFormTitle}-input`)
    .fill('My note1');

  await page.getByTestId(`${notesTestIds.noteFormContent}-input`).click();
  await page
    .getByTestId(`${notesTestIds.noteFormContent}-input`)
    .fill('My note1 contains some details');
  await page.getByRole('button', { name: 'Add' }).click();
  // waiting for note to be added and modal to be closed
  await page.waitForTimeout(2000);

  await expect(page.getByTestId('person-details-notes-0-title')).toHaveText(
    'My note1'
  );
  await expect(page.getByTestId('person-details-notes-0-content')).toHaveText(
    'My note1 contains some details'
  );

  //   Edit note CTA
  await page.getByTestId('person-details-notes-0-ellipsis-icon').click();
  await page.getByTestId('person-details-notes-0-edit').click();

  // verify edit-note dialog is opened on clicking edit note CTA
  await expect(
    page.getByTestId('person-details-notes-0-dialog-content')
  ).toBeVisible();
  await expect(
    page.getByTestId('person-details-notes-0-dialog-header-text')
  ).toHaveText('Edit Note');

  // verify that save and cancel buttons are visible in edit-note dialog
  await expect(
    page.getByRole('button', { name: 'Save & Close' })
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();

  // verify cancel button action in edit-note dialog
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(
    page.getByTestId('person-details-notes-0-dialog-content')
  ).not.toBeVisible();

  await page.getByTestId('person-details-notes-0-ellipsis-icon').click();
  await page.getByTestId('person-details-notes-0-edit').click();

  // verify edit-notes form validations are working
  await page.getByTestId(`${notesTestIds.noteFormTitle}-input`).click();
  await page.getByTestId(`${notesTestIds.noteFormTitle}-input`).fill('');
  await page.getByTestId(`${notesTestIds.noteFormContent}-input`).click();
  await page.getByTestId(`${notesTestIds.noteFormContent}-input`).fill('');
  await page.getByRole('button', { name: 'Save & Close' }).click();

  await expect(page.locator('#note-form-title-helper-text')).toHaveText(
    'Please fill this required field'
  );
  await expect(page.locator('#note-form-content-helper-text')).toHaveText(
    'Please fill this required field'
  );

  // verify edit-notes functionality
  await page.getByTestId(`${notesTestIds.noteFormTitle}-input`).click();
  await page
    .getByTestId(`${notesTestIds.noteFormTitle}-input`)
    .fill('Updated My note1');
  await expect(page.locator('#note-form-title-helper-text')).not.toBeVisible();

  await page.getByTestId(`${notesTestIds.noteFormContent}-input`).click();
  await page
    .getByTestId(`${notesTestIds.noteFormContent}-input`)
    .fill('My note1 contains updated details');
  await expect(
    page.locator('#note-form-content-helper-text')
  ).not.toBeVisible();

  await page.getByRole('button', { name: 'Save & Close' }).click();
  // waiting for note to be edited and modal to be closed
  await page.waitForTimeout(2000);

  await expect(page.getByTestId('person-details-notes-0-title')).toHaveText(
    'Updated My note1'
  );
  await expect(page.getByTestId('person-details-notes-0-content')).toHaveText(
    'My note1 contains updated details'
  );
});

test('Verify Delete notes functionality', async ({ page }) => {
  // Add the note to be deleted
  await page.getByTestId('person-details-notes-add-btn').click();

  await page.getByTestId(`${notesTestIds.noteFormTitle}-input`).click();
  await page
    .getByTestId(`${notesTestIds.noteFormTitle}-input`)
    .fill('My note1');

  await page.getByTestId(`${notesTestIds.noteFormContent}-input`).click();
  await page
    .getByTestId(`${notesTestIds.noteFormContent}-input`)
    .fill('My note1 contains some details');
  await page.getByRole('button', { name: 'Add' }).click();
  // waiting for note to be added and modal to be closed
  await page.waitForTimeout(2000);

  await expect(page.getByTestId('person-details-notes-0-title')).toHaveText(
    'My note1'
  );
  await expect(page.getByTestId('person-details-notes-0-content')).toHaveText(
    'My note1 contains some details'
  );

  //   Delete note CTA
  await page.getByTestId('person-details-notes-0-ellipsis-icon').click();
  await page.getByTestId('person-details-notes-0-delete').click();

  // expect dialog to be open with delete confirmation
  await expect(
    page.getByTestId('person-details-notes-0-delete-dialog-content')
  ).toBeVisible();
  await expect(
    page.getByTestId('person-details-notes-0-delete-dialog-header-text')
  ).toHaveText('Delete Note');

  // verify delete confirmation - yes and cancel buttons are visible
  await expect(page.getByRole('button', { name: 'Yes' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();

  // verify delete confirmation dialog's cancel-btn click
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(
    page.getByTestId('person-details-notes-0-delete-dialog-content')
  ).not.toBeVisible();

  await page.getByTestId('person-details-notes-0-ellipsis-icon').click();
  await page.getByTestId('person-details-notes-0-delete').click();

  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.getByText('Delete Note')).not.toBeVisible();
  await expect(
    page.getByTestId('person-details-notes-0-title')
  ).not.toBeVisible();
  await expect(
    page.getByTestId('person-details-notes-0-content')
  ).not.toBeVisible();
});
