import { getOrganisationDetailsById } from '@/containers/organisations/api/api';
import { getPersonDetailsById } from '@/containers/persons/api/api';
import { currentUser } from '@/hooks/server/currentUser';

import {
  CreateOpportunityParams,
  CreateOpportunityPrefillData,
} from '../api/type';
import CreateOpportunityClient from './CreateOpportunity.client';

const CreateOpportunityServer = async ({
  params,
}: {
  params: CreateOpportunityParams;
}) => {
  const userDetails = await currentUser();

  const prefillData: CreateOpportunityPrefillData = {};
  if (params.organisationId) {
    prefillData.organisation = await getOrganisationDetailsById({
      queryParams: { excludeRelated: true },
      pathParams: { organisationId: params.organisationId },
    });
  } else if (params.personId) {
    prefillData.person = await getPersonDetailsById({
      pathParams: { personId: params.personId },
      queryParams: { excludeRelated: true },
    });
  }

  return (
    <CreateOpportunityClient
      userDetails={userDetails}
      prefillData={prefillData}
    />
  );
};

export default CreateOpportunityServer;
