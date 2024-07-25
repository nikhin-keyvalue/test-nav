import { redirect } from 'next/navigation';
import { FC } from 'react';

import { getMiscellaneousSettings } from '@/containers/miscellaneous/api/actions';
import { MiscellaneousSettingsResponse } from '@/containers/miscellaneous/types';
import { getOpportunityDetailsById } from '@/containers/opportunities/api/actions';
import { OpportunityDetails } from '@/containers/opportunities/api/type';
import { fetchAndTransformVehicleData } from '@/containers/vehicles/api/actions';
import { TransformedVehicleData } from '@/containers/vehicles/api/types';

import { getQuotationDetailsById } from '../api/actions';
import { DuplicateQuotationPageProps, QuotationResponse } from '../api/type';
import EditQuotationProvider from '../editQuotation/EditQuotationProvider.client';

const DuplicateQuotationServer: FC<DuplicateQuotationPageProps> = async ({
  params,
  searchParams,
}) => {
  const { vehicleId } = searchParams || {};
  let quotationResponse: QuotationResponse;
  let opportunityDetails: OpportunityDetails | null;
  let miscellaneousSettings: MiscellaneousSettingsResponse;
  let transformedVehicleData: TransformedVehicleData = null;

  try {
    quotationResponse = await getQuotationDetailsById({
      id: params.quotationId,
    });
    opportunityDetails = await getOpportunityDetailsById({
      pathParams: { opportunityId: quotationResponse.opportunity.id },
      queryParams: { excludeRelated: true },
    });

    miscellaneousSettings = await getMiscellaneousSettings();

    if (vehicleId) {
      transformedVehicleData = await fetchAndTransformVehicleData({
        vehicleId,
      });
    }
  } catch (err) {
    redirect('/opportunities');
  }

  return (
    <EditQuotationProvider
      isDuplicateQuotation
      quotationResponse={quotationResponse}
      opportunityDetails={opportunityDetails}
      transformedVehicleData={transformedVehicleData}
      showPreview={miscellaneousSettings?.proposalPreviewOnCreate || false}
    />
  );
};

export default DuplicateQuotationServer;
