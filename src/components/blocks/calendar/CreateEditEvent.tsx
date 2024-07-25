'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox, FormControlLabel, Grid, MenuItem } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import {
  DatePickerWithController,
  SelectWithController,
  TimePickerWithController,
} from '@/components';
import Dialog from '@/components/Dialog';
import TextFieldWithController from '@/components/TextFieldWithController';
import { useTranslations } from '@/hooks/translation';
import { EmailType } from '@/types/api';
import {
  combineDateAndTime,
  formatDateTimeRange,
  getDateinDayjs,
} from '@/utils/date';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

import { calenderEventTestIds } from '../../../../tests/e2e/constants/testIds';
import { createEvent, editEvent } from './api';
import {
  CreateEventSchema,
  defaultEventTitles,
  eventTypesList,
} from './constants';
import { CreateFormType, EventItem, EventType } from './types';

interface ICreateEditEventDialogProps {
  open: boolean;
  handleClose: () => void;
  eventDetails?: EventItem;
  defaultEmail?: EmailType;
}

const CreateEditEventDialog = ({
  open,
  handleClose,
  eventDetails,
  defaultEmail,
}: ICreateEditEventDialogProps) => {
  const { id: opportunityId } = useParams();
  const t = useTranslations();
  const validationTranslation = useTranslations('validationMessage');

  const timeInLocal = formatDateTimeRange(
    eventDetails?.startDateTime,
    eventDetails?.endDateTime
  );
  const defaultEmailId = (defaultEmail && defaultEmail.email) || '';
  const formMethods = useForm<CreateFormType>({
    defaultValues: {
      ...eventDetails,
      date: eventDetails?.startDateTime
        ? timeInLocal.start
        : getDateinDayjs(Date()),
      customerEmail: eventDetails?.customerEmail ?? defaultEmailId,
      newStartDateTime: eventDetails?.startDateTime ? timeInLocal.start : null,
      newEndDateTime: eventDetails?.endDateTime ? timeInLocal.end : null,
      sendEmail: eventDetails?.sendEmail ?? true,
    },
    resolver: zodResolver(CreateEventSchema(validationTranslation)),
  });

  const {
    control,
    watch,
    handleSubmit,
    getValues,
    setValue,
    reset,
    register,
    formState: { isSubmitting, errors, dirtyFields },
  } = formMethods;

  const startTimeWatcher = watch('newStartDateTime');

  const eventType = watch('calendarEventType');

  useEffect(() => {
    if (!dirtyFields.title && !eventDetails?.id)
      setValue('title', defaultEventTitles[eventType]);
  }, [eventType]);

  useEffect(() => {
    if (startTimeWatcher) {
      const startTimePlusOneHour = startTimeWatcher?.add(1, 'hour');
      setValue('newEndDateTime', startTimePlusOneHour);
    }
  }, [startTimeWatcher]);

  const handleCreateEvent = async (formData: CreateFormType) => {
    const res = await createEvent({
      ...formData,
      opportunityId: opportunityId as string,
    });

    if (res?.id) {
      showSuccessToast(t('common.savedSuccessfully'));
      reset();

      handleClose();
    } else {
      showErrorToast(t('common.somethingWentWrong'));
    }
  };

  const handleEditEvent = async (
    formData: CreateFormType & { eventId?: string; opportunityId: string }
  ) => {
    const res = await editEvent(formData);

    if (res?.id) {
      showSuccessToast(t('common.savedSuccessfully'));
      reset();
      handleClose();
    } else {
      showErrorToast(t('common.somethingWentWrong'));
    }
  };

  const handleAddClick = async () => {
    await handleSubmit(async (formData) => {
      const startDateTime = combineDateAndTime(
        formData.date!,
        formData.newStartDateTime!
      ) as unknown as string;

      const endDateTime = combineDateAndTime(
        formData.date!,
        formData.newEndDateTime!
      ) as unknown as string;

      const formattedFormData = {
        ...formData,
        startDateTime,
        endDateTime,
        opportunityId: opportunityId as string,
        eventId: eventDetails?.id,
      };

      if (eventDetails?.id) await handleEditEvent(formattedFormData);
      else await handleCreateEvent(formattedFormData);
    })();
  };

  return (
    <Dialog
      headerElement={
        eventDetails?.id ? t('events.editEvent') : t('events.addEvent')
      }
      onClose={handleClose}
      onSubmit={handleAddClick}
      isOpen={open}
      submitText={eventDetails?.id ? t('common.saveAndClose') : t('common.add')}
      disabled={isSubmitting}
      isLoading={isSubmitting}
      testId={calenderEventTestIds.calenderDialog}
    >
      <FormProvider {...formMethods}>
        <div>
          <DialogContent>
            <Grid container gap={2}>
              <Grid
                item
                width='100%'
                gap={2}
                display='flex'
                justifyContent='space-around'
              >
                <SelectWithController
                  testId={calenderEventTestIds.eventType}
                  name='calendarEventType'
                  label={t('events.eventType')}
                  control={control}
                  options={eventTypesList}
                  renderOption={(option) => (
                    <MenuItem key={option} value={option}>
                      {t(`events.${option as EventType}`)}
                    </MenuItem>
                  )}
                  required
                />
                <DatePickerWithController
                  testId={calenderEventTestIds.date}
                  name='date'
                  control={control}
                  sx={{ width: '100%' }}
                  format='DD/MM/YYYY'
                  label={t('events.date')}
                  defaultValue={getDateinDayjs(getValues('startDateTime'))}
                  required
                />
              </Grid>

              <Grid
                item
                display='flex'
                width='100%'
                gap={2}
                justifyContent='space-around'
              >
                <TimePickerWithController
                  testId={calenderEventTestIds.startTime}
                  control={control}
                  name='newStartDateTime'
                  label={t('events.startTime')}
                  required
                />
                <TimePickerWithController
                  testId={calenderEventTestIds.endTime}
                  name='newEndDateTime'
                  control={control}
                  label={t('events.endTime')}
                  required
                />
              </Grid>
              <Typography variant='textSmall' className='pl-1 text-primary'>
                {errors.dateValidation?.message}
              </Typography>

              <TextFieldWithController
                control={control}
                name='title'
                testId={calenderEventTestIds.title}
                label={t('events.eventTitle')}
                required
              />

              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked={watch('sendEmail')}
                    className='ml-[9px] !text-secondary'
                  />
                }
                {...register('sendEmail')}
                label={t('events.emailInvitation')}
              />
              <TextFieldWithController
                control={control}
                testId={calenderEventTestIds.email}
                name='customerEmail'
                label={t('events.email')}
                required={watch('sendEmail')}
              />

              <TextFieldWithController
                multiline
                control={control}
                name='message'
                label={t('events.optionalEmailMessage')}
                rows={6}
                sx={{
                  input: { height: '160px' },
                }}
              />
            </Grid>
          </DialogContent>
        </div>
      </FormProvider>
    </Dialog>
  );
};

export default CreateEditEventDialog;
