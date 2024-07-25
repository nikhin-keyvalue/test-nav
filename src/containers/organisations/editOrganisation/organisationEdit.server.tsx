import { IOrganisationDetails } from '@/types/api';
import { crmServiceFetcher } from '@/utils/api';
import { getTraceId, getURLSearchParamsString } from '@/utils/common';

import { GETOrganisationByIdQueryParameters } from '../api/type';
import OrganisationEdit from './OrganisationEdit.client';

const OrganisationEditServer = async ({ id }: { id: string }) => {
  let organisationData: IOrganisationDetails | null;
  try {
    const getOrganisationByIdQueryParameters: GETOrganisationByIdQueryParameters =
      {
        excludeRelated: true,
      };
    organisationData = await crmServiceFetcher(
      `organisations/${id}${getURLSearchParamsString({ queryParams: getOrganisationByIdQueryParameters })}`
    );
  } catch (errorResponse) {
    // TODO: Remove console and handle error
    console.log(
      'ERROR Something went wrong :',
      errorResponse,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('organisationDataForEditOrganisationPage')
    );
    organisationData = null;
  }

  // TODO: Remove unreachable code

  return <OrganisationEdit id={id} details={organisationData} />;
};

export default OrganisationEditServer;
