import { EXTERNAL_BASE_URL, WEBDEALER_BASE_URL } from '@/constants/env';
import { getMiscellaneousSettings } from '@/containers/miscellaneous/api/actions';
import { GETPersonByIdQueryParameters } from '@/containers/persons/api/type';
import { getDealerESignInfo } from '@/containers/quotations/api/actions';
import { ESignMethodResponse } from '@/containers/quotations/api/type';
import { getCurrentWorkflows } from '@/containers/workflows/api/actions';
import { currentUser } from '@/hooks/server/currentUser';
import { crmServiceFetcher } from '@/utils/api';
import { getTraceId, getURLSearchParamsString } from '@/utils/common';
import { getTokenDecodedValues } from '@/utils/tokenDecodeAction';

import {
  getOpportunityDetailsById,
  getOpportunityDocumentCategory,
} from '../api/actions';
import { DefaultESignResponse } from '../constants';
import OpportunityDetailsUI from './OpportunityDetails.client';

const OpportunityDetailsServer = async ({
  opportunityId,
}: {
  opportunityId: string;
}) => {
  const [
    opportunityDetails,
    opportunityDocumentCategories,
    workflowData,
    userDetails,
    dealersESignInfo,
    miscellaneousSettings,
  ] = await Promise.all([
    getOpportunityDetailsById({ pathParams: { opportunityId } }),
    getOpportunityDocumentCategory(),
    getCurrentWorkflows(opportunityId, 'OPPORTUNITY'),
    currentUser(),
    getDealerESignInfo(),
    getMiscellaneousSettings(),
  ]);
  let customerDetails;
  let isDealerPreview = false;
  try {
    const availablePermissions = await getTokenDecodedValues('userRoles');
    isDealerPreview = availablePermissions.includes('ROLE_DEALER_PREVIEW');
    const getPersonByIdQueryParameters: GETPersonByIdQueryParameters = {
      excludeRelated: true,
    };
    customerDetails = await crmServiceFetcher(
      `persons/${opportunityDetails?.customer?.id}${getURLSearchParamsString({ queryParams: getPersonByIdQueryParameters })}`
    );
  } catch (errorResponse) {
    // TODO: Remove console and handle error
    console.log(
      'ERROR Something went wrong :',
      errorResponse,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('personForOpportunityDetailsPage')
    );
    customerDetails = null;
  }

  const dealerESignInfo = (
    (dealersESignInfo as ESignMethodResponse[]) || []
  )?.find(
    (dealer) =>
      String(dealer?.dealerId) === opportunityDetails?.dealer?.dealerId
  ) as ESignMethodResponse;

  return (
    <OpportunityDetailsUI
      customerDetails={customerDetails}
      isDealerPreview={isDealerPreview}
      opportunityDetails={opportunityDetails}
      opportunityDocumentCategories={opportunityDocumentCategories}
      webdealerBaseUrl={
        isDealerPreview ? WEBDEALER_BASE_URL! : EXTERNAL_BASE_URL!
      }
      workflowData={workflowData}
      roles={userDetails?.authorities}
      dealerESignInfo={dealerESignInfo || DefaultESignResponse}
      miscellaneousSettings={miscellaneousSettings}
    />
  );
};

export default OpportunityDetailsServer;
