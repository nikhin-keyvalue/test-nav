import { Typography } from '@AM-i-B-V/ui-kit';
import { Grid, Link } from '@mui/material';
import { useParams } from 'next/navigation';

import DetailBlock from '@/components/blocks/DetailBlock';
import EditButton from '@/components/EditButton';
import { useTranslations } from '@/hooks/translation';
import { mergeStrings } from '@/utils/common';
import { formatDate } from '@/utils/date';

import { DeliveryStatusEnum } from '../api/constants';
import { DeliveryResponse } from '../api/type';

const DeliveryDetailsBlock = ({
  deliveryDetails,
}: {
  deliveryDetails: DeliveryResponse;
}) => {
  const { id: deliveryId } = useParams();
  const t = useTranslations();

  const displaySalespersons = () =>
    deliveryDetails?.salespersons?.length
      ? mergeStrings({
          values: deliveryDetails?.salespersons?.map((salesperson) =>
            mergeStrings({
              values: [salesperson?.firstName, salesperson?.lastName],
            })
          ),
          separator: ', ',
        })
      : '-';

  const isImmutable =
    deliveryDetails?.status === DeliveryStatusEnum.DELIVERED ||
    deliveryDetails?.status === DeliveryStatusEnum.ORDER_REJECTED;

  return (
    <DetailBlock
      title='Delivery details'
      button={
        <EditButton
          disabled={isImmutable}
          href={`/deliveries/${deliveryId}/edit`}
        />
      }
      needAccordion={false}
    >
      <Grid container>
        <Grid item xs={6} pb={2}>
          <Typography variant='textSmall' className='text-grey-56'>
            {t('common.name')}
          </Typography>
          <Typography variant='textMedium' className='text-secondary'>
            {deliveryDetails.name}
          </Typography>
        </Grid>

        <Grid item xs={6} pb={2}>
          <Typography variant='textSmall' className='text-grey-56'>
            {t('filters.status')}
          </Typography>
          <Typography variant='textMedium' className='text-secondary'>
            {deliveryDetails.status
              ? t(`deliveries.deliveryStatus.${deliveryDetails.status}`)
              : '-'}
          </Typography>
        </Grid>

        <Grid container xs={6} pb={2}>
          <Grid item xs={6}>
            <Typography variant='textSmall' className='text-grey-56'>
              {t('deliveries.dealerArrivalDate')}
            </Typography>
            <Typography variant='textMedium' className='text-secondary'>
              {deliveryDetails.dealerArrivalDate
                ? formatDate(deliveryDetails.dealerArrivalDate, 'DD MMM YYYY')
                : '-'}
            </Typography>
            <Typography variant='textSmall' className='text-secondary'>
              {t('navBar.expected')}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='textSmall' className='text-grey-56'>
              {t('deliveries.customerDeliveryDate')}
            </Typography>
            <Typography variant='textMedium' className='text-secondary'>
              {deliveryDetails.customerDeliveryDate
                ? formatDate(
                    deliveryDetails.customerDeliveryDate,
                    'DD MMM YYYY'
                  )
                : '-'}
            </Typography>
            <Typography variant='textSmall' className='text-secondary'>
              {t('navBar.expected')}
            </Typography>
          </Grid>
        </Grid>

        <Grid container xs={6} pb={2}>
          <Grid item xs={6}>
            <Typography variant='textSmall' className='text-grey-56'>
              {t('deliveries.doNotDeliverBefore')}
            </Typography>
            <Typography variant='textMedium' className='text-secondary'>
              {deliveryDetails.doNotDeliverBefore
                ? formatDate(deliveryDetails.doNotDeliverBefore, 'DD MMM YYYY')
                : '-'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='textSmall' className='text-grey-56'>
              {t('stock.orderTransport.currentLocation')}
            </Typography>
            <Typography variant='textMedium' className='text-secondary'>
              {deliveryDetails.currentLocation ?? '-'}
            </Typography>
          </Grid>
        </Grid>

        <Grid item xs={6} pb={2}>
          <Typography variant='textSmall' className='text-grey-56'>
            {t('common.customer')}
          </Typography>
          {deliveryDetails?.customer?.id ? (
            <Typography variant='textMediumBold' className='text-primary'>
              <Link href={`/persons/${deliveryDetails?.customer?.id}/details`}>
                {mergeStrings({
                  values: [
                    deliveryDetails?.customer?.firstName,
                    deliveryDetails?.customer?.middleName,
                    deliveryDetails?.customer?.lastName,
                  ],
                })}
              </Link>
            </Typography>
          ) : (
            <div className='text-secondary'>-</div>
          )}
        </Grid>

        <Grid item xs={6} pb={2}>
          <Typography variant='textSmall' className='text-grey-56'>
            {t('opportunities.customerType')}
          </Typography>

          {deliveryDetails?.organisation?.name ? (
            <Typography variant='textMedium' className='text-secondary'>
              {t('filters.Business')} {t('opportunities.customerFor')}{' '}
              <Typography
                variant='textMediumBold'
                className='inline text-primary'
              >
                <Link
                  href={`/organisations/${deliveryDetails?.organisation?.id}/details`}
                >
                  {deliveryDetails?.organisation?.name || '-'}
                </Link>
              </Typography>
            </Typography>
          ) : (
            '-'
          )}
        </Grid>

        <Grid item xs={6} pb={2}>
          <Typography variant='textSmall' className='text-grey-56'>
            {t('filters.Dealer')}
          </Typography>
          <Typography variant='textMedium' className='text-secondary'>
            {deliveryDetails.dealer ? deliveryDetails.dealer.dealerName : '-'}
          </Typography>
        </Grid>

        <Grid item xs={6} pb={2}>
          <Typography variant='textSmall' className='text-grey-56'>
            {t('opportunities.salesperson(s)')}
          </Typography>
          <Typography variant='textMedium' className='text-secondary'>
            {displaySalespersons()}
          </Typography>
        </Grid>

        <Grid item xs={6} pb={2}>
          <Typography variant='textSmall' className='text-grey-56'>
            {t('filters.LeasingCompany')}
          </Typography>
          {deliveryDetails?.leasingCompany?.name ? (
            <Typography variant='textMediumBold' className='text-primary'>
              <Link
                href={`/organisations/${deliveryDetails?.leasingCompany?.id}/details`}
              >
                {deliveryDetails?.leasingCompany?.name}
              </Link>
            </Typography>
          ) : (
            <div className='text-secondary'>-</div>
          )}
        </Grid>

        <Grid item xs={6} pb={2}>
          <Typography variant='textSmall' className='text-grey-56'>
            {t('deliveries.leaseContactPerson(s)')}
          </Typography>
          <Typography
            variant='textMediumBold'
            className={
              deliveryDetails?.leaseContactPersons
                ? 'text-primary'
                : 'text-secondary'
            }
          >
            {deliveryDetails?.leaseContactPersons ?? '-'}
          </Typography>
        </Grid>

        <Grid item xs={6} pb={2}>
          <Typography variant='textSmall' className='text-grey-56'>
            {t('deliveries.leaseOrderNumber')}
          </Typography>
          <Typography variant='textMedium' className='text-secondary'>
            {deliveryDetails.leaseOrderNumber ?? '-'}
          </Typography>
        </Grid>

        <Grid item xs={6} pb={2}>
          <Typography variant='textSmall' className='text-grey-56'>
            {t('deliveries.leaseSystem')}
          </Typography>
          <Typography
            variant='textMediumBold'
            className={
              deliveryDetails?.leaseSystem ? 'text-primary' : 'text-secondary'
            }
          >
            {deliveryDetails.leaseSystem ?? '-'}
          </Typography>
        </Grid>

        <Grid container xs={6} pb={2}>
          <Grid item xs={6}>
            <Typography variant='textSmall' className='text-grey-56'>
              {t('deliveries.ascriptionCode')}
            </Typography>
            <Typography variant='textMedium' className='text-secondary'>
              {deliveryDetails.ascriptionCode ?? '-'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='textSmall' className='text-grey-56'>
              {t('deliveries.licenseCardNumber')}
            </Typography>
            <Typography variant='textMedium' className='text-secondary'>
              {deliveryDetails.licenseCardNumber ?? '-'}
            </Typography>
          </Grid>
        </Grid>

        <Grid item xs={6} pb={2}>
          <Typography variant='textSmall' className='text-grey-56'>
            {t('deliveries.ottCode')}
          </Typography>
          <Typography variant='textMedium' className='text-secondary'>
            {deliveryDetails.ottCode ?? '-'}
          </Typography>
        </Grid>

        <Grid item xs={6} pb={2}>
          <Typography variant='textSmall' className='text-grey-56'>
            {t('deliveries.seller')}
          </Typography>
          <Typography
            variant='textMediumBold'
            className={
              deliveryDetails?.seller ? 'text-primary' : 'text-secondary'
            }
          >
            {deliveryDetails.seller ?? '-'}
          </Typography>
        </Grid>

        <Grid item xs={6} pb={2}>
          <Typography variant='textSmall' className='text-grey-56'>
            {t('common.additionalRelations')}
          </Typography>
          <Typography variant='textMedium' className='text-secondary'>
            {deliveryDetails.additionalComments ?? '-'}
          </Typography>
        </Grid>
      </Grid>
    </DetailBlock>
  );
};

export default DeliveryDetailsBlock;
