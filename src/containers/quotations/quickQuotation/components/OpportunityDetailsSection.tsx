import { Typography } from '@AM-i-B-V/ui-kit';
import { Grid } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import { useTranslations } from '@/hooks/translation';

import { QuickQuotationStateNames } from '../../constants';
import { QuickQuotationFormSchema } from '../../types';
import QuickQuotationOpportunityDetails from './QuickQuotationOpportunityDetails';

const OpportunityDetailsSection = ({
  disableEdit = false,
}: {
  disableEdit?: boolean;
}) => {
  const t = useTranslations();

  const { watch } = useFormContext<QuickQuotationFormSchema>();

  const opportunityDetailsWatch = watch(
    QuickQuotationStateNames.opportunityDetails
  );
  return (
    <Grid container display='flex' xs={12} lg={6}>
      <Grid item className='mb-2 mt-6' xs={12}>
        <Typography variant='titleSmallBold' className='text-secondary'>
          {t('quotations.quickQuotation.theseAreOpportunityDetails')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <QuickQuotationOpportunityDetails
          opportunityDetails={opportunityDetailsWatch}
          disableEdit={disableEdit}
        />
      </Grid>
    </Grid>
  );
};

export default OpportunityDetailsSection;
