import { Typography } from '@AM-i-B-V/ui-kit';
import Button from '@mui/material/Button/Button';
import Grid from '@mui/material/Grid/Grid';
import { quickProposalIds } from '@test/constants/testIds';
import { FC, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import AutocompleteWithController from '@/components/autocomplete-with-controller/AutocompleteWithController';
import RenderPersonOption from '@/components/autocomplete-with-controller/components/RenderPersonOption';
import If from '@/components/If';
import { useOptions } from '@/hooks/options';
import { useTranslations } from '@/hooks/translation';
import { mergeStrings } from '@/utils/common';

import { QuickQuotationStateNames } from '../../constants';
import { QuickQuotationFormSchema } from '../../types';
import CreatePersonQQ from './CreatePersonQQ';

type FindPersonSectionProps = object;

const FindPersonSection: FC<FindPersonSectionProps> = () => {
  const t = useTranslations();
  const { control, setValue, watch } =
    useFormContext<QuickQuotationFormSchema>();
  const organisationDetailsWatch = watch(
    QuickQuotationStateNames.organisationDetails
  );

  const quotationPersonTypeWatch = watch(QuickQuotationStateNames.personType);

  const [showCreatePersonForm, setShowCreatePersonForm] =
    useState<boolean>(false);

  const onCreateNewPerson = () => {
    setShowCreatePersonForm(true);
  };

  const { loading, options, onInputChange, onOpen } = useOptions({
    url: `/api/getPersons?isActive=true&type=${quotationPersonTypeWatch}${
      quotationPersonTypeWatch === 'Business' && organisationDetailsWatch?.id
        ? `&organisationId=${organisationDetailsWatch?.id}`
        : ''
    }`,
    currentOptions: [],
    customSearchParamKeys: ['name', 'email'],
  });

  const onChangePerson = () => {
    setShowCreatePersonForm(false);
  };

  const onCancelCreatePerson = () => {
    setShowCreatePersonForm(false);
  };

  const onCreatePersonSuccess = ({ personId }: { personId: string }) => {
    setValue(QuickQuotationStateNames.personId, personId);
    setShowCreatePersonForm(false);
  };

  return (
    <Grid container>
      <If condition={!showCreatePersonForm}>
        <Grid item container display='flex' xs={12} md={6}>
          <Grid item className='mb-2'>
            <Typography
              data-testid={quickProposalIds.quickProposalIsPersonAvailableTitle}
              variant='titleSmallBold'
              className='text-secondary'
            >
              {t('quotations.quickQuotation.isPersonAvailable')}
            </Typography>
          </Grid>

          <Grid
            container
            padding={3}
            className='rounded bg-grey-8'
            item
            xs={12}
          >
            <Grid item xs={12} className='mb-4'>
              <AutocompleteWithController
                testId='find-person-text-field'
                name={QuickQuotationStateNames.personDetails}
                control={control}
                label={t('quotations.quickQuotation.findPerson')}
                options={options}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                getOptionLabel={(option) =>
                  mergeStrings({
                    values: [
                      option.firstName,
                      option.middleName,
                      option.lastName,
                    ],
                  })
                }
                onInputChange={onInputChange}
                loading={loading}
                renderOption={RenderPersonOption}
                noOptionsText={
                  <Button onClick={onCreateNewPerson} variant='text'>
                    <Typography
                      variant='textMediumBold'
                      className='normal-case text-primary'
                    >
                      {t('quotations.quickQuotation.createNewPerson')}
                    </Typography>
                  </Button>
                }
                onOpen={onOpen}
                // Note: this disables the built-in filtering of the Autocomplete component
                filterOptions={(x) => x}
              />
            </Grid>

            <Grid item xs={12}>
              <Button onClick={onCreateNewPerson} variant='text'>
                <Typography
                  variant='textMediumBold'
                  className='normal-case text-primary'
                >
                  {t('quotations.quickQuotation.createNewPerson')}
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </If>
      <If condition={showCreatePersonForm}>
        {/* <Grid item container display='flex' xs={6}> */}
        <Grid item className='mb-2' xs={12} md={8}>
          <Typography variant='titleSmallBold' className='text-secondary'>
            {t('quotations.quickQuotation.isPersonAvailable')}
          </Typography>
        </Grid>
        {/* </Grid> */}

        <Grid item container display='flex' xs={12} md={6}>
          <Grid
            item
            container
            padding={3}
            display='flex'
            alignItems='center'
            className='mb-8 rounded bg-grey-8'
          >
            <Grid item xs={8}>
              <Typography variant='textMedium' className='text-secondary'>
                {t('quotations.quickQuotation.PersonalDetailsStill')}
              </Typography>
            </Grid>
            <Grid container item xs={4}>
              <Button
                className='ml-auto'
                onClick={onChangePerson}
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
        </Grid>
        <Grid item xs={12} className='mb-4'>
          <Typography variant='titleMediumBold'>
            {t('quotations.quickQuotation.enterPersonDetails')}
          </Typography>
        </Grid>
        <Grid item xs={12} className='mb-2'>
          <CreatePersonQQ
            onCancel={onCancelCreatePerson}
            onSuccess={onCreatePersonSuccess}
          />
        </Grid>
      </If>
    </Grid>
  );
};

export default FindPersonSection;
