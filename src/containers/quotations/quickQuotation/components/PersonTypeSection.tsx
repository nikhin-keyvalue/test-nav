import { Typography } from '@AM-i-B-V/ui-kit';
import Button from '@mui/material/Button/Button';
import Grid from '@mui/material/Grid/Grid';
import Radio from '@mui/material/Radio';
import { quickProposalIds } from '@test/constants/testIds';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import If from '@/components/If';
import { useTranslations } from '@/hooks/translation';
import { PersonType } from '@/types/common';

import { QuickQuotationStateNames } from '../../constants';
import { QuickQuotationFlows, QuickQuotationFormSchema } from '../../types';

const PersonTypeSection: FC = () => {
  const t = useTranslations();

  const { watch, setValue, reset } = useFormContext<QuickQuotationFormSchema>();

  const quotationPersonType = watch(QuickQuotationStateNames.personType);

  const onSelectCustomerType = (personType: PersonType) => {
    if (personType === 'Business') {
      setValue(QuickQuotationStateNames.personType, 'Business');
    } else if (personType === 'Private') {
      setValue(QuickQuotationStateNames.personType, 'Private');
    }
  };

  const changeQuotationPersonType = () => {
    reset({
      [QuickQuotationStateNames.personType]: undefined,
      [QuickQuotationStateNames.flow]: QuickQuotationFlows.CREATE_OPPORTUNITY,
    });
  };

  return (
    <Grid container className='mb-6' xs={12} md={6}>
      <Grid item className='mb-2'>
        <Typography variant='titleSmallBold' className='text-secondary'>
          {t('quotations.quickQuotation.isThisPrivateQuotation')}
        </Typography>
      </Grid>

      <Grid
        item
        container
        padding={3}
        display='flex'
        alignItems='center'
        className='rounded bg-grey-8'
        xs={12}
      >
        <If condition={!quotationPersonType}>
          <>
            <Grid item xs={6} md={6} lg={4}>
              <div className='flex shrink-0 items-center'>
                <Radio
                  data-testid={quickProposalIds.privateQuotationRadioButton}
                  color='secondary'
                  checked={quotationPersonType === 'Private'}
                  value
                  onChange={() => onSelectCustomerType('Private')}
                  size='small'
                  className='py-0 pl-0 pr-1.5'
                  disableRipple
                />
                <label className='cursor-pointer' htmlFor='1'>
                  <Typography variant='textMedium' className='text-secondary'>
                    {t('quotations.quickQuotation.privateQuotation')}
                  </Typography>
                </label>
              </div>
            </Grid>

            <Grid item xs={6} md={6} lg={4}>
              <div className='flex shrink-0 items-center'>
                <Radio
                  data-testid={quickProposalIds.businessQuotationRadioButton}
                  color='secondary'
                  checked={quotationPersonType === 'Business'}
                  value
                  onChange={() => onSelectCustomerType('Business')}
                  size='small'
                  className='py-0 pl-0 pr-1.5'
                  disableRipple
                />
                <label className='cursor-pointer' htmlFor='1'>
                  <Typography variant='textMedium' className='text-secondary'>
                    {t('quotations.quickQuotation.businessQuotation')}
                  </Typography>
                </label>
              </div>
            </Grid>
          </>
        </If>
        <If condition={quotationPersonType === 'Business'}>
          <>
            <Grid item xs={8}>
              <Typography variant='textMedium' className='text-secondary'>
                {t('quotations.quickQuotation.customerNeedsBusiness')}
              </Typography>
            </Grid>
            <Grid container item xs={4}>
              <Button
                className='ml-auto'
                onClick={changeQuotationPersonType}
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
          </>
        </If>
        <If condition={quotationPersonType === 'Private'}>
          <>
            <Grid item xs={8}>
              <Typography variant='textMedium' className='text-secondary'>
                {t('quotations.quickQuotation.customerNeedsPrivate')}
              </Typography>
            </Grid>
            <Grid container item xs={4}>
              <Button
                className='ml-auto'
                onClick={changeQuotationPersonType}
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
          </>
        </If>
      </Grid>
    </Grid>
  );
};

export default PersonTypeSection;
