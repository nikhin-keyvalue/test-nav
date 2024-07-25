import { redirect } from 'next/navigation';

import { OpportunityDetails } from '@/types/api';
import { crmServiceFetcher } from '@/utils/api';
import { getTraceId } from '@/utils/common';

import { OPPORTUNITY_STATUS } from '../constants';
import EditOpportunityClient from './EditOpportunity.client';

const EditOpportunityServer = async ({ id }: { id: string }) => {
  let opportunityDetails: OpportunityDetails | null;
  try {
    opportunityDetails = await crmServiceFetcher(`opportunities/${id}`);
  } catch (errorResponse) {
    // TODO: Remove console and handle error
    console.log(
      'ERROR Something went wrong :',
      errorResponse,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('getOpportunityDetailsForEditOpportunity')
    );
    opportunityDetails = null;
  }

  if (
    opportunityDetails?.status === OPPORTUNITY_STATUS.CLOSEDLOST ||
    opportunityDetails?.status === OPPORTUNITY_STATUS.CLOSEDWON
  )
    return redirect(`/opportunities/${id}/details`);

  return <EditOpportunityClient details={opportunityDetails} />;
};

export default EditOpportunityServer;
