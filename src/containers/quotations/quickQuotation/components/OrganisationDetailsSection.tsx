import { Typography } from '@AM-i-B-V/ui-kit';
import { Grid } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';

import OrganisationDetailsBlock from '@/containers/organisations/organisationDetails/OrganisationDetailsBlock';

import {
  opportunityDetailsResetValue,
  organisationResetValue,
  personDetailsResetValue,
  QuickQuotationStateNames,
} from '../../constants';
import { QuickQuotationFormSchema } from '../../types';

const OrganisationDetailsSection = ({
  disableEdit = false,
}: {
  disableEdit?: boolean;
}) => {
  const t = useTranslations();

  const { setValue, watch } = useFormContext<QuickQuotationFormSchema>();

  const organisationDetails = watch(
    QuickQuotationStateNames.organisationDetails
  );

  const removeSelectedOrganisation = () => {
    // Remove selected organisation in QQ form so that select form will appear
    setValue(
      QuickQuotationStateNames.organisationDetails,
      organisationResetValue
    );
    setValue(QuickQuotationStateNames.organisationId, '');
    setValue(QuickQuotationStateNames.personDetails, personDetailsResetValue);
    setValue(QuickQuotationStateNames.personId, '');
    setValue(
      QuickQuotationStateNames.opportunityDetails,
      opportunityDetailsResetValue
    );
  };

  return (
    <Grid container xs={12} lg={6} className='mb-6'>
      <Grid item className='mb-2' xs={12}>
        <Typography variant='titleSmallBold' className='text-secondary'>
          {t('quotations.quickQuotation.theseAreOrgDetails')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <OrganisationDetailsBlock
          inQuickQuotation
          disableEdit={disableEdit}
          editActionText={t('quotations.quickQuotation.change')}
          onEditClick={removeSelectedOrganisation}
          organisationDetails={organisationDetails}
        />
      </Grid>
    </Grid>
  );
};

export default OrganisationDetailsSection;
