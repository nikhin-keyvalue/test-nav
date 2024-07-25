import Grid from '@mui/material/Grid';
import { FC } from 'react';

import ListPageHeader from '@/components/ListPageHeader';
import { ALLOWED_PARAMS } from '@/constants/common';
import { useTranslations } from '@/hooks/translation';
import { PageProps, SearchParams } from '@/types/common';

import { opportunityTestIds } from '../../../../tests/e2e/constants/testIds';
import OpportunityFilter from './OpportunityFilter.client';
import OpportunityTableContainer from './OpportunityTable.server';

const OpportunityList: FC<PageProps> = ({ searchParams }) => {
  const t = useTranslations();
  const filteredParams = ALLOWED_PARAMS.reduce(
    (params, paramKey) => ({
      ...params,
      ...(searchParams[paramKey] ? { [paramKey]: searchParams[paramKey] } : {}),
    }),
    {} as SearchParams
  );

  return (
    <Grid container rowGap={4}>
      <Grid item xs={12}>
        <ListPageHeader
          title={t('opportunityListing.title')}
          addHref='/opportunities/new'
          testId={opportunityTestIds.opportunityAddButton}
        />
      </Grid>
      <Grid item xs={12}>
        <OpportunityFilter searchParams={filteredParams} />
      </Grid>
      <Grid item xs={12}>
        <OpportunityTableContainer searchParams={filteredParams} />
      </Grid>
    </Grid>
  );
};

export default OpportunityList;
