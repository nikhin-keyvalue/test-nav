import { Grid } from '@mui/material';

import ListPageHeader from '@/components/ListPageHeader';
import { ALLOWED_PARAMS } from '@/constants/common';
import { useTranslations } from '@/hooks/translation';
import { SearchParams } from '@/types/common';

import PersonsFilter from './PersonsFilter.client';
import PersonsTable from './PersonsTable.server';

const PersonsList = ({ searchParams }: { searchParams: SearchParams }) => {
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
          title={t('personsListing.title') || ''}
          addHref='/persons/new'
        />
      </Grid>
      <Grid item width='100%'>
        <PersonsFilter params={filteredParams} />
      </Grid>
      <Grid item width='100%'>
        <PersonsTable searchParams={filteredParams} />
      </Grid>
    </Grid>
  );
};

export default PersonsList;
