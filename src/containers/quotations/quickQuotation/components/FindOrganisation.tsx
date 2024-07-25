import { Typography } from '@AM-i-B-V/ui-kit';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import { quickProposalIds } from '@test/constants/testIds';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { AutocompleteWithController } from '@/components';
import If from '@/components/If';
import { useOptions } from '@/hooks/options';
import { useTranslations } from '@/hooks/translation';
import { IOrganisationDetails } from '@/types/api';

import { QuickQuotationStateNames } from '../../constants';
import { QuickQuotationFormSchema } from '../../types';
import QuickQuotationOrganisationForm from './QuickQuotationOrganisationForm';

const RenderOrganisationOption = (
  props: React.HTMLAttributes<HTMLLIElement>,
  option: IOrganisationDetails
) => {
  const { name, id } = option;

  return (
    <li {...props} key={id}>
      <div>
        <div>{name ?? '_'}</div>
      </div>
    </li>
  );
};

const FindOrganisation = () => {
  const t = useTranslations();

  const parentFormMethods = useFormContext<QuickQuotationFormSchema>();

  const { control, watch } = parentFormMethods;

  const [openOrganisationForm, setOpenOrganisationForm] = useState(false);

  const { loading, options, onInputChange, onOpen } = useOptions({
    url: '/api/getOrganisations?isActive=true',
    currentOptions: [],
  });

  const organisationDetailsWatch = watch(
    QuickQuotationStateNames.organisationDetails
  );

  const onChangeOrganisation = () => setOpenOrganisationForm(false);

  return (
    <Grid container>
      <If condition={!openOrganisationForm}>
        <Grid item container display='flex' xs={12} md={6}>
          {!organisationDetailsWatch?.name && (
            <>
              <Grid item className='mb-2'>
                <Typography
                  data-testid={
                    quickProposalIds.quickProposalAreOrganisationAvailableTitle
                  }
                  variant='titleSmallBold'
                  className='text-secondary'
                >
                  {t('quotations.quickQuotation.areOrgDetailsAvailableYet')}
                </Typography>
              </Grid>

              <Grid
                container
                padding={3}
                className='rounded bg-grey-8'
                item
                xs={12}
              >
                <Grid item xs={12}>
                  <AutocompleteWithController
                    testId={quickProposalIds.findOrganisationTextField}
                    loading={loading}
                    options={options as IOrganisationDetails[]}
                    onInputChange={onInputChange}
                    onOpen={onOpen}
                    name={QuickQuotationStateNames.organisationDetails}
                    control={control}
                    label={t('quotations.quickQuotation.findOrganisation')}
                    isOptionEqualToValue={(option, value) =>
                      option?.id === value?.id
                    }
                    getOptionLabel={(option) => option?.name || ''}
                    renderOption={RenderOrganisationOption}
                    noOptionsText={
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setOpenOrganisationForm(true);
                        }}
                        variant='text'
                      >
                        <Typography
                          variant='textMediumBold'
                          className='normal-case text-primary'
                        >
                          {t('quotations.quickQuotation.createNewOrganisation')}
                        </Typography>
                      </Button>
                    }
                  />
                </Grid>
                <Grid item xs={12} className='mt-4'>
                  <div
                    role='presentation'
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setOpenOrganisationForm(true);
                    }}
                  >
                    <Typography
                      variant='textMediumBold'
                      className='cursor-pointer text-primary'
                    >
                      {t('quotations.quickQuotation.createNewOrganisation')}
                    </Typography>
                  </div>
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </If>
      <If condition={!!openOrganisationForm}>
        <Grid container className='mt-6'>
          <Grid item xs={12} md={8}>
            <Typography variant='titleSmallBold' className='text-secondary'>
              {t('quotations.quickQuotation.areOrgDetailsAvailableYet')}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid
              container
              item
              className=' mt-2 flex items-center justify-between bg-grey-8 p-6'
            >
              <Typography variant='titleSmall' className='text-secondary'>
                {t('quotations.quickQuotation.enterOrganisationDetails')}
              </Typography>
              <Button
                className='ml-auto'
                onClick={onChangeOrganisation}
                variant='text'
              >
                <Typography
                  variant='textMediumBold'
                  className='normal-case text-primary'
                >
                  {t('common.change')}
                </Typography>
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <QuickQuotationOrganisationForm
              closeOrganisationForm={setOpenOrganisationForm}
            />
          </Grid>
        </Grid>
      </If>
    </Grid>
  );
};

export default FindOrganisation;
