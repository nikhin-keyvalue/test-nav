import { DeliveryStatus } from '@/containers/deliveries/api/type';
import { OpportunityStatusType } from '@/containers/opportunities/api/type';

export enum STATUS_BAR_TYPES {
  'OPPORTUNITY',
  'DELIVERY',
}

export const enum STAGE_STATUSES {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

export type StatusBarLabelType = "Interest" |
"Quotation" |
"CustomerDecision" |
"Agreement" |
"Closed" |
"CustomerAccepted" |
"CustomerRejected" |
"ClosedLost" |
"ClosedWon" |
"RequestOrder" |
"OrderVehicle" |
"AwaitArrival" |
"PrepareDelivery" |
"Delivered" |
"Rejected" |
"OrderApproved" |
"OrderRejected";

export type StatusItemType = {
  label: StatusBarLabelType;
  status: STAGE_STATUSES;
};

export type StatusBarStageType = {
  stages: StatusItemType[];
};

export type StatusBarConfigType<T extends STATUS_BAR_TYPES> = {
  [Key in T extends STATUS_BAR_TYPES.OPPORTUNITY
    ? OpportunityStatusType
    : DeliveryStatus]?: StatusBarStageType;
};

export type StatusBarPropType<T> = {
  type: T;
  status: T extends STATUS_BAR_TYPES.DELIVERY
    ? DeliveryStatus
    : OpportunityStatusType;
};
