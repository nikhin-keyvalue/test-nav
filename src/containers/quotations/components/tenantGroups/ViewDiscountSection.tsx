import { Typography } from '@AM-i-B-V/ui-kit';
import { Grid } from '@mui/material';
import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import ReadOnlyTextField from '@/components/input-fields/ReadOnlyTextField';
import { useTranslations } from '@/hooks/translation';

import { proposalTestIds } from '../../../../../tests/e2e/constants/testIds';
import { CreateQuotationFormSchema } from '../../api/type';
import { CreateQuotationFormNames } from '../../constants';

const ViewDiscountSection: FC = () => {
  const t = useTranslations();

  const { watch: rootFormWatch } = useFormContext<CreateQuotationFormSchema>();

  const {
    TOTAL_AFTER_DISCOUNT_EXCL_VAT,
    TOTAL_AFTER_DISCOUNT_INCL_VAT,
    TOTAL_EXCL_VAT,
    TOTAL_INCL_VAT,
  } = CreateQuotationFormNames;

  const [
    totalAfterDiscountExclVAT,
    totalAfterDiscountInclVAT,
    totalExclVat,
    totalInclVat,
  ] = rootFormWatch([
    TOTAL_AFTER_DISCOUNT_EXCL_VAT,
    TOTAL_AFTER_DISCOUNT_INCL_VAT,
    TOTAL_EXCL_VAT,
    TOTAL_INCL_VAT,
  ]);

  return (
    <Grid
      container
      className={twMerge(
        'rounded bg-white px-6 py-4 shadow opacity-100 pointer-events-auto'
      )}
      item
    >
      <Grid xs={10} item>
        <Typography className='mb-5' variant='titleMediumBold'>
          {t('quotations.totalDiscount')}
        </Typography>
      </Grid>

      <Grid container className='relative'>
        <Grid
          container
          spacing={2}
          className='transition-opacity duration-150 ease-in'
        >
          <Grid item container spacing={2} sm={12} md={12} lg={12}>
            <Grid item sm={12} md={6} lg={6}>
              <ReadOnlyTextField
                testId={proposalTestIds.totalAfterDiscountExclVat}
                label={t('quotations.totalExclVAT')}
                variantType='currency'
                value={totalAfterDiscountExclVAT}
              />
            </Grid>
            <Grid item sm={12} md={6} lg={6}>
              <ReadOnlyTextField
                testId={proposalTestIds.totalAfterDiscountInclVat}
                label={t('quotations.totalInclVAT')}
                variantType='currency'
                value={totalAfterDiscountInclVAT}
              />
            </Grid>

            <Grid item sm={12} md={6} lg={6}>
              <ReadOnlyTextField
                testId={proposalTestIds.noDiscountTotalExclVat}
                label={t('quotations.noDiscountExclVAT')}
                variantType='currency'
                value={totalExclVat}
              />
            </Grid>
            <Grid item sm={12} md={6} lg={6}>
              <ReadOnlyTextField
                testId={proposalTestIds.noDiscountTotalInclVat}
                label={t('quotations.noDiscountInclVAT')}
                variantType='currency'
                value={totalInclVat}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ViewDiscountSection;
