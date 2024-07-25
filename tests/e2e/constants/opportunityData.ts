import { EVENT_TYPE } from '@/components/blocks/calendar/constants';

import { OpportunityInputDataProps } from '../utils/opportunities/opportunitiesFormHelpers';

export const createOpportunityData: OpportunityInputDataProps = {
  name: 'create opportunity for Quotation e2e test',
  status: 'Interest',
  additionalComments:
    'additional comments: Creating opportunity for Quotation e2e test',
};

export const createOpportunityEventData = {
  calendarEventType: EVENT_TYPE.TEST_DRIVE,
  title: 'Event title for E2E test',
  editedTitle: 'Event title for E2E test edited',
  sendEmail: true,
};

export const calendarEventTypes: Record<EVENT_TYPE, string> = {
  [EVENT_TYPE.TEST_DRIVE]: 'Test Drive',
  [EVENT_TYPE.PHONE_CALL]: 'Phone Call',
  [EVENT_TYPE.ONLINE_MEETING]: 'Online Meeting',
  [EVENT_TYPE.SHOWROOM_APPOINTMENT]: 'Showroom Appointment',
};
