'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import { Grid, MenuItem } from '@mui/material';
import { usePathname } from 'next/navigation';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { DatePickerWithController } from '@/components';
import EllipsisMenu from '@/components/menus/EllipsisMenu';
import { Item } from '@/components/menus/types';
import SelectWithController from '@/components/select-with-controller/SelectWithController';
import TextFieldWithController from '@/components/TextFieldWithController';
import { useTranslations } from '@/hooks/translation';

import { proposalTestIds } from '../../../../tests/e2e/constants/testIds';
import {
  CreateQuotationFormSchema,
  QuotationStatus,
  QuotationStatusEnum,
} from '../api/type';
import { CreateQuotationFormNames } from '../constants';
import FinancialSummary from './FinancialSummary';

interface QuotationDetailsSectionProps {
  actions: Item[];
  isEditProposal?: boolean;
  showDiscountEllipsis?: boolean;
}

const QuotationDetailsSection: FC<QuotationDetailsSectionProps> = ({
  actions,
  isEditProposal = false,
  showDiscountEllipsis = false,
}) => {
  const t = useTranslations();
  const { control, register, watch } =
    useFormContext<CreateQuotationFormSchema>();
  const status = watch('status');
  const pathName = usePathname();

  return (
    <Grid className='rounded bg-white px-6 py-4 shadow' item>
      <Grid xs={12} item container justifyContent='space-between'>
        <Grid item>
          <Typography className='mb-5' variant='titleMediumBold'>
            {t('quotations.quotationDetails')}
          </Typography>
        </Grid>
        {showDiscountEllipsis && (
          <Grid item>
            <EllipsisMenu menuItems={actions} index={1} />
          </Grid>
        )}
      </Grid>
      <Grid className='mb-4' container item flexDirection='row' spacing={3}>
        {isEditProposal && (
          <Grid item sm={12} md={6} lg={6}>
            <TextFieldWithController
              control={control}
              testId={proposalTestIds.proposalId}
              label={t('common.proposalId')}
              fullWidth
              disabled
              {...register(CreateQuotationFormNames.PROPOSAL_ID)}
            />
          </Grid>
        )}

        <Grid item sm={12} md={6} lg={6}>
          <SelectWithController
            defaultValue={
              pathName.includes('edit') ? status : QuotationStatusEnum.CONCEPT
            }
            disabled
            control={control}
            testId={proposalTestIds.quotationStatus}
            name={CreateQuotationFormNames.STATUS}
            label={t('filters.status')}
            options={Object.values(QuotationStatusEnum)}
            renderOption={(option) => (
              <MenuItem key={option} value={option}>
                {t(`quotations.quotationStatus.${option as QuotationStatus}`)}
              </MenuItem>
            )}
          />
        </Grid>
      </Grid>

      <Grid className='mb-4' container item flexDirection='row' spacing={3}>
        <Grid item sm={12} md={6} lg={6}>
          <DatePickerWithController
            name={CreateQuotationFormNames.NEW_QUOTATION_DATE}
            testId={proposalTestIds.quotationDate}
            control={control}
            sx={{ width: '100%' }}
            format='DD/MM/YYYY'
            label={t('quotations.quotationDate')}
          />
        </Grid>
        <Grid item sm={12} md={6} lg={6}>
          <DatePickerWithController
            name={CreateQuotationFormNames.NEW_QUOTATION_VALID_UNTIL}
            testId={proposalTestIds.quotationValidUntil}
            control={control}
            sx={{ width: '100%' }}
            format='DD/MM/YYYY'
            label={t('quotations.quotationValidUntil')}
          />
        </Grid>
      </Grid>
      <FinancialSummary testId={proposalTestIds.financialSummaryInDetails} />
    </Grid>
  );
};

export default QuotationDetailsSection;
