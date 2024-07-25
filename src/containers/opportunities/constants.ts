import { z } from 'zod';

import { ALPHA_NUMERIC_WITH_HYPHEN_REGEX } from '@/constants/common';
import { PERSON_TYPES } from '@/constants/filter';
import { asOptionalField, requiredWithRefine } from '@/utils/validations';

import { OpportunityStatusType } from './api/type';

export const OpportunityStatusList: OpportunityStatusType[] = [
  'Interest',
  'Quotation',
  'CustomerDecision',
  'Agreement',
  'ClosedWon',
  'ClosedLost',
];

export enum OpportunityStatusEnum {
  Interest = 'Interest',
  Quotation = 'Quotation',
  CustomerDecision = 'Customer decision',
  Agreement = 'Agreement',
  ClosedWon = 'Closed won',
  ClosedLost = 'Closed lost',
}

export enum OPPORTUNITY_STATUS {
  INTEREST = 'Interest',
  QUOTATION = 'Quotation',
  CUSTOMERDECISION = 'CustomerDecision',
  AGREEMENT = 'Agreement',
  CLOSEDLOST = 'ClosedLost',
  CLOSEDWON = 'ClosedWon',
}

export const CreateEditOpportunityValidation = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (arg: any) => string
) =>
  z
    .object({
      name: requiredWithRefine(
        t,
        z.string().regex(ALPHA_NUMERIC_WITH_HYPHEN_REGEX, t('enterValidName'))
      ),
      status: z.enum(
        [
          OPPORTUNITY_STATUS.INTEREST,
          OPPORTUNITY_STATUS.QUOTATION,
          OPPORTUNITY_STATUS.CUSTOMERDECISION,
          OPPORTUNITY_STATUS.AGREEMENT,
          OPPORTUNITY_STATUS.CLOSEDLOST,
          OPPORTUNITY_STATUS.CLOSEDWON,
        ],
        {
          required_error: t('mandatoryMessage'),
        }
      ),
      type: z
        .enum([PERSON_TYPES.BUSINESS, PERSON_TYPES.PRIVATE], {
          required_error: t('mandatoryMessage'),
        })
        .optional(),
      organisation: asOptionalField(
        z.object({
          id: z.string(),
          name: z.string(),
        })
      ),
      leasingCompany: asOptionalField(
        z.object({
          id: z.string(),
          name: z.string(),
        })
      ),
      dealer: z
        .object(
          {
            dealerId: z.string(),
            dealerName: z.string(),
          },
          {
            required_error: t('mandatoryMessage'),
            invalid_type_error: t('mandatoryMessage'),
          }
        )
        .passthrough(),
      salespersons: z
        .array(
          z.object({
            firstName: asOptionalField(z.string()),
            lastName: asOptionalField(z.string()),
            email: z.string(),
            loginId: z.string(),
            salespersonId: z.string(),
          })
        )
        .min(1, t('mandatoryMessage')),

      additionalComments: asOptionalField(z.string()),
      newCloseDate: requiredWithRefine(
        t,
        z.any({ required_error: t('mandatoryMessage') })
      ),
      customer: z.object(
        {
          id: z.string(),
          firstName: z.string().nullable(),
          lastName: z.string(),
        },
        {
          required_error: t('mandatoryMessage'),
          invalid_type_error: t('mandatoryMessage'),
        }
      ),
    })
    .passthrough()
    .refine(
      (data) => {
        const { type, organisation } = data;
        // Check if type is BUSINESS, and if so, ensure organisation is provided
        return !(type === PERSON_TYPES.BUSINESS && !organisation?.id);
      },
      {
        path: ['businessCustomerValidation'],
        message: t('organisationRequired'),
      }
    );

export type OpportunityStatusEnumKeys = keyof typeof OpportunityStatusEnum;
export type OpportunityStatusKeys = keyof typeof OpportunityStatusList;

export const status: OpportunityStatusType[] = [
  'Interest',
  'Quotation',
  'CustomerDecision',
  'Agreement',
  'ClosedWon',
  'ClosedLost',
];

export const createOpportunityStatuses: OpportunityStatusType[] = [
  'Interest',
  'Quotation',
  'CustomerDecision',
  'Agreement',
];

export enum Categories {
  INTERNAL = 'Internal',
  EXTERNAL = 'External',
}

export const DefaultESignResponse = {
  dealerId: 1213,
  dealerName: '',
  eSignService: 'NONE',
};
