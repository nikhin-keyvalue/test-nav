import { redirect } from 'next/navigation';
import { FC } from 'react';

import { routes } from '@/constants/routes';
import { OpportunityDetails } from '@/types/api';
import { crmServiceFetcher } from '@/utils/api';

import EditOpportunityClient from '../editOpportunity/EditOpportunity.client';
import { DuplicateOpportunityPageProps, opportunityFlows } from '../types';

const DuplicateOpportunityServer: FC<DuplicateOpportunityPageProps> = async ({
  params,
}) => {
  let opportunityDetails: OpportunityDetails | null;
  try {
    opportunityDetails = await crmServiceFetcher(`opportunities/${params?.id}`);
  } catch (errorResponse) {
    console.log('ERROR Something went wrong :', errorResponse);
    opportunityDetails = null;
  }
  if (!opportunityDetails) {
    redirect(routes.opportunity.opportunities);
  }

  return (
    <EditOpportunityClient
      flow={opportunityFlows.duplicateOpportunity}
      details={opportunityDetails}
    />
  );
};

export default DuplicateOpportunityServer;
