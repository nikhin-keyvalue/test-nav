import { components, paths } from '@generated/crm-service-types';
import { Dayjs } from 'dayjs';

export type CreateEventRequest =
  paths['/opportunities/{opportunityId}/calendar-events']['post']['requestBody']['content']['application/json'];

export type CreateEventResponse =
  paths['/opportunities/{opportunityId}/calendar-events']['post']['responses']['200']['content']['application/json'];

export type CreateFormType = CreateEventRequest & {
  date: Dayjs | null;
  newStartDateTime?: Dayjs | null;
  newEndDateTime?: Dayjs | null;
  dateValidation: string | null;
};

export type EventType = components['schemas']['Event']['calendarEventType'];

export type EventItem = components['schemas']['Event'];
