import { z } from 'zod';

import { isValidEmailAddress } from '@/constants/common';
import { asOptionalField, requiredWithRefine } from '@/utils/validations';

export enum EVENT_TYPE {
  TEST_DRIVE = 'TestDrive',
  PHONE_CALL = 'PhoneCall',
  ONLINE_MEETING = 'OnlineMeeting',
  SHOWROOM_APPOINTMENT = 'ShowroomAppointment',
}

export const eventTypesList = [
  EVENT_TYPE.TEST_DRIVE,
  EVENT_TYPE.PHONE_CALL,
  EVENT_TYPE.ONLINE_MEETING,
  EVENT_TYPE.SHOWROOM_APPOINTMENT,
];

export const defaultEventTitles = {
  [EVENT_TYPE.TEST_DRIVE]: 'Uw uitnodiging voor een proefrit',
  [EVENT_TYPE.PHONE_CALL]: 'Uw uitnodiging voor een telefoongesprek',
  [EVENT_TYPE.ONLINE_MEETING]: 'Uw uitnodiging voor een online vergadering',
  [EVENT_TYPE.SHOWROOM_APPOINTMENT]:
    'Uw uitnodiging voor een afspraak in onze showroom',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EventFormSchema = (t: (arg: any) => string) => ({
  calendarEventType: z.enum(
    [
      EVENT_TYPE.TEST_DRIVE,
      EVENT_TYPE.PHONE_CALL,
      EVENT_TYPE.ONLINE_MEETING,
      EVENT_TYPE.SHOWROOM_APPOINTMENT,
    ],
    { required_error: t('mandatoryMessage') }
  ),
  startDateTime: z.any(),
  endDateTime: z.any(),
  date: requiredWithRefine(t, z.any()),
  newStartDateTime: requiredWithRefine(t, z.any()),
  newEndDateTime: requiredWithRefine(t, z.any()),
  title: z.string({ required_error: t('mandatoryMessage') }),
  customerEmail: asOptionalField(z.string()),
  message: asOptionalField(z.string()),
  sendEmail: z.boolean(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const schema = (t: (arg: any) => string) => z.object(EventFormSchema(t));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CreateEventSchema = (t: (arg: any) => string) =>
  schema(t).superRefine((data, ctx) => {
    const { newStartDateTime, newEndDateTime, sendEmail, customerEmail } = data;
    if (
      !(
        !newStartDateTime ||
        !newEndDateTime ||
        newStartDateTime < newEndDateTime
      )
    )
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['dateValidation'],
        message: t('dateStartLessThanEnd'),
      });
    if (sendEmail && !customerEmail)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('mandatoryMessage'),
        path: ['customerEmail'],
      });
    if (customerEmail) {
      if (!isValidEmailAddress(customerEmail))
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('enterValidEmail'),
          path: ['customerEmail'],
        });
    }
  });
