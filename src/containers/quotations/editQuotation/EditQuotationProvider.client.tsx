'use client';

import { FC } from 'react';

import { OpportunityDetails } from '@/containers/opportunities/api/type';
import { TransformedVehicleData } from '@/containers/vehicles/api/types';

import { QuotationResponse } from '../api/type';
import { CreateQuotationContextWrapper } from '../CreateQuotationContextWrapper';
import EditQuotation from './EditQuotation.client';

interface EditQuotationProviderProps {
  showPreview?: boolean;
  isDuplicateQuotation?: boolean;
  quotationResponse: QuotationResponse;
  opportunityDetails: OpportunityDetails | null;
  transformedVehicleData?: TransformedVehicleData;
}

const EditQuotationProvider: FC<EditQuotationProviderProps> = ({
  quotationResponse,
  opportunityDetails,
  showPreview = false,
  transformedVehicleData,
  isDuplicateQuotation = false,
}) => (
  <CreateQuotationContextWrapper>
    <EditQuotation
      showPreview={showPreview}
      quotationResponse={quotationResponse}
      opportunityDetails={opportunityDetails}
      isDuplicateQuotation={isDuplicateQuotation}
      transformedVehicleData={transformedVehicleData}
    />
  </CreateQuotationContextWrapper>
);

export default EditQuotationProvider;
