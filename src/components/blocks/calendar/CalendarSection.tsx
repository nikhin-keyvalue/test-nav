import { Typography } from '@AM-i-B-V/ui-kit';
import { Button } from '@mui/material';
import { useState } from 'react';
import { MdAdd } from 'react-icons/md';

import { NoData } from '@/components';
import useItemPagination from '@/hooks/itemsPagination';
import { useTranslations } from '@/hooks/translation';
import { EmailType, PersonsDetails } from '@/types/api';

import { calenderEventTestIds } from '../../../../tests/e2e/constants/testIds';
import DetailBlock from '../DetailBlock';
import DetailBlockPaginationFooter from '../DetailBlockPaginationFooter';
import CalendarEvent from './CalendarEvent';
import CreateEditEventDialog from './CreateEditEvent';
import { EventItem } from './types';

const CalendarSection = ({
  events = [],
  customerDetails,
}: {
  events: EventItem[];
  customerDetails?: PersonsDetails | null;
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
    title: t('events.calendar'),
    button: (
      <Button
        onClick={handleClickOpen}
        data-testid={calenderEventTestIds.addCalenderEvent}
      >
        <MdAdd size='1.25rem' />
        <Typography variant='titleSmallBold' className='capitalize'>
          {t('common.add')}
        </Typography>
      </Button>
    ),
  };

  const {
    paginatedItems,
    showAll,
    setShowAll,
    itemsPerPage,
    showFooter,
    page,
    setPage,
  } = useItemPagination({
    items: events!,
    totalCount: events.length,
    itemsPerPage: 4,
  });

  const primaryEmail = customerDetails?.emails?.find(
    (emailItem: EmailType) => emailItem.isPrimary
  );
  return (
    <>
      <DetailBlock {...DetailBlockProps}>
        <div className='flex flex-wrap justify-between gap-2 pb-4'>
          {paginatedItems?.length ? (
            paginatedItems.map((event, index) => (
              <CalendarEvent
                key={event.id}
                eventDetails={event}
                index={index}
              />
            ))
          ) : (
            <div className='h-full w-full'>
              <NoData
                primaryText={t('events.noEventDataPrimaryText')}
                imageDimension={130}
              />
            </div>
          )}
        </div>
        {showFooter ? (
          <DetailBlockPaginationFooter
            page={page}
            pageSize={itemsPerPage}
            count={events.length}
            showAll={showAll}
            onShowAllChange={(newValue) => setShowAll(newValue)}
            onPageChange={(newPage) => setPage(newPage)}
            showPagination={false}
          />
        ) : null}
      </DetailBlock>
      {open && (
        <CreateEditEventDialog
          open={open}
          handleClose={handleClose}
          defaultEmail={primaryEmail}
        />
      )}
    </>
  );
};

export default CalendarSection;
