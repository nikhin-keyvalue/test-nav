import { FC } from 'react';

import { PageProps } from '@/types/common';

import { getOpportunities } from '../api/actions';
import { OpportunitiesResponse } from '../api/type';
import OpportunityTable from './OpportunityTable.client';

const OpportunityTableContainer: FC<PageProps> = async ({ searchParams }) => {
  const opportunitiesResponse: OpportunitiesResponse = await getOpportunities({
    searchParams,
  });

  return (
    <OpportunityTable
      opportunitiesResponse={opportunitiesResponse}
      searchParams={searchParams}
    />
  );
};

export default OpportunityTableContainer;
