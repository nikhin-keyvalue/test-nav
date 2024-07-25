import { getMiscellaneousSettings } from '@/containers/miscellaneous/api/actions';
import { getOpportunityDetailsById } from '@/containers/opportunities/api/actions';
import { fetchAndTransformVehicleData } from '@/containers/vehicles/api/actions';
import { TransformedVehicleData } from '@/containers/vehicles/api/types';

import { OpportunityDetails } from '../../opportunities/api/type';
import { QuotationPageProps } from '../api/type';
import CreateQuotationProvider from './CreateQuotationProvider.client';

const CreateQuotationServer = async ({
  searchParams,
}: {
  searchParams: QuotationPageProps;
}) => {
  let transformedVehicleData: TransformedVehicleData = null;
  const opportunityDetails: OpportunityDetails | null =
    await getOpportunityDetailsById({
      pathParams: { opportunityId: searchParams.opportunityId },
      queryParams: { excludeRelated: true },
    });

  const miscellaneousSettings = await getMiscellaneousSettings();
  const showPreview = miscellaneousSettings?.proposalPreviewOnCreate || false;

  if (searchParams.vehicleId) {
    transformedVehicleData = await fetchAndTransformVehicleData({
      vehicleId: searchParams.vehicleId,
    });
  }

  return (
    <CreateQuotationProvider
      showPreview={showPreview}
      opportunityDetails={opportunityDetails}
      transformedVehicleData={transformedVehicleData}
    />
  );
};

export default CreateQuotationServer;
