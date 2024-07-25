import { Typography } from '@AM-i-B-V/ui-kit';
import { Box } from '@mui/material';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import { CustomDialog } from '@/components';
import EllipsisMenu from '@/components/menus/EllipsisMenu';
import { useTranslations } from '@/hooks/translation';
import { formatDateTimeRange } from '@/utils/date';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

import { calenderEventTestIds } from '../../../../tests/e2e/constants/testIds';
import { deleteEvent } from './api';
import CreateEditEventDialog from './CreateEditEvent';
import { EventItem } from './types';

const CalendarEvent = ({
  eventDetails,
  index,
}: {
  eventDetails: EventItem;
  index?: number;
}) => {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { id: parentEntityId } = useParams();

  const dateObject = dayjs(eventDetails?.startDateTime);
  const parsedDate = dayjs(dateObject);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteEvent = async () => {
    setLoading(true);
    const res = await deleteEvent(eventDetails.id, parentEntityId as string);

    if (res?.statusCode === 202) {
      showSuccessToast(t('common.savedSuccessfully'));
      setIsDeleteOpen(false);
    } else {
      showErrorToast(t('common.somethingWentWrong'));
    }
    setLoading(false);
  };

  const date = parsedDate.date();
  const monthName = parsedDate.format('MMMM');

  const timeInLocal = formatDateTimeRange(
    eventDetails.startDateTime,
    eventDetails.endDateTime!
  );

  return (
    <>
      <Box
        className='flex h-16 w-full basis-[49%] justify-between gap-3 md:basis-full xl:basis-[49%]'
        data-testid={`${calenderEventTestIds.calendarEventViewItem}-${index}`}
      >
        <div className='flex gap-2'>
          <div className='h-full w-24 rounded bg-grey-4 px-3 py-2 text-secondary'>
            <Typography variant='titleMediumBold' className='pb-1 text-center'>
              {date}
            </Typography>
            <Typography
              variant='titleSmall'
              className='text-center text-secondary'
            >
              {monthName}
            </Typography>
          </div>
          <div className='max-h-full overflow-hidden'>
            <Typography variant='textSmall' className='leading-4 text-grey-56'>
              {timeInLocal.formatted}
            </Typography>
            <Typography
              variant='textMediumBold'
              className='leading-5 text-secondary'
            >
              {eventDetails?.title}
            </Typography>
          </div>
        </div>

        <EllipsisMenu
          menuItems={[
            { id: 1, name: 'Edit event', onClick: handleClickOpen },
            {
              id: 2,
              name: 'Delete event',
              onClick: () => setIsDeleteOpen(true),
            },
          ]}
          index={1}
        />
      </Box>

      {open && (
        <CreateEditEventDialog
          eventDetails={eventDetails}
          open={open}
          handleClose={handleClose}
        />
      )}

      <CustomDialog
        onSubmit={handleDeleteEvent}
        headerElement={t('events.deleteEvent')}
        onClose={() => setIsDeleteOpen(false)}
        isOpen={isDeleteOpen}
        submitText={t('common.yes')}
        disabled={isLoading}
      >
        {t('events.deleteEventConfirmation')}
      </CustomDialog>
    </>
  );
};

export default CalendarEvent;
