'use client';

import { FC } from 'react';

import { TransformedVehicleData } from '@/containers/vehicles/api/types';

import { OpportunityDetails } from '../../opportunities/api/type';
import { CreateQuotationContextWrapper } from '../CreateQuotationContextWrapper';
import CreateQuotation from './CreateQuotation.client';

interface CreateQuotationProviderProps {
  showPreview?: boolean;
  opportunityDetails: OpportunityDetails | null;
  transformedVehicleData?: TransformedVehicleData;
}

const CreateQuotationProvider: FC<CreateQuotationProviderProps> = ({
  opportunityDetails,
  showPreview = false,
  transformedVehicleData,
}) => (
  <CreateQuotationContextWrapper>
    <CreateQuotation
      showPreview={showPreview}
      opportunityDetails={opportunityDetails}
      transformedVehicleData={transformedVehicleData}
    />
  </CreateQuotationContextWrapper>
);

export default CreateQuotationProvider;
