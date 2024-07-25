import { Typography } from '@AM-i-B-V/ui-kit';
import { Button, Grid, Paper } from '@mui/material';
import { quickProposalIds } from '@test/constants/testIds';
import Link from 'next/link';
import { useFormContext } from 'react-hook-form';

import If from '@/components/If';
import { useTranslations } from '@/hooks/translation';
import { OpportunityDetails, PersonTypeStrict } from '@/types/api';
import { mergeStrings } from '@/utils/common';

import {
  opportunityDetailsResetValue,
  QuickQuotationStateNames,
} from '../../constants';
import { QuickQuotationFormSchema } from '../../types';

const QuickQuotationOpportunityDetails = ({
  opportunityDetails,
  disableEdit = false,
}: {
  opportunityDetails: OpportunityDetails;
  disableEdit?: boolean;
}) => {
  const t = useTranslations();
  const { setValue, getValues } = useFormContext<QuickQuotationFormSchema>();

  const displaySalespersons = () =>
    opportunityDetails?.salespersons?.length
      ? mergeStrings({
          values: opportunityDetails?.salespersons?.map((salesperson) =>
            mergeStrings({
              values: [salesperson?.firstName, salesperson?.lastName],
            })
          ),
          separator: ', ',
        })
      : '-';

  const removeSelectedOpportunity = () => {
    setValue(
      QuickQuotationStateNames.editOpportunityDetails,
      getValues(QuickQuotationStateNames.opportunityDetails)
    );
    setValue(
      QuickQuotationStateNames.opportunityDetails,
      opportunityDetailsResetValue
    );
  };

  return (
    <Paper className='min-h-full min-w-full rounded p-6 pt-2 shadow'>
      <div className='person-detail-header mt-4 flex justify-between'>
        <div className='flex-col'>
          <Typography variant='textSmallBold' className='text-secondary'>
            {t('quotations.quickQuotation.opportunityTitle', {
              type: t(`filters.${opportunityDetails.type as PersonTypeStrict}`),
            })}
          </Typography>
          <Typography
            data-testid={quickProposalIds.quickProposalOpportunityDetailsName}
            variant='titleMediumBold'
            className='text-secondary'
          >
            {`${opportunityDetails.name}`}
          </Typography>
        </div>
        <div className='flex items-start justify-start px-1 pb-0.5'>
          <If condition={!disableEdit}>
            <Button
              className='flex gap-1 border-none capitalize hover:border-none hover:bg-inherit'
              onClick={removeSelectedOpportunity}
            >
              <Typography variant='titleSmallBold'>
                {t('quotations.quickQuotation.edit')}
              </Typography>
            </Button>
          </If>
        </div>
      </div>
      <Grid container mt={1} rowGap={2} className='w-full'>
        <Grid item xs={6} lg={6}>
          <Typography variant='textSmall' className='text-grey-56'>
            {t('opportunities.salesperson(s)')}
          </Typography>
          <Typography variant='textMedium' className='text-secondary'>
            {displaySalespersons()}
          </Typography>
        </Grid>
        <Grid item xs={6} lg={6}>
          <Typography variant='textSmall' className='text-grey-56'>
            {t('opportunities.additionalRelations')}
          </Typography>
          <Typography variant='textMediumBold' className='text-secondary'>
            {opportunityDetails?.additionalComments || '-'}
          </Typography>
        </Grid>
        <Grid item xs={6} lg={6}>
          <Typography variant='textSmall' className='text-grey-56'>
            {t('common.dealer')}
          </Typography>
          <Typography variant='textMedium' className='text-secondary'>
            {opportunityDetails?.dealer?.dealerName || '-'}
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant='textSmall' className='text-grey-56'>
            {t('filters.LeasingCompany')}
          </Typography>
          {opportunityDetails?.leasingCompany?.name ? (
            <Typography variant='textMediumBold' className='text-primary'>
              <Link
                href={`/organisations/${opportunityDetails?.leasingCompany?.id}/details`}
              >
                {opportunityDetails?.leasingCompany?.name}
              </Link>
            </Typography>
          ) : (
            <div className='text-secondary'>-</div>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default QuickQuotationOpportunityDetails;
