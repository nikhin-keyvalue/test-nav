import { Typography } from '@AM-i-B-V/ui-kit';
import { Grid, Tooltip } from '@mui/material';
import Link from 'next/link';

import { useTranslations } from '@/hooks/translation';
import { mergeStrings } from '@/utils/common';

import { opportunityTestIds } from '../../../../tests/e2e/constants/testIds';
import { OpportunityDetails } from '../api/type';

const OpportunityDetailsBlock = ({
  opportunityDetails,
}: {
  opportunityDetails: OpportunityDetails;
}) => {
  const t = useTranslations();

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

  return (
    <Grid container mt={1} rowGap={2} columnGap={1}>
      <Grid item xs={5.9}>
        <Typography variant='textSmall' className='text-grey-56'>
          {t('common.name')}
        </Typography>
        <Tooltip title={opportunityDetails?.name}>
          <Typography
            data-testid={opportunityTestIds.opportunityDetailsBlockNameValue}
            variant='textMedium'
            className='truncate text-secondary'
          >
            {opportunityDetails?.name || '-'}
          </Typography>
        </Tooltip>
      </Grid>
      <Grid item xs={5.9}>
        <Typography variant='textSmall' className='text-grey-56'>
          {t('filters.status')}
        </Typography>
        <Typography
          data-testid={opportunityTestIds.opportunityDetailsBlockStatusValue}
          variant='textMedium'
          className='text-secondary'
        >
          {t(`opportunityStatus.${opportunityDetails?.status}`) || '-'}
        </Typography>
      </Grid>
      <Grid item xs={5.9}>
        <Typography variant='textSmall' className='text-grey-56'>
          {t('common.customer')}
        </Typography>
        {opportunityDetails?.customer?.id ? (
          <Link
            data-testid={
              opportunityTestIds.opportunityDetailsBlockCustomerNameValue
            }
            href={`/persons/${opportunityDetails?.customer?.id}/details`}
          >
            <Tooltip
              title={mergeStrings({
                values: [
                  opportunityDetails?.customer?.firstName,
                  opportunityDetails?.customer?.middleName,
                  opportunityDetails?.customer?.lastName,
                ],
              })}
            >
              <Typography
                variant='textMediumBold'
                className='truncate text-primary'
              >
                {mergeStrings({
                  values: [
                    opportunityDetails?.customer?.firstName,
                    opportunityDetails?.customer?.middleName,
                    opportunityDetails?.customer?.lastName,
                  ],
                })}
              </Typography>
            </Tooltip>
          </Link>
        ) : (
          <div className='text-secondary'>-</div>
        )}
      </Grid>
      <Grid item xs={5.9}>
        <Typography variant='textSmall' className='text-grey-56'>
          {t('opportunities.customerType')}
        </Typography>

        <Typography
          data-testid='opportunity-details-block-customer-type-value'
          variant='textMedium'
          className='text-secondary'
        >
          {opportunityDetails?.type ?? '-'}
          {opportunityDetails?.organisation?.name && (
            <>
              {` ${t('opportunities.customerFor')} `}
              <Link
                href={`/organisations/${opportunityDetails?.organisation?.id}/details`}
              >
                <Tooltip title={opportunityDetails?.organisation?.name}>
                  <Typography
                    variant='textMediumBold'
                    className='inline truncate text-primary'
                  >
                    {opportunityDetails?.organisation?.name || '-'}
                  </Typography>
                </Tooltip>
              </Link>
            </>
          )}
        </Typography>
      </Grid>
      <Grid item xs={5.9}>
        <Typography variant='textSmall' className='text-grey-56'>
          {t('common.dealer')}
        </Typography>
        <Tooltip title={opportunityDetails?.dealer?.dealerName}>
          <Typography
            data-testid='opportunity-details-block-dealer-name-value'
            variant='textMedium'
            className='truncate text-secondary'
          >
            {opportunityDetails?.dealer?.dealerName || '-'}
          </Typography>
        </Tooltip>
      </Grid>
      <Grid item xs={5.9}>
        <Typography variant='textSmall' className='text-grey-56'>
          {t('opportunities.salesperson(s)')}
        </Typography>
        <Tooltip title={displaySalespersons()}>
          <Typography
            data-testid='opportunity-details-block-sales-persons-value'
            variant='textMedium'
            className='truncate text-secondary'
          >
            {displaySalespersons()}
          </Typography>
        </Tooltip>
      </Grid>
      <Grid item xs={5.9}>
        <Typography variant='textSmall' className='text-grey-56'>
          {t('filters.LeasingCompany')}
        </Typography>
        {opportunityDetails?.leasingCompany?.name ? (
          <Link
            href={`/organisations/${opportunityDetails?.leasingCompany?.id}/details`}
          >
            <Tooltip title={opportunityDetails?.leasingCompany?.name}>
              <Typography
                data-testid={
                  opportunityTestIds.opportunityDetailsBlockLeasingCompanyName
                }
                variant='textMediumBold'
                className='truncate text-primary'
              >
                {opportunityDetails?.leasingCompany?.name}
              </Typography>
            </Tooltip>
          </Link>
        ) : (
          <div className='text-secondary'>-</div>
        )}
      </Grid>
      <Grid item xs={5.9}>
        <Typography variant='textSmall' className='text-grey-56'>
          {t('opportunities.additionalRelations')}
        </Typography>
        <Tooltip title={opportunityDetails?.additionalComments}>
          <Typography
            data-testid='opportunity-details-block-additional-comments-value'
            variant='textMediumBold'
            className='truncate text-secondary'
          >
            {opportunityDetails?.additionalComments || '-'}
          </Typography>
        </Tooltip>
      </Grid>
    </Grid>
  );
};

export default OpportunityDetailsBlock;
