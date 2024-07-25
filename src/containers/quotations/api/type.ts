import { components } from '@generated/crm-service-types';
import { paths as imgPaths } from '@generated/image-service-types';
import { Dayjs } from 'dayjs';
import { UseFormReturn } from 'react-hook-form';

import { OpportunityDetails as OpportunityDetailsType } from '@/types/api';
import { QuickQuotationSearchParams, SearchParams } from '@/types/common';

// TODO remove cyclic dependency
// eslint-disable-next-line import/no-cycle
import {
  CreateQuotationFormNames,
  LineGroupItemEntityEnum,
  QuotationGroupNameList,
} from '../constants';

export type QuotationResponse = components['schemas']['Quotation'];

export type ShareQuotationReq = components['schemas']['QuotationShareRequest'];
export type EmailQuotationReq = components['schemas']['QuotationEmailRequest'];

export type QuotationStatus = components['schemas']['QuotationStatus'];

export enum eSignMethodEnum {
  'NONE' = 'NONE',
  'SCRIVE' = 'SCRIVE',
}

export enum QuotationStatusEnum {
  CONCEPT = 'Concept',
  SHARED_QUOTATION = 'SharedQuotation',
  PRELIMINARY_AGREEMENT = 'PreliminaryAgreement',
  AGREEMENT_SIGNED = 'AgreementSigned',
  REJECTED = 'Rejected',
}

export interface OpportunityDetailsSectionProps {
  opportunityDetails: OpportunityDetailsType | null;
}

export interface QuotationPageProps extends SearchParams {
  opportunityId: string;
  vehicleId?: string;
}

export type QuotationVATType = components['schemas']['VATType'];

export type LINE_GROUP_ITEMS_KEYS = {
  finances: string;
  products: string;
  tradeIns: string;
  purchases: string;
};

export type ILineGroupItem = components['schemas']['LineGroupItem'];
export type financeTypes = components['schemas']['FinanceType'];
export type QuotationCreateResponse = components['schemas']['Quotation'];

export interface FinanceDataItem {
  financeType: financeTypes;
  duration: string;
  yearlyMileage: string;
  finalTerm: string;
  tradeInVehicleAmount: string;
  monthlyVAT: string;
}

export interface PurchaseVehicle {
  name: string;
  brandModalDescription: string;
  vehiclePrice: string;
  diverName: string;
  bpm: string;
  vatType: string;
  licenseDate: string;
  deliveryDate: string;
}

export enum QuotationVATTypeEnum {
  EXCL_VAT = 'ExclVAT',
  INCL_VAT = 'InclVAT',
}

export type ImageUploadResponse =
  imgPaths['/opportunities/{opportunityId}/images']['post']['responses']['202']['content']['application/json'];
export interface ImageFile extends ImageUploadResponse {
  fileName: string;
  fileSize: number;
}
export type TradeInImageResponse =
  imgPaths['/quotations/{quotationId}/trade-in-vehicles/{vehicleId}/images']['get']['responses']['200']['content']['application/json'];

export type lineItemGroupObject = {
  [key: string]: ILineGroupItem;
};

export type LineGroupItemsRequestPayload =
  components['schemas']['QuotationCreateRequest']['lineGroupItems'];
export type LineGroupItemsQuotationUpdateRequest =
  components['schemas']['QuotationUpdateRequest']['lineGroupItems'];

export type VATTypes = components['schemas']['VATType'];
export type LineGroupItemRequest =
  components['schemas']['LineGroupItemRequest'];
export type QuotationCreateRequest =
  components['schemas']['QuotationCreateRequest'];

export type Quotation = components['schemas']['Quotation'];

export type QuotationUpdateRequest =
  components['schemas']['QuotationUpdateRequest'];

export type LineGroupItemProduct = components['schemas']['Product'];
export type LineGroupItemPurchase = components['schemas']['Purchase'];
export type LineGroupItemFinance = components['schemas']['Finance'];
export type LineGroupItemTradeIn = components['schemas']['TradeIn'];
export type LineGroupItemPurchaseExtra = {
  [CreateQuotationFormNames.NEW_LICENSE_DATE]?: Dayjs | null;
  [CreateQuotationFormNames.NEW_DELIVERY_DATE]?: Dayjs | null;
  id?: string;
  index: number;
};
export type DiscountRequest = components['schemas']['Discount'];
export type LineGroupItemNames =
  | QuotationGroupNameList.FIRST_LINE_GROUP
  | QuotationGroupNameList.SECOND_LINE_GROUP
  | QuotationGroupNameList.THIRD_LINE_GROUP
  | QuotationGroupNameList.FOURTH_LINE_GROUP
  | QuotationGroupNameList.FIFTH_LINE_GROUP;

export type DiscountConfigType = {
  isEdit: boolean;
  discount: DiscountRequest;
  type?: LineGroupItemEntityEnum;
};

export type LineGroupItemHavingDiscount =
  | LineGroupItemEntityEnum.PRODUCT
  | LineGroupItemEntityEnum.PURCHASE
  | null;

