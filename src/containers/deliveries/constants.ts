import { z } from 'zod';

import { asOptionalField, requiredWithRefine } from '@/utils/validations';

import { DeliveryStatusEnum } from './api/constants';
import { DeliveryStatus } from './api/type';

export const DeliveryStatusList: DeliveryStatus[] = [
  DeliveryStatusEnum.REQUEST_ORDER,
  DeliveryStatusEnum.ORDER_REJECTED,
  DeliveryStatusEnum.ORDER_VEHICLE,
  DeliveryStatusEnum.AWAIT_ARRIVAL,
  DeliveryStatusEnum.PREPARE_DELIVERY,
  DeliveryStatusEnum.DELIVERED,
];

export enum PayoutAfterEnum {
  CUSTOMER_DELIVERY = 'CustomerDelivery',
  FISRT_REGISTRATION = 'FirstRegistration',
  PURCHASE = 'Purchase',
  DELIVERY_AT_DEALER = 'DeliveryAtDealer',
  SOLD_TO_CUSTOMER = 'SoldToCustomer',
}

export const PayoutAfterOptionList = [
  PayoutAfterEnum.CUSTOMER_DELIVERY,
  PayoutAfterEnum.DELIVERY_AT_DEALER,
  PayoutAfterEnum.FISRT_REGISTRATION,
  PayoutAfterEnum.PURCHASE,
  PayoutAfterEnum.SOLD_TO_CUSTOMER,
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BonusValidation = (t: (arg: any) => string) =>
  z
    .object({
      title: z.string({ required_error: t('mandatoryMessage') }),
      bonusMonth: requiredWithRefine(
        t,
        z.any({ required_error: t('mandatoryMessage') })
      ),
      payoutAfter: z.enum(
        [
          PayoutAfterEnum.CUSTOMER_DELIVERY,
          PayoutAfterEnum.DELIVERY_AT_DEALER,
          PayoutAfterEnum.FISRT_REGISTRATION,
          PayoutAfterEnum.PURCHASE,
          PayoutAfterEnum.SOLD_TO_CUSTOMER,
        ],
        { required_error: t('mandatoryMessage') }
      ),
      bonusPercentage: asOptionalField(
        z.union([z.number().min(1).max(99), z.nan()])
      ),
      bonusAmount: asOptionalField(z.union([z.number().min(1), z.nan()])),
    })
    .passthrough();

export enum BonusStatusEnum {
  RECEIVED = 'Received',
  EXPECTED = 'Expected',
  OVERDUE = 'Overdue',
}

type DeliveryActionsConfigType = {
  [K in DeliveryStatus]: {
    ctaLabel?: string;
    ctaTargetStatus?: DeliveryStatus;
  };
};

export const DeliveryActionsConfig: DeliveryActionsConfigType = {
  RequestOrder: {
    ctaLabel: 'RequestOrderCta',
    ctaTargetStatus: 'OrderVehicle',
  },
  OrderVehicle: {
    ctaLabel: 'OrderVehicleCta',
    ctaTargetStatus: 'AwaitArrival',
  },
  AwaitArrival: {
    ctaLabel: 'AwaitArrivalCta',
    ctaTargetStatus: 'PrepareDelivery',
  },
  PrepareDelivery: {
    ctaLabel: 'PrepareDeliveryCta',
    ctaTargetStatus: 'Delivered',
  },
  Delivered: {},
  OrderRejected: {},
};
