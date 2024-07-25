import { Grid } from '@mui/material';
import { Suspense } from 'react';

import If from '@/components/If';
import SpinnerScreen from '@/components/SpinnerScreen';
import { EmailTemplatesPageProps } from '@/types/common';

import EditEmailTemplateServer from '../editEmailTemplate/EditEmailTemplate.server';
import EmailTemplateListServer from '../emailTemplateList/EmailTemplateList.server';

const ListAndEdit = ({ searchParams }: EmailTemplatesPageProps) => {
  const { id, ...rest } = searchParams;

  return (
    <Grid container justifyContent='space-between' columnSpacing={6}>
      <Grid item xs={6}>
        <Suspense fallback={<SpinnerScreen />}>
          <EmailTemplateListServer searchParams={rest} />
        </Suspense>
      </Grid>
      <If condition={Boolean(id)}>
        <Grid item xs={6}>
          <Suspense fallback={<SpinnerScreen />}>
            <EditEmailTemplateServer id={id} />
          </Suspense>
        </Grid>
      </If>
    </Grid>
  );
};

export default ListAndEdit;
