/* eslint-disable import/no-cycle */
import { definitions } from '@generated/metafactory-service-types';

import { IOrganisationDetails, PersonsDetails } from '@/types/api';
import { PersonType, QuickQuotationSearchParams } from '@/types/common';

import { opportunityDetails } from '../opportunities/api/type';
import { CarouselData } from '../vehicles/components/types';
import { LineGroupItemPurchase } from './api/type';
import { TenantGroupItemEntity } from './components/tenantGroups/types';

type VehicleHeaderDetails = definitions['IHeaderCarStockDto'] | null;

export type ConfirmationModalType = 'delete' | 'clientAgreed' | 'clientSigned';

export interface ModalProps {
  id: number | string;
  name: ConfirmationModalType;
}

export type CreatePersonQQProps = {
  onCancel: VoidFunction;
  onSuccess: ({ personId }: { personId: string }) => void;
};

export type QuickQuotationClientProps = {
  searchParams: QuickQuotationSearchParams;
  vehicleHeaderDetails?: VehicleHeaderDetails | null;
  vehicleImageDetails?: CarouselData | null;
};

export enum QuickQuotationFlows {
  FIND_OPPORTUNITY,
  CREATE_OPPORTUNITY,
  FIND_PERSON,
  CREATE_PERSON,
}

export type isLoadingObject = {
  isLoadingPerson: boolean;
  isLoadingOrganisation: boolean;
  isLoadingOpportunity: boolean;
};

export type LineGroupItemType =
  | 'firstLineGroupItem'
  | 'secondLineGroupItem'
  | 'thirdLineGroupItem'
  | 'fourthLineGroupItem'
  | 'fifthLineGroupItem';

export type PurchaseLineItemType = (
  | LineGroupItemPurchase
  | TenantGroupItemEntity
) & {
  index?: number;
};

export type QuickQuotationFormSchema = {
  organisationId: string;
  personId: string;
  opportunityDetails: opportunityDetails;
  editOpportunityDetails: opportunityDetails;
  organisationDetails: IOrganisationDetails;
  personDetails: PersonsDetails;
  personType: PersonType;
  flow: QuickQuotationFlows;
  isLoading: isLoadingObject;
};

export type CreateEditOpportunityQQProps = {
  customer: PersonsDetails;
  organisation?: IOrganisationDetails;
  opportunity?: opportunityDetails;
  isEdit?: boolean;
};

export type LineGroupDefaultNameType =
  | 'firstLineGroupItemDefaultName'
  | 'secondLineGroupItemDefaultName'
  | 'thirdLineGroupItemDefaultName'
  | 'fourthLineGroupItemDefaultName'
  | 'fifthLineGroupItemDefaultName';

export type GetReverseCalculatedDiscountPercentageArgs = {
  totalDiscountAmount: number;
  itemPrice: number;
};
