import { Typography } from '@AM-i-B-V/ui-kit';
import { Grid, MenuItem } from '@mui/material';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import SelectWithController from '@/components/select-with-controller/SelectWithController';
import { useTranslations } from '@/hooks/translation';
import { formatCurrencyAfterRounding } from '@/utils/currency';

import { proposalTestIds } from '../../../../tests/e2e/constants/testIds';
import {
  CreateQuotationFormSchema,
  QuotationVATType,
  QuotationVATTypeEnum,
} from '../api/type';
import { CreateQuotationFormNames, VAT_PERCENTAGE } from '../constants';

interface FinancialSummaryProps {
  testId?: string;
}

const FinancialSummary: FC<FinancialSummaryProps> = ({ testId }) => {
  const t = useTranslations();
  const { control, watch } = useFormContext<CreateQuotationFormSchema>();
  const vatType = watch(CreateQuotationFormNames.VAT_TYPE);
  const totalAfterDiscountExclVat = watch(
    CreateQuotationFormNames.TOTAL_AFTER_DISCOUNT_EXCL_VAT
  );
  const totalAfterDiscountExclVatDF = formatCurrencyAfterRounding({
    value: totalAfterDiscountExclVat,
  });

  const vatAmount = watch(CreateQuotationFormNames.VAT);
  const vatAmountDF = formatCurrencyAfterRounding({
    value: vatAmount,
  });

  const totalAfterDiscountInclVat = watch(
    CreateQuotationFormNames.TOTAL_AFTER_DISCOUNT_INCL_VAT
  );

  const totalAfterDiscountInclVatDF = formatCurrencyAfterRounding({
    value: totalAfterDiscountInclVat,
  });

  const isIncludingVat = vatType === 'InclVAT';

  const excludingVatSection = (
    <Grid item sm={12} md={6} lg={6} xl={3}>
      <Typography
        variant='textSmall'
        data-testid={`${testId}${proposalTestIds.quotationTotalExclVatText}`}
        className='text-grey-56'
      >
        {t('quotations.totalExclVAT')}
      </Typography>

      <Typography
        variant={isIncludingVat ? 'textMedium' : 'titleMediumBold'}
        data-testid={`${testId}${proposalTestIds.quotationTotalExclVatValue}`}
        className='whitespace-nowrap text-secondary	'
      >
        {totalAfterDiscountExclVatDF}
      </Typography>
    </Grid>
  );

  const includingVatSection = (
    <Grid item sm={12} md={6} lg={6} xl={3}>
      <Typography
        variant='textSmall'
        className='text-grey-56'
        data-testid={`${testId}${proposalTestIds.quotationTotalInclVatText}`}
      >
        {t('quotations.totalInclVAT')}
      </Typography>
      <Typography
        variant={isIncludingVat ? 'titleMediumBold' : 'textMedium'}
        className='text-secondary'
        data-testid={`${testId}${proposalTestIds.quotationTotalInclVatValue}`}
      >
        {totalAfterDiscountInclVatDF}
      </Typography>
    </Grid>
  );

  return (
    <Grid container item flexDirection='row' spacing={3}>
      <Grid item sm={12} md={6} lg={6} xl={3}>
        <SelectWithController
          control={control}
          testId={`${testId}${proposalTestIds.quotationVATType}`}
          defaultValue={vatType}
          name={CreateQuotationFormNames.VAT_TYPE}
          label={t('quotations.allPrices')}
          options={Object.values(QuotationVATTypeEnum)}
          renderOption={(option) => (
            <MenuItem
              key={option}
              value={option}
              data-testid={`${testId}-${option}`}
            >
              {t(`quotations.quotationVATType.${option as QuotationVATType}`)}
            </MenuItem>
          )}
          required
        />
      </Grid>
      {isIncludingVat ? excludingVatSection : includingVatSection}
      <Grid item sm={12} md={6} lg={6} xl={3}>
        <Typography
          variant='textSmall'
          data-testid={`${testId}${proposalTestIds.quotationVatPercentageText}`}
          className='text-grey-56'
        >
          {t('quotations.percentageVatAmount', {
            vatPercentage: VAT_PERCENTAGE,
          })}
        </Typography>
        <Typography
          data-testid={`${testId}${proposalTestIds.quotationVatPercentageValue}`}
          variant='textMedium'
          className='text-secondary'
        >
          {vatAmountDF}
        </Typography>
      </Grid>

      {isIncludingVat ? includingVatSection : excludingVatSection}
    </Grid>
  );
};

export default FinancialSummary;
