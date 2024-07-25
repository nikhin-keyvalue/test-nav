import { components, paths } from '@generated/crm-service-types';

import { IOrganisationDetails, Person, PersonsDetails } from '@/types/api';

export type OpportunitiesResponse =
  paths['/opportunities']['get']['responses']['200']['content']['application/json'];

export type OpportunityDetails =
  paths['/opportunities/{opportunityId}']['get']['responses']['200']['content']['application/json'];

export type GETOpportunityByIdPathParameter =
  paths['/opportunities/{opportunityId}']['get']['parameters']['path'];
export type GETOpportunityByIdQueryParameter =
  paths['/opportunities/{opportunityId}']['get']['parameters']['query'];

export type QuotationDetailsSummaryType =
  paths['/opportunities/{opportunityId}']['get']['responses']['200']['content']['application/json']['quotations'];

export type OpportunityStatusType = components['schemas']['OpportunityStatus'];

export type opportunityDetails = components['schemas']['Opportunity'];

export interface Translation {
  locale: string;
  entityName: string;
  propertyName: string;
  translationValue: string;
}

export interface Location {
  id: number;
  displayValue: string;
  groupName?: string;
}

export interface Localized {
  supportedLocales: string[];
  translatableFields: string[];
  translations: Translation[];
}

export interface DealerDetails {
  version: number;
  createdOn?: string;
  updatedOn?: string;
  creator?: string;
  updater?: string;
  id: number;
  advertisementTitle: string;
  hexonAdvertiserId: number;
  name: string;
  address: string;
  houseNumber: number;
  zipCode: string;
  city: string;
  phone: string;
  email: string;
  website?: string;
  iban?: string;
  carStockEmail: string;
  contact?: string;
  quoteDescription?: string;
  configuratorDescription?: string;
  googleAnalyticsTrackingId?: string;
  hotjarSiteId?: string;
  footerText?: string;
  headerText?: string;
  configuratorUrl: string;
  twitter?: string;
  whatsApp?: string;
  facebook?: string;
  salesOrderValidFor: number;
  hexonDealer: boolean;
  hexonComment: string;
  dutchRegionDisplayValue?: string;
  countryDisplayValue: string;
  localeDisplayValue: string;
  dutchRegion?: string;
  country: string;
  locale: string;
  localized: Localized;
  locations: Location[];
  esignServiceDisplayValue: string;
  esignService: string;
}

export type BasicInfo = {
  id?: string | undefined;
  name?: string | undefined;
};

// TODO reuse person type from codegen
export type Address = {
  countryCode: string;
  houseNumber: number;
  street: string;
  postalCode: string;
  city: string;
  isPrimary: boolean;
};

export type PersonListResponse = {
  data: Person[];
  count: number;
  offset: number;
  limit: number;
};

export type CreateOpportunityParams = {
  personId?: string;
  organisationId?: string;
};

export type CreateOpportunityPrefillData = {
  person?: PersonsDetails | null;
  organisation?: IOrganisationDetails | null;
};
