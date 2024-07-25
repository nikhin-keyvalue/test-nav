import { Typography } from '@AM-i-B-V/ui-kit';
import { Grid } from '@mui/material';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

import FinancialSummary from './FinancialSummary';

interface FinancialSummarySectionProps {
  testId?: string;
}

const FinancialSummarySection: FC<FinancialSummarySectionProps> = ({
  testId,
}) => {
  const t = useTranslations();
  return (
    <Grid container className='rounded bg-white px-6 py-4 shadow' item>
      <Grid xs={12} item>
        <Typography className='mb-5' variant='titleMediumBold'>
          {t('quotations.financialSummary')}
        </Typography>
      </Grid>
      <FinancialSummary testId={testId} />
    </Grid>
  );
};

export default FinancialSummarySection;