export type QuotationStatusType =
  | QuotationStatusEnum.CONCEPT
  | QuotationStatusEnum.AGREEMENT_SIGNED
  | QuotationStatusEnum.PRELIMINARY_AGREEMENT
  | QuotationStatusEnum.REJECTED
  | QuotationStatusEnum.SHARED_QUOTATION;

export type CreateQuotationFormSchema = {
  proposalIdentifier: string;
  vatType: QuotationVATType;
  status: QuotationStatus;
  quotationDate?: string | Dayjs;
  quotationValidUntil?: string | Dayjs;
  newQuotationDate?: Dayjs | string | null;
  newQuotationValidUntil?: Dayjs | string | null;
  firstLineGroupItem: LineGroupItemRequest;
  secondLineGroupItem: LineGroupItemRequest;
  thirdLineGroupItem: LineGroupItemRequest;
  fourthLineGroupItem: LineGroupItemRequest;
  fifthLineGroupItem: LineGroupItemRequest;
  discount?: DiscountRequest;
  showDiscount?: boolean;
  discountAmount?: number | undefined;
  discountPercentage?: number | undefined;
  discountDescription?: string | undefined;
  // totalDiscount stands for effective discount - metafactory api
  totalDiscount?: number;
  // totalExclVat , totalInclVat - are actually nested within discount object in response
  // These are total without discount
  totalExclVat: number;
  totalInclVat: number;
  sessionId?: string;
  purchaseTenantId?: string;
  activeForms: {
    firstLineGroupItem: boolean;
    secondLineGroupItem: boolean;
    thirdLineGroupItem: boolean;
    fourthLineGroupItem: boolean;
    fifthLineGroupItem: boolean;
  };
  duplicateCheck: {
    isPurchaseFormActive?: boolean;
    isTradeInFormActive?: boolean;
    isFinanceFormActive?: boolean;
    isProductFromActive?: boolean;
  };
  itemCount: {
    purchaseVehicleCount: number;
    financeCount: number;
    tradeInCount: number;
  };
  opportunityCustomerName?: string;
  totalAfterDiscountExclVAT: number;
  vat: number;
  totalAfterDiscountInclVAT: number;
  totalExclVAT: number;
  totalInclVAT: number;
};

export type TradeInMarginType = components['schemas']['Margin'];

export type CreateTradeInFormSchema = {
  imageUrls?: string[];
  mileage: number;
  licensePlate?: string;
  vin?: string;
  orderId?: string;
  tradeInValue: number;
  valuation?: number;
  originalBPM?: number;
  residualBPM?: number;
  tradeInDate?: string;
  tradeInTo?: components['schemas']['TradeInTo'];
  margin: TradeInMarginType;
  description: string;
  id?: string;
  productId: string;
  colour: string;
  registrationDate: string;
};

export const TradeInMarginValues: { [K in TradeInMarginType]: K } = {
  VATVehicle: 'VATVehicle',
  VATMarginVehicle: 'VATMarginVehicle',
};

export interface GetPrintableQuotationProps {
  quotationId: string;
  opportunityId: string;
  markAsShared: boolean;
  eSignService: eSignMethodEnum;
}

export interface TenantGroupsContainerProps {
  formMethods: UseFormReturn<CreateQuotationFormSchema>;
}

export interface TenantGroupProps {
  groupName: string;
  tenantGroupId: string;
  testGroupName?: string;
  groupFormFieldName: LineGroupItemNames;
  formMethods: UseFormReturn<CreateQuotationFormSchema>;
}

export interface QuotationPathParams {
  quotationId: string;
  opportunityId: string;
}

export interface EditQuotationSearchParams {
  opportunityId: string;
  vehicleId?: string;
}

export interface EditQuotationPageProps {
  params: QuotationPathParams;
  searchParams: EditQuotationSearchParams;
}

export interface QuickQuotationPageProps {
  searchParams: QuickQuotationSearchParams;
}

export interface DuplicateQuotationPathParams {
  id: string;
  quotationId: string;
}

export interface DuplicateQuotationSearchParams {
  vehicleId?: string;
}

export interface DuplicateQuotationPageProps {
  params: DuplicateQuotationPathParams;
  searchParams?: DuplicateQuotationSearchParams;
}

export type LineGroupItemsObj = {
  firstLineGroupItem: LineGroupItemRequest;
  secondLineGroupItem: LineGroupItemRequest;
  thirdLineGroupItem: LineGroupItemRequest;
  fourthLineGroupItem: LineGroupItemRequest;
  fifthLineGroupItem: LineGroupItemRequest;
};

export enum LineItemAction {
  DELETE = 'DELETE',
  ADD = 'ADD',
  EDIT = 'EDIT',
}

export type CalculateAndUpdateQuotationFormFieldArgs = {
  itemType?: LineGroupItemEntityEnum;
  action?: LineItemAction;
};

export type QuotationCustomerType = {
  id?: string;
  name?: string;
  email?: string;
};

export type FinanceType = components['schemas']['Finance'];

export type TradeInVehicleDetails = {
  bpm: number;
  carBrand: string;
  carGrade: string;
  dateFirstRecognition: string;
  rdwColor: string;
  restBPM: number;
};

export type ESignMethodResponse = {
  dealerId: number;
  dealerName: string;
  eSignService: eSignMethodEnum;
};
