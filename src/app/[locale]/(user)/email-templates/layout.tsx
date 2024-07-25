import { Grid } from '@mui/material';
import { ReactNode } from 'react';

import LandingPageHeader from '@/containers/email-templates/components/LandingPageHeader';

export default function EmailTemplateLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Grid container direction='column'>
      <Grid item>
        <LandingPageHeader />
      </Grid>
      <Grid item>{children}</Grid>
    </Grid>
  );
}
