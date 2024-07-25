'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Grid } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import Dialog from '@/components/Dialog';
import TextFieldWithController from '@/components/TextFieldWithController';
import { useTranslations } from '@/hooks/translation';
import { NewNote, NoteItem } from '@/types/api';
import { createNote, editNote } from '@/utils/actions/formActions';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

import { notesTestIds } from '../../../../tests/e2e/constants/testIds';
import { createEditNoteValidation } from '../constants';

interface ICreateEditNoteDialogProps {
  open: boolean;
  testId?: string;
  noteDetails?: NoteItem;
  handleClose: () => void;
}

const CreateEditNoteDialog = ({
  open,
  testId,
  handleClose,
  noteDetails,
}: ICreateEditNoteDialogProps) => {
  const { id: parentEntityId } = useParams();
  const t = useTranslations();
  const validationTranslation = useTranslations('validationMessage');

  const formMethods = useForm<NewNote>({
    defaultValues: noteDetails,
    resolver: zodResolver(createEditNoteValidation(validationTranslation)),
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = formMethods;

  const handleCreateNote = async (formData: NewNote) => {
    const res = await createNote({
      ...formData,
      parentEntityId: parentEntityId as string,
    });

    if (res?.id) {
      showSuccessToast(t('common.savedSuccessfully'));
      handleClose();
    } else {
      showErrorToast(t('common.somethingWentWrong'));
    }
  };

  const handleEditNote = async (formData: NewNote) => {
    const res = await editNote({
      ...formData,
      parentEntityId: parentEntityId as string,
      noteId: noteDetails?.id,
    });

    if (res?.id) {
      showSuccessToast(t('common.savedSuccessfully'));
      handleClose();
    } else {
      showErrorToast(t('common.somethingWentWrong'));
    }
  };

  const handleAddClick = async () => {
    await handleSubmit(async (formData) => {
      if (noteDetails?.id) await handleEditNote(formData);
      else await handleCreateNote(formData);
    })();
  };

  return (
    <Dialog
      isOpen={open}
      onClose={handleClose}
      disabled={isSubmitting}
      isLoading={isSubmitting}
      onSubmit={handleAddClick}
      testId={`${testId}-dialog`}
      submitText={noteDetails?.id ? t('common.saveAndClose') : t('common.add')}
      headerElement={noteDetails?.id ? t('notes.editNote') : t('notes.addNote')}
    >
      <FormProvider {...formMethods}>
        <div>
          <DialogContent>
            <Grid container gap={2}>
              <TextFieldWithController
                required
                name='title'
                control={control}
                id='note-form-title'
                label={t('notes.noteTitle')}
                testId={notesTestIds.noteFormTitle}
              />
              <TextFieldWithController
                rows={6}
                required
                multiline
                name='content'
                control={control}
                id='note-form-content'
                label={t('notes.note')}
                sx={{
                  input: { height: '160px' },
                }}
                testId={notesTestIds.noteFormContent}
              />
            </Grid>
          </DialogContent>
        </div>
      </FormProvider>
    </Dialog>
  );
};

export default CreateEditNoteDialog;
