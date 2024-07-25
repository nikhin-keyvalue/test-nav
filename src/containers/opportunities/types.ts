import { components, paths as crmPaths } from '@generated/crm-service-types';
import { components as documentComponents } from '@generated/documents-types';
import { Dayjs } from 'dayjs';

import { MiscellaneousSettingsResponse } from '../miscellaneous/types';
import { ESignMethodResponse } from '../quotations/api/type';
import { QuotationDetailsSummaryType } from './api/type';
import { Categories, OPPORTUNITY_STATUS } from './constants';

export interface NameIdMap {
  id?: string | undefined;
  name?: string | undefined;
}

export type CustomerType = {
  id?: string | undefined;
  type?: string | undefined;
  lastName?: string | undefined;
  firstName?: string | undefined;
};
export interface CreateEditOpportunityFormProps {
  customer?: CustomerType;
  organisation?: NameIdMap;
  leasingCompany?: NameIdMap;
  newCloseDate?: Dayjs | null;
  businessCustomerValidation: string | null;
}

export type OpportunityStatusType =
  | OPPORTUNITY_STATUS.INTEREST
  | OPPORTUNITY_STATUS.AGREEMENT
  | OPPORTUNITY_STATUS.QUOTATION
  | OPPORTUNITY_STATUS.CLOSEDWON
  | OPPORTUNITY_STATUS.CLOSEDLOST
  | OPPORTUNITY_STATUS.CUSTOMERDECISION;

export type DocumentSubCategory =
  documentComponents['schemas']['OpportunitySubcategory'];

export type OpportunityDocumentResponse =
  documentComponents['schemas']['OpportunityDocumentResponse'];

export type DocumentSubCategoryWithLabel = {
  label: string;
  value: DocumentSubCategory;
};

export type DocumentCategories = {
  category?: Categories;
  subcategories?: DocumentSubCategory[];
};

export enum QUOTATION_STATUSES {
  CONCEPT = 'Concept',
  REJECTED = 'Rejected',
  SHARE_QUOTATION = 'SharedQuotation',
  AGREEMENT_SIGNED = 'AgreementSigned',
  PRELIMINARY_AGREEMENT = 'PreliminaryAgreement',
}

export type QuotationsAccordionListBlock = {
  opportunityId: string;
  quotationAccordionData?: QuotationDetailsSummaryType;
  isDeliveryPage?: boolean;
  disableAdd?: boolean;
  disableDuplicate?: boolean;
  dealerESignInfo: ESignMethodResponse;
  miscellaneousSettings?: MiscellaneousSettingsResponse;
};

export enum QUOTATION_ELLIPSIS_MENU_OPTIONS {
  EDIT_QUOTATION = 'common.edit',
  EMAIL_QUOTATION = 'events.email',
  DELETE_QUOTATION = 'common.delete',
  PRINT_QUOTATION = 'quotations.print',
  REJECT_QUOTATION = 'quotations.reject',
  DUPLICATE_QUOTATION = 'quotations.duplicate',
}

export enum LINE_GROUP_ITEMS_KEYS {
  GROUP_ID = 'groupId',
  PRODUCTS = 'products',
  FINANCES = 'finances',
  TRADEINS = 'tradeIns',
  PURCHASES = 'purchases',
  GROUP_NAME = 'groupName',
}

export type LineGroupItemsType = components['schemas']['LineGroupItem'];

export type QuotationDetailsType = {
  id: string;
  vat: number;
  name: string;
  status: string;
  vatType: string;
  opportunity: {
    id: string;
    name: string;
  };
  totalExclVat: number;
  totalInclVat: number;
  quotationDate: string;
  discount: {
    amount: number;
    percentage: number;
    description: string;
    noDiscountExclVAT: number;
    noDiscountInclVAT: number;
  };
  quotationValidUntil: string;
  lineGroupItems: LineGroupItemsType[];
};

export type OpportunitiesAndDeliveriesList =
  crmPaths['/persons/{personId}']['get']['responses']['200']['content']['application/json']['opportunitiesAndDeliveries'];

export interface DuplicateOpportunityPathParams {
  id: string;
}

export interface DuplicateOpportunitySearchParams {}

export interface DuplicateOpportunityPageProps {
  params: DuplicateOpportunityPathParams;
  searchParams?: DuplicateOpportunitySearchParams;
}

export type OpportunityFlowType =
  | 'CREATE_OPPORTUNITY'
  | 'EDIT_OPPORTUNITY'
  | 'DUPLICATE_OPPORTUNITY';

export const opportunityFlows: Record<string, OpportunityFlowType> = {
  createOpportunity: 'CREATE_OPPORTUNITY',
  editOpportunity: 'EDIT_OPPORTUNITY',
  duplicateOpportunity: 'DUPLICATE_OPPORTUNITY',
};
