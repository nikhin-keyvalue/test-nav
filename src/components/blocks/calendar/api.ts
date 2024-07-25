'use server';

import { revalidatePath } from 'next/cache';

import { crmServiceFetcher } from '@/utils/api';
import {
  getTraceId,
  replaceUndefinedAndEmptyStringsWithNull,
} from '@/utils/common';

import { CreateEventRequest, CreateEventResponse } from './types';

export const createEvent = async (
  eventData: CreateEventRequest & { opportunityId: string }
) => {
  try {
    const data: CreateEventResponse = await crmServiceFetcher(
      `opportunities/${eventData.opportunityId}/calendar-events`,
      {
        method: 'POST',
        body: JSON.stringify(
          replaceUndefinedAndEmptyStringsWithNull(eventData)
        ),
      }
    );
    if (data) {
      revalidatePath(`/opportunities/${eventData.opportunityId}/details`);
      return { id: data?.id };
    }
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('createEventFunction')
    );
    return null;
  }

  return null;
};

export const editEvent = async (
  eventData: CreateEventRequest & { eventId?: string; opportunityId: string }
) => {
  try {
    const data: CreateEventResponse = await crmServiceFetcher(
      `opportunities/${eventData.opportunityId}/calendar-events/${eventData.eventId}`,
      {
        method: 'PUT',
        cache: 'no-store',
        body: JSON.stringify(
          replaceUndefinedAndEmptyStringsWithNull(eventData)
        ),
      }
    );
    if (data) {
      revalidatePath(`/opportunities/${eventData.opportunityId}/details`);
      return { id: data?.id };
    }
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('editEventFunction')
    );
    return null;
  }

  return null;
};

export const deleteEvent = async (eventId: string, opportunityId: string) => {
  try {
    const response: Response = await crmServiceFetcher(
      `opportunities/${opportunityId}/calendar-events/${eventId}`,
      {
        method: 'DELETE',
      },
      { format: false, throwError: true }
    );
    if (response) {
      revalidatePath(`/opportunities/${opportunityId}/details`);
      return { statusCode: response.status };
    }
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('deleteEventFunction')
    );
    return null;
  }

  return null;
};
