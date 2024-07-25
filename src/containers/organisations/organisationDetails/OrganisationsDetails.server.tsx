import { IOrganisationDetails } from '@/types/api';
import { crmServiceFetcher } from '@/utils/api';
import { getTraceId } from '@/utils/common';

import OrganisationDetailsUI from './OrganisationDetails.client';

const OrganisationDetails = async ({ id }: { id: string }) => {
  let organisationDetails: IOrganisationDetails | null;
  try {
    organisationDetails = await crmServiceFetcher(`organisations/${id}`);
  } catch (errorResponse) {
    // TODO: Remove console and handle error
    console.log(
      'ERROR Something went wrong :',
      errorResponse,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('organisationDetailsForOrganisationDetailsPage')
    );
    organisationDetails = null;
  }

  return <OrganisationDetailsUI organisationDetails={organisationDetails} />;
};

export default OrganisationDetails;
