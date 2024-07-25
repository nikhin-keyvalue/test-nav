import { Typography } from '@AM-i-B-V/ui-kit';
import { Grid } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';

import PersonDetailsBlock from '@/containers/persons/personDetails/PersonDetailsBlock';

import {
  opportunityDetailsResetValue,
  personDetailsResetValue,
  QuickQuotationStateNames,
} from '../../constants';
import { QuickQuotationFormSchema } from '../../types';

const PersonDetailsSection = ({
  disableEdit = false,
}: {
  disableEdit?: boolean;
}) => {
  const t = useTranslations();

  const { setValue, watch } = useFormContext<QuickQuotationFormSchema>();

  const personDetails = watch(QuickQuotationStateNames.personDetails);

  const removeSelectedPerson = () => {
    setValue(QuickQuotationStateNames.personDetails, personDetailsResetValue);
    setValue(QuickQuotationStateNames.personId, '');
    setValue(
      QuickQuotationStateNames.opportunityDetails,
      opportunityDetailsResetValue
    );
  };

  return (
    <Grid container display='flex' xs={12} lg={6}>
      <Grid item className='mb-2' xs={12}>
        <Typography variant='titleSmallBold' className='text-secondary'>
          {t('quotations.quickQuotation.theseArePersonsDetails')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <PersonDetailsBlock
          personDetails={personDetails}
          inQuickQuotation
          disableEdit={disableEdit}
          editActionText={t('quotations.quickQuotation.change')}
          onEditClick={removeSelectedPerson}
        />
      </Grid>
    </Grid>
  );
};

export default PersonDetailsSection;
