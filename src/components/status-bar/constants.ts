import { STAGE_STATUSES, STATUS_BAR_TYPES, StatusBarConfigType } from './types';

export const OPPORTUNITY_STATUS_BAR_CONFIG: StatusBarConfigType<STATUS_BAR_TYPES.OPPORTUNITY> =
  {
    Interest: {
      stages: [
        { label: 'Interest', status: STAGE_STATUSES.ACTIVE },
        { label: 'Quotation', status: STAGE_STATUSES.INACTIVE },
        { label: 'CustomerDecision', status: STAGE_STATUSES.INACTIVE },
        { label: 'Agreement', status: STAGE_STATUSES.INACTIVE },
        { label: 'Closed', status: STAGE_STATUSES.INACTIVE },
      ],
    },
    Quotation: {
      stages: [
        { label: 'Interest', status: STAGE_STATUSES.SUCCESS },
        { label: 'Quotation', status: STAGE_STATUSES.ACTIVE },
        { label: 'CustomerDecision', status: STAGE_STATUSES.INACTIVE },
        { label: 'Agreement', status: STAGE_STATUSES.INACTIVE },
        { label: 'Closed', status: STAGE_STATUSES.INACTIVE },
      ],
    },
    CustomerDecision: {
      stages: [
        { label: 'Interest', status: STAGE_STATUSES.SUCCESS },
        { label: 'Quotation', status: STAGE_STATUSES.SUCCESS },
        { label: 'CustomerDecision', status: STAGE_STATUSES.ACTIVE },
        { label: 'Agreement', status: STAGE_STATUSES.INACTIVE },
        { label: 'Closed', status: STAGE_STATUSES.INACTIVE },
      ],
    },
    Agreement: {
      stages: [
        { label: 'Interest', status: STAGE_STATUSES.SUCCESS },
        { label: 'Quotation', status: STAGE_STATUSES.SUCCESS },
        { label: 'CustomerAccepted', status: STAGE_STATUSES.SUCCESS },
        { label: 'Agreement', status: STAGE_STATUSES.ACTIVE },
        { label: 'Closed', status: STAGE_STATUSES.INACTIVE },
      ],
    },
    ClosedWon: {
      stages: [
        { label: 'Interest', status: STAGE_STATUSES.SUCCESS },
        { label: 'Quotation', status: STAGE_STATUSES.SUCCESS },
        { label: 'CustomerAccepted', status: STAGE_STATUSES.SUCCESS },
        { label: 'Agreement', status: STAGE_STATUSES.SUCCESS },
        { label: 'ClosedWon', status: STAGE_STATUSES.SUCCESS },
      ],
    },
    ClosedLost: {
      stages: [
        { label: 'Interest', status: STAGE_STATUSES.SUCCESS },
        { label: 'Quotation', status: STAGE_STATUSES.SUCCESS },
        { label: 'CustomerRejected', status: STAGE_STATUSES.FAILURE },
        { label: 'ClosedLost', status: STAGE_STATUSES.FAILURE },
      ],
    },
  };

export const DELIVERY_STATUS_BAR_CONFIG: StatusBarConfigType<STATUS_BAR_TYPES.DELIVERY> =
  {
    RequestOrder: {
      stages: [
        { label: 'RequestOrder', status: STAGE_STATUSES.ACTIVE },
        { label: 'OrderVehicle', status: STAGE_STATUSES.INACTIVE },
        { label: 'AwaitArrival', status: STAGE_STATUSES.INACTIVE },
        { label: 'PrepareDelivery', status: STAGE_STATUSES.INACTIVE },
        { label: 'Delivered', status: STAGE_STATUSES.INACTIVE },
      ],
    },
    OrderRejected: {
      stages: [
        { label: 'OrderRejected', status: STAGE_STATUSES.FAILURE },
        { label: 'Rejected', status: STAGE_STATUSES.FAILURE },
      ],
    },
    OrderVehicle: {
      stages: [
        { label: 'OrderApproved', status: STAGE_STATUSES.SUCCESS },
        { label: 'OrderVehicle', status: STAGE_STATUSES.ACTIVE },
        { label: 'AwaitArrival', status: STAGE_STATUSES.INACTIVE },
        { label: 'PrepareDelivery', status: STAGE_STATUSES.INACTIVE },
        { label: 'Delivered', status: STAGE_STATUSES.INACTIVE },
      ],
    },
    AwaitArrival: {
      stages: [
        { label: 'OrderApproved', status: STAGE_STATUSES.SUCCESS },
        { label: 'OrderVehicle', status: STAGE_STATUSES.SUCCESS },
        { label: 'AwaitArrival', status: STAGE_STATUSES.ACTIVE },
        { label: 'PrepareDelivery', status: STAGE_STATUSES.INACTIVE },
        { label: 'Delivered', status: STAGE_STATUSES.INACTIVE },
      ],
    },
    PrepareDelivery: {
      stages: [
        { label: 'OrderApproved', status: STAGE_STATUSES.SUCCESS },
        { label: 'OrderVehicle', status: STAGE_STATUSES.SUCCESS },
        { label: 'AwaitArrival', status: STAGE_STATUSES.SUCCESS },
        { label: 'PrepareDelivery', status: STAGE_STATUSES.ACTIVE },
        { label: 'Delivered', status: STAGE_STATUSES.INACTIVE },
      ],
    },
    Delivered: {
      stages: [
        { label: 'OrderApproved', status: STAGE_STATUSES.SUCCESS },
        { label: 'OrderVehicle', status: STAGE_STATUSES.SUCCESS },
        { label: 'AwaitArrival', status: STAGE_STATUSES.SUCCESS },
        { label: 'PrepareDelivery', status: STAGE_STATUSES.SUCCESS },
        { label: 'Delivered', status: STAGE_STATUSES.SUCCESS },
      ],
    },
  };

export const statusColors = {
  [STAGE_STATUSES.INACTIVE]: '#DEE0E2',
  [STAGE_STATUSES.ACTIVE]: '#323C49',
  [STAGE_STATUSES.SUCCESS]: '#6E9C6D',
  [STAGE_STATUSES.FAILURE]: '#DA212C',
};

// Utility function to get config based on type and status
export const getConfig = <T extends STATUS_BAR_TYPES>(
  type: T
): StatusBarConfigType<T> =>
  type === STATUS_BAR_TYPES.OPPORTUNITY
    ? OPPORTUNITY_STATUS_BAR_CONFIG
    : DELIVERY_STATUS_BAR_CONFIG;
