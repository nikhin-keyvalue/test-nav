import { z } from 'zod';

import { ALPHA_NUMERIC_WITH_HYPHEN_REGEX } from '@/constants/common';

export enum DeliveryStatusEnum {
  REQUEST_ORDER = 'RequestOrder',
  ORDER_VEHICLE = 'OrderVehicle',
  AWAIT_ARRIVAL = 'AwaitArrival',
  PREPARE_DELIVERY = 'PrepareDelivery',
  DELIVERED = 'Delivered',
  ORDER_REJECTED = 'OrderRejected',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createDeliveryValidation = (t: (arg: any) => string) =>
  z
    .object({
      name: z
        .string({ required_error: t('mandatoryMessage') })
        .min(1, t('mandatoryMessage')),
    })
    .passthrough();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DeliveryEditValidationSchema = (t: (arg: any) => string) =>
  z
    .object({
      name: z
        .string({ required_error: t('mandatoryMessage') })
        .min(1, t('mandatoryMessage'))
        .regex(ALPHA_NUMERIC_WITH_HYPHEN_REGEX, t('enterValidName')),
      status: z.enum(
        [
          'RequestOrder',
          'OrderVehicle',
          'AwaitArrival',
          'PrepareDelivery',
          'Delivered',
          'OrderRejected',
        ],
        {
          required_error: t('mandatoryMessage'),
        }
      ),
    })
    .passthrough();
