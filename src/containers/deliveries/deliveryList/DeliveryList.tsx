import Grid from '@mui/material/Grid';

import ListPageHeader from '@/components/ListPageHeader';
import { ALLOWED_PARAMS } from '@/constants/common';
import { useTranslations } from '@/hooks/translation';
import { PageProps, SearchParams } from '@/types/common';

import DeliveryFilter from './DeliveryFilter.client';
import DeliveryTable from './DeliveryTable.server';

const DeliveryList = ({ searchParams }: PageProps) => {
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
        <ListPageHeader title={t('deliveryListing.title')} />
      </Grid>
      <Grid item xs={12}>
        <DeliveryFilter searchParams={filteredParams} />
      </Grid>
      <Grid item xs={12}>
        <DeliveryTable searchParams={filteredParams} />
      </Grid>
    </Grid>
  );
};

export default DeliveryList;
