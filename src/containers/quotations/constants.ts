import { z } from 'zod';

import { EMAIL_REGEX } from '@/constants/common';
import {
  GenderType,
  MarginOptions,
  OrganisationType,
  PersonTypeStrict,
  TradeInToOptions,
} from '@/types/api';
import {
  asOptionalField,
  requiredWithRefine,
  requiredWithRefineForNumber,
} from '@/utils/validations';

import { OpportunityStatusType } from '../opportunities/api/type';
// TODO remove cyclic dependency
// eslint-disable-next-line import/no-cycle
import { LineGroupItemNames, QuotationVATTypeEnum } from './api/type';
// eslint-disable-next-line import/no-cycle
import { QuickQuotationFormSchema } from './types';

export enum CreateQuotationFormNames {
  FIRST_LINE_GROUP_ITEM = 'firstLineGroupItem',
  SECOND_LINE_GROUP_ITEM = 'secondLineGroupItem',
  THIRD_LINE_GROUP_ITEM = 'thirdLineGroupItem',
  FOURTH_LINE_GROUP_ITEM = 'fourthLineGroupItem',
  FIFTH_LINE_GROUP_ITEM = 'fifthLineGroupItem',
  PROPOSAL_ID = 'proposalIdentifier',
  STATUS = 'status',
  NEW_QUOTATION_DATE = 'newQuotationDate',
  NEW_QUOTATION_VALID_UNTIL = 'newQuotationValidUntil',
  VAT_TYPE = 'vatType',
  SHOW_DISCOUNT = 'showDiscount',
  DISCOUNT_AMOUNT = 'discountAmount',
  DISCOUNT_PERCENTAGE = 'discountPercentage',
  DISCOUNT_DESCRIPTION = 'discountDescription',
  TOTAL_DISCOUNT = 'totalDiscount',
  TOTAL_EXCL_VAT = 'totalExclVat',
  TOTAL_INCL_VAT = 'totalInclVat',
  VEHICLE_PRICE = 'vehiclePrice',
  UNIT_PRICE = 'unitPrice',
  DESCRIPTION = 'description',
  DRIVER = 'driver',
  BPM = 'BPM',
  VIN = 'vin',
  QUANTITY = 'quantity',
  LICENSE_PLATE = 'licensePlate',
  RESIDUAL_BPM = 'residualBPM',
  ORIGINAL_BPM = 'originalBPM',
  LICENSE_DATE = 'licenseDate',
  DELIVERY_DATE = 'deliveryDate',
  NEW_LICENSE_DATE = 'newLicenseDate',
  NEW_DELIVERY_DATE = 'newDeliveryDate',
  INTEREST_PERCENTAGE = 'annualInterestRate',
  FINANCE_TYPE = 'type',
  ORDER_ID = 'orderId',
  DURATION_IN_MONTHS = 'durationInMonths',
  YEARLY_MILEAGE = 'yearlyMileage',
  MILEAGE = 'mileage',
  TRADE_IN_VALUE = 'tradeInValue',
  VALUATION = 'valuation',
  TRADE_IN_VEHICLE = 'tradeInVehicle',
  FINAL_TERM = 'finalTerm',
  MONTHLY_EXCLUDING_VAT = 'monthlyExclVAT',
  DOWN_PAYMENT = 'downPayment',
  TOTAL_AFTER_DISCOUNT_EXCL_VAT = 'totalAfterDiscountExclVAT',
  VAT = 'vat',
  TOTAL_AFTER_DISCOUNT_INCL_VAT = 'totalAfterDiscountInclVAT',
}

export enum CreateQuotationlineItemFormFieldNames {
  PRODUCTS = 'products',
  FINANCES = 'finances',
  PURCHASES = 'purchases',
  TRADE_INS = 'tradeIns',
}

export enum QuotationGroupNameList {
  FIRST_LINE_GROUP = 'firstLineGroupItem',
  SECOND_LINE_GROUP = 'secondLineGroupItem',
  THIRD_LINE_GROUP = 'thirdLineGroupItem',
  FOURTH_LINE_GROUP = 'fourthLineGroupItem',
  FIFTH_LINE_GROUP = 'fifthLineGroupItem',
}

export const tenantGroupIdMap = [
  QuotationGroupNameList.FIRST_LINE_GROUP,
  QuotationGroupNameList.SECOND_LINE_GROUP,
  QuotationGroupNameList.THIRD_LINE_GROUP,
  QuotationGroupNameList.FOURTH_LINE_GROUP,
  QuotationGroupNameList.FIFTH_LINE_GROUP,
];

