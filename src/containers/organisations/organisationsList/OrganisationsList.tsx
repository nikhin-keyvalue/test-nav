import { Grid } from '@mui/material';

import ListPageHeader from '@/components/ListPageHeader';
import { ALLOWED_PARAMS } from '@/constants/common';
import { useTranslations } from '@/hooks/translation';
import { SearchParams } from '@/types/common';

import OrganisationsFilters from './OrganisationsFilters.client';
import OrganisationsTable from './OrganisationsTable.server';

const OrganisationsList = ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
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
      <Grid item width='100%'>
        <ListPageHeader
          title={t('organisationsListing.title') || ''}
          addHref='/organisations/new'
        />
      </Grid>
      <Grid item width='100%'>
        <OrganisationsFilters params={filteredParams} />
      </Grid>
      <Grid item width='100%'>
        <OrganisationsTable searchParams={filteredParams} />
      </Grid>
    </Grid>
  );
};

export default OrganisationsList;
