import { Typography } from '@AM-i-B-V/ui-kit';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

import Dialog from '@/components/Dialog';
import EllipsisMenu from '@/components/menus/EllipsisMenu';
import { useTranslations } from '@/hooks/translation';
import { NoteItem } from '@/types/api';
import { deleteNote } from '@/utils/actions/formActions';
import { formatDate } from '@/utils/date';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

import CreateEditNoteDialog from './CreateEditNote';

type NoteLineItemProps = {
  noteDetails: NoteItem;
  testId?: string;
};

const NoteLineItem = ({ noteDetails, testId = '' }: NoteLineItemProps) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const t = useTranslations();
  const { id: parentEntityId } = useParams();

  const { updatedAt, title, content, updatedBy, id: noteId } = noteDetails;
  const formattedUpdatedAt = formatDate(updatedAt, 'DD MMM YYYY HH:mm');

  const handleClickOpen = () => {
    setIsCreateOpen(true);
  };
  const handleClose = () => {
    setIsCreateOpen(false);
  };

  const handleDeleteNote = async () => {
    setLoading(true);
    const res = await deleteNote(noteId, parentEntityId as string);

    if (res?.statusCode === 202) {
      showSuccessToast(t('common.savedSuccessfully'));
      setIsDeleteOpen(false);
    } else {
      showErrorToast(t('common.somethingWentWrong'));
    }
    setLoading(false);
  };

  const menuItems = [
    {
      id: 1,
      name: t('common.edit'),
      onClick: handleClickOpen,
      testId: `${testId}-edit`,
    },
    {
      id: 2,
      name: t('common.delete'),
      onClick: () => setIsDeleteOpen(true),
      testId: `${testId}-delete`,
    },
  ];
  return (
    <>
      <div className='inline-flex w-full items-start justify-start gap-2'>
        <div className='inline-flex shrink grow basis-0 flex-col items-start justify-start'>
          <div className='inline-flex items-start justify-start gap-1 self-stretch'>
            <Typography
              variant='textSmall'
              className='text-secondary-500'
              data-testid={`${testId}-updated`}
            >
              {formattedUpdatedAt} - {updatedBy}
            </Typography>
          </div>
          <div className='flex flex-col items-start justify-start gap-1 self-stretch'>
            <Typography
              variant='textMediumBold'
              className='text-secondary'
              data-testid={`${testId}-title`}
            >
              {title}
            </Typography>
            <Typography
              variant='textMedium'
              className='text-secondary'
              data-testid={`${testId}-content`}
            >
              {content}
            </Typography>
          </div>
        </div>
        <EllipsisMenu
          menuItems={menuItems}
          index={noteId}
          testId={`${testId}-ellipsis`}
        />
      </div>
      {isCreateOpen && (
        <CreateEditNoteDialog
          open={isCreateOpen}
          handleClose={handleClose}
          noteDetails={noteDetails}
          testId={testId}
        />
      )}

      <Dialog
        onSubmit={handleDeleteNote}
        headerElement={t('notes.deleteNote')}
        onClose={() => setIsDeleteOpen(false)}
        isOpen={isDeleteOpen}
        submitText={t('common.yes')}
        testId={`${testId}-delete-dialog`}
        disabled={isLoading}
      >
        {t('notes.deleteNoteConfirmation')}
      </Dialog>
    </>
  );
};

export default NoteLineItem;