export enum FinanceLineGroupItemTypes {
  FULL_OPERATIONAL_LEASE = 'FullOperationalLease',
  PRIVATE_LEASE = 'PrivateLease',
  FINANCIAL_LEASE = 'FinancialLease',
  PRIVATE_FINANCE = 'PrivateFinance',
}

export type ILineGroupItemDesc = {
  id: string;
  groupName: string;
  groupFieldName: LineGroupItemNames;
};

export const firstLineGroupItemNameDefault: ILineGroupItemDesc = {
  id: '0',
  groupName: 'Group 1',
  groupFieldName: tenantGroupIdMap[0] as LineGroupItemNames,
};
export const secondLineGroupItemNameDefault: ILineGroupItemDesc = {
  id: '1',
  groupName: 'Group 2',
  groupFieldName: tenantGroupIdMap[1] as LineGroupItemNames,
};
export const thirdLineGroupItemNameDefault: ILineGroupItemDesc = {
  id: '2',
  groupName: 'Group 3',
  groupFieldName: tenantGroupIdMap[2] as LineGroupItemNames,
};
export const fourthLineGroupItemNameDefault: ILineGroupItemDesc = {
  id: '3',
  groupName: 'Group 4',
  groupFieldName: tenantGroupIdMap[3] as LineGroupItemNames,
};
export const fifthLineGroupItemNameDefault: ILineGroupItemDesc = {
  id: '4',
  groupName: 'Group 5',
  groupFieldName: tenantGroupIdMap[4] as LineGroupItemNames,
};

export const lineGroupItemList = [
  firstLineGroupItemNameDefault,
  secondLineGroupItemNameDefault,
  thirdLineGroupItemNameDefault,
  fourthLineGroupItemNameDefault,
  fifthLineGroupItemNameDefault,
];

export enum LineGroupItemEntityEnum {
  FINANCE = 'finance',
  PRODUCT = 'product',
  PURCHASE = 'purchase',
  TRADE_IN = 'tradeIn',
  DISCOUNT = 'discount',
}

export const TradeInToOptionsList: TradeInToOptions[] = ['Sale', 'Trade'];

export const MarginOptionsList: MarginOptions[] = [
  'VATVehicle',
  'VATMarginVehicle',
];

export enum TradeInToOptionsEnum {
  SALE = 'Sale',
  TRADE = 'Trade',
}

export enum MarginOptionsEnum {
  VAT_VEHICLE = 'VATVehicle',
  VAT_MARGIN_VEHICLE = 'VATMarginVehicle',
}

export interface IOrderLineConfigState {
  type?: LineGroupItemEntityEnum;
  isEdit?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any | null;
}

