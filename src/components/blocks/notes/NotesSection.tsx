import { Typography } from '@AM-i-B-V/ui-kit';
import { Button } from '@mui/material';
import { useState } from 'react';
import { MdAdd } from 'react-icons/md';

import { NoData } from '@/components';
import useItemPagination from '@/hooks/itemsPagination';
import { useTranslations } from '@/hooks/translation';
import { NoteItem } from '@/types/api';

import DetailBlock from '../DetailBlock';
import DetailBlockPaginationFooter from '../DetailBlockPaginationFooter';
import CreateEditNoteDialog from './CreateEditNote';
import NoteLineItem from './NoteLineItem';

const NotesSection = ({
  noteList = [],
  testId = 'notes-section',
}: {
  testId?: string;
  noteList?: NoteItem[];
}) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const DetailBlockProps = {
    title: t('notes.notes'),
    button: (
      <Button onClick={handleClickOpen} data-testid={`${testId}-add-btn`}>
        <MdAdd size='1.25rem' />
        <Typography variant='titleSmallBold' className='capitalize'>
          {t('common.add')}
        </Typography>{' '}
      </Button>
    ),
  };

  const {
    page,
    showAll,
    setPage,
    setShowAll,
    showFooter,
    itemsPerPage,
    paginatedItems,
  } = useItemPagination({
    items: noteList!,
    totalCount: noteList?.length || 0,
    itemsPerPage: 4,
  });

  return (
    <>
      <DetailBlock {...DetailBlockProps} needAccordion={false} testId={testId}>
        {paginatedItems?.length ? (
          paginatedItems.map((note, index) => (
            <div key={note.id} className='pb-4'>
              <NoteLineItem noteDetails={note} testId={`${testId}-${index}`} />
            </div>
          ))
        ) : (
          <div className='h-full w-full'>
            <NoData
              imageDimension={130}
              testId={`${testId}-empty-data-container`}
              primaryText={t('notes.noNotesDataPrimaryText')}
            />
          </div>
        )}
        {showFooter ? (
          <DetailBlockPaginationFooter
            page={page}
            showAll={showAll}
            showPagination={false}
            pageSize={itemsPerPage}
            count={noteList?.length || 0}
            onPageChange={(newPage) => setPage(newPage)}
            onShowAllChange={(newValue) => setShowAll(newValue)}
          />
        ) : null}
      </DetailBlock>
      {open && (
        <CreateEditNoteDialog
          open={open}
          testId={testId}
          handleClose={handleClose}
        />
      )}
    </>
  );
};

export default NotesSection;