export const orderLineConfigStateInit = {
  type: undefined,
  isEdit: false,
  data: null,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const emailQuotationDialogValidation = (t: (arg: any) => string) =>
  z
    .object({
      customerEmail: z
        .string({ required_error: t('mandatoryMessage') })
        .min(1, { message: t('mandatoryMessage') })
        .regex(EMAIL_REGEX, t('enterValidName')),
      message: asOptionalField(z.string()),
    })
    .passthrough();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CreateQuotationFormValidationSchema = (t: (arg: any) => string) =>
  z
    .object({
      vatType: z.enum(
        [QuotationVATTypeEnum.EXCL_VAT, QuotationVATTypeEnum.INCL_VAT],
        { required_error: t('mandatoryMessage') }
      ),
    })
    .passthrough();

// TODO add translation

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TradeInValidation = (t: (arg: any) => string) =>
  z
    .object({
      mileage: requiredWithRefine(t, z.any()),
      colour: requiredWithRefine(t, z.any()),
      registrationDate: requiredWithRefine(t, z.any()),
      tradeInValue: requiredWithRefine(t, z.any()),
      margin: z.enum(
        [MarginOptionsEnum.VAT_MARGIN_VEHICLE, MarginOptionsEnum.VAT_VEHICLE],
        { required_error: t('mandatoryMessage') }
      ),
      tradeInTo: z.enum(
        [TradeInToOptionsEnum.SALE, TradeInToOptionsEnum.TRADE],
        { required_error: t('mandatoryMessage') }
      ),
      description: z.string({ required_error: t('mandatoryMessage') }),
    })
    .passthrough()
    .superRefine((data, ctx) => {
      // if margin is VATVehicle then residualBPM is required
      if (
        data.margin === MarginOptionsEnum.VAT_VEHICLE &&
        !(Number(data.residualBPM) >= 0)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('mandatoryMessage'),
          path: ['residualBPM'],
        });
      }
      // at least one these fields licensePlate, vin, orderId is required
      if (!data.licensePlate && !data.vin && !data.orderId) {
        ['licensePlate', 'vin', 'orderId'].forEach((field) => {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('tradeInValidationMessage'),
            path: [field],
          });
        });
      }
    });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PurchaseFormValidationSchema = (t: (arg: any) => string) =>
  z
    .object({
      description: requiredWithRefine(
        t,
        z.string({ required_error: t('mandatoryMessage') })
      ),
      vehiclePrice: requiredWithRefine(
        t,
        z.number({ required_error: t('mandatoryMessage') })
      ),
    })
    .passthrough();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ProductFormValidationSchema = (t: (arg: any) => string) =>
  z
    .object({
      name: requiredWithRefine(
        t,
        z.string({ required_error: t('mandatoryMessage') })
      ),
      quantity: requiredWithRefineForNumber(
        t,
        z.number({ required_error: t('mandatoryMessage') }).gt(0)
      ),
      unitPrice: requiredWithRefineForNumber(
        t,
        z.number({ required_error: t('mandatoryMessage') }).gte(0)
      ),
    })
    .passthrough();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const financeFormValidationSchema = (t: (arg: any) => string) =>
  z.object({
    type: requiredWithRefine(
      t,
      z.string({ required_error: t('mandatoryMessage') })
    ),
    durationInMonths: requiredWithRefineForNumber(
      t,
      z
        .number({
          invalid_type_error: t('events.valueMustBeANumber'),
          required_error: t('mandatoryMessage'),
        })
        .refine((value) => !`${value}`.includes('.'), {
          message: t('common.cannotHaveDecimal'),
        })
        .refine((value) => value >= 0, {
          message: t('events.valueMustBeGreaterThan0'),
        })
    ),
    finalTerm: requiredWithRefineForNumber(
      t,
      z.number({
        invalid_type_error: t('events.valueMustBeANumber'),
        required_error: t('mandatoryMessage'),
      })
    ),
    annualInterestRate: requiredWithRefineForNumber(
      t,
      z
        .number({
          invalid_type_error: t('events.valueMustBeANumber'),
          required_error: t('mandatoryMessage'),
        })
        .refine((value) => value >= 0, {
          message: t('events.valueMustBeGreaterThan0and100'),
        })
    ),
    downPayment: requiredWithRefineForNumber(
      t,
      z.number({
        invalid_type_error: t('events.valueMustBeANumber'),
        required_error: t('mandatoryMessage'),
      })
    ),
    monthlyExclVAT: requiredWithRefineForNumber(t, z.number()),
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DiscountFormValidationSchema = (t: (arg: any) => string) =>
  z
    .object({})
    .passthrough()
    .superRefine((data, ctx) => {
      // at least one these fields amount, percentage is required
      if (!data.amount && !data.percentage) {
        ['amount', 'percentage'].forEach((field) => {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('discountValidationMessage'),
            path: [field],
          });
        });
      }

      if (!data.description) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('mandatoryMessage'),
          path: ['description'],
        });
      }
    });

export const VAT_PERCENTAGE = 21;

export const organisationResetValue = {
  name: '',
  type: 'Dealer' as OrganisationType,
  emails: [
    {
      isPrimary: false,
    },
  ],
};

export const personDetailsResetValue = {
  lastName: '',
  gender: 'Male' as GenderType,
  type: 'Business' as PersonTypeStrict,
  isActive: false,
  emails: [
    {
      isPrimary: false,
    },
  ],
};

export const opportunityDetailsResetValue = {
  id: '',
  name: '',
  status: 'Interest' as OpportunityStatusType,
  type: 'Business' as PersonTypeStrict,
  salespersons: [personDetailsResetValue],
  dealer: { id: '' },
};

export const QuickQuotationStateNames: {
  [K in keyof QuickQuotationFormSchema]: K;
} = {
  personId: 'personId',
  opportunityDetails: 'opportunityDetails',
  editOpportunityDetails: 'editOpportunityDetails',
  organisationDetails: 'organisationDetails',
  personDetails: 'personDetails',
  flow: 'flow',
  personType: 'personType',
  isLoading: 'isLoading',
  organisationId: 'organisationId',
};

export const purchaseLineItemUInit = {
  name: '',
  index: -1,
  quantity: 0,
  totalExclVat: 0,
  type: LineGroupItemEntityEnum.PURCHASE,
};
