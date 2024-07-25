import { Typography } from '@AM-i-B-V/ui-kit';
import { Button, Paper, Tooltip } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MdOutlineCreate } from 'react-icons/md';

import If from '@/components/If';
import { useTranslations } from '@/hooks/translation';
import { IOrganisationDetails } from '@/types/api';

const OrganisationDetailsBlock = ({
  organisationDetails,
  inQuickQuotation,
  disableEdit,
  editActionText,
  onEditClick,
}: {
  organisationDetails: IOrganisationDetails;
  inQuickQuotation?: boolean;
  disableEdit?: boolean;
  editActionText?: string;
  onEditClick?: () => void;
}) => {
  const router = useRouter();
  const t = useTranslations();

  const primaryAddress = organisationDetails.addresses?.find(
    (address) => address.isPrimary
  );
  const primaryAddressToDisplay = Object.values(primaryAddress || {})
    .filter((value) => typeof value !== 'boolean')
    .join(', ');

  const primaryPhone = organisationDetails.phoneNumbers?.find(
    (phone) => phone.isPrimary
  );
  const secondaryPhone = organisationDetails.phoneNumbers?.find(
    (phone) => !phone.isPrimary
  );
  const secondaryAddress = organisationDetails.addresses?.find(
    (address) => !address.isPrimary
  );
  const primaryEmail = organisationDetails.emails?.find(
    (email) => email.isPrimary
  );
  const secondaryEmail = organisationDetails.emails?.find(
    (email) => !email.isPrimary
  );
  const secondaryAddressToDisplay = Object.values(secondaryAddress || {})
    .filter((value) => typeof value !== 'boolean')
    .join(', ');

  return (
    <div
      className='inline-flex min-w-full flex-col items-start justify-start gap-4'
      data-testid='organisation-details-block'
    >
      <div className='w-full'>
        <Paper className='min-h-full w-full min-w-full rounded p-6 pt-2 shadow'>
          <div className='inline-flex w-full items-start justify-start gap-2 pt-2'>
            <If condition={!!inQuickQuotation}>
              <div className='mb-3 h-8 shrink grow basis-0 flex-col items-start justify-start pt-1'>
                <div className='leading-7 text-gray-700'>
                  <Typography
                    variant='textSmallBold'
                    className='text-secondary'
                    data-testid='organisation-details-title'
                  >
                    {t('common.organisation')}
                  </Typography>
                </div>
                <div className='leading-7 text-gray-700'>
                  <Typography
                    variant='titleMediumBold'
                    className='text-secondary'
                    data-testid='organisation-details-title'
                  >
                    {organisationDetails.name}
                  </Typography>
                </div>
              </div>
              <div className='flex items-start justify-start px-1 pb-0.5'>
                {!disableEdit && (
                  <Button
                    className='flex gap-1 border-none capitalize hover:border-none hover:bg-inherit'
                    onClick={() => {
                      if (onEditClick) onEditClick();
                    }}
                  >
                    <Typography variant='titleSmallBold'>
                      {editActionText || t('common.edit')}
                    </Typography>
                  </Button>
                )}
              </div>
            </If>
            <If condition={!inQuickQuotation}>
              <>
                <div className='flex h-8 shrink grow basis-0 items-start justify-start pt-1'>
                  <div className='leading-7 text-gray-700'>
                    <Typography
                      variant='titleMediumBold'
                      className='text-secondary'
                      data-testid='organisation-details-title'
                    >
                      {t('organisationDetails.title')}
                    </Typography>
                  </div>
                </div>
                <div className='flex items-start justify-start px-1 pb-0.5'>
                  {!disableEdit && (
                    <Button
                      className='flex gap-1'
                      color='secondary'
                      variant='outlined'
                      onClick={() => router.push('edit')}
                      data-testid='organisation-details-edit-btn'
                      sx={{ textTransform: 'none' }}
                    >
                      <MdOutlineCreate size='1.25rem' />
                      <Typography variant='titleSmallBold'>
                        {t('common.edit')}
                      </Typography>
                    </Button>
                  )}
                </div>
              </>
            </If>
          </div>
          <div className='my-4 flex w-full flex-col'>
            <div className='flex flex-col md:flex-row'>
              <div className='mb-4 w-full md:w-1/2'>
                <Typography variant='textSmall' className='text-grey-56'>
                  {t('common.name')}
                </Typography>
                <Tooltip title={organisationDetails.name}>
                  <Typography
                    variant='textMedium'
                    className='text-secondary'
                    data-testid='first-name-value'
                  >
                    {organisationDetails?.name || '-'}
                  </Typography>
                </Tooltip>
              </div>
              <div className='flex w-full gap-5 md:w-1/2'>
                <div className='mb-4 flex w-1/2 flex-1 flex-col'>
                  <Typography variant='textSmall' className='text-grey-56'>
                    {t('common.kvkNumber')}
                  </Typography>
                  <Tooltip
                    title={organisationDetails.KvKNumber}
                    data-testid='kvk-number-value'
                  >
                    <Typography variant='textMedium' className='text-secondary'>
                      {organisationDetails?.KvKNumber || '-'}
                    </Typography>
                  </Tooltip>
                </div>
                <div className='mb-4 flex w-1/2 flex-1 flex-col'>
                  <Typography variant='textSmall' className='text-grey-56'>
                    {t('common.vatNumber')}
                  </Typography>
                  <Tooltip title={organisationDetails.VATNumber}>
                    <Typography
                      variant='textMedium'
                      className='text-secondary'
                      data-testid='vat-number-value'
                    >
                      {organisationDetails?.VATNumber || '-'}
                    </Typography>
                  </Tooltip>
                </div>
              </div>
            </div>
            <div className='flex flex-col md:flex-row'>
              <div className='mb-4 flex w-full flex-col md:w-1/2'>
                <Typography variant='textSmall' className='text-grey-56'>
                  {t('common.website')}
                </Typography>
                <Tooltip title={organisationDetails.website}>
                  <Link
                    href={organisationDetails?.website || ''}
                    target='_blank'
                  >
                    <Typography
                      variant='textMediumBold'
                      className='text-primary'
                      data-testid='website-value'
                    >
                      {organisationDetails?.website || '-'}
                    </Typography>
                  </Link>
                </Tooltip>
              </div>
              <div className='flex w-full gap-5 md:w-1/2'>
                <div className='mb-4 flex flex-1 flex-col'>
                  <Typography variant='textSmall' className='text-grey-56'>
                    {t('common.organisationType')}
                  </Typography>
                  <Tooltip title={organisationDetails.type}>
                    <Typography
                      variant='textMedium'
                      className='text-secondary'
                      data-testid='organisation-type-value'
                    >
                      {organisationDetails.type}
                    </Typography>
                  </Tooltip>
                </div>
                <div className='mb-4 flex flex-1 flex-col'>
                  <Typography variant='textSmall' className='text-grey-56'>
                    {t('filters.status')}
                  </Typography>
                  <Tooltip
                    title={organisationDetails.isActive ? 'Active' : 'Inactive'}
                  >
                    <Typography
                      variant='textMedium'
                      className='text-secondary'
                      data-testid='status-value'
                    >
                      {organisationDetails.isActive ? 'Active' : 'Inactive'}
                    </Typography>
                  </Tooltip>
                </div>
              </div>
            </div>
            <div className='flex flex-col md:flex-row'>
              <div className='mb-4 flex w-full flex-col md:w-1/2'>
                <Typography variant='textSmall' className='text-grey-56'>
                  {t('personDetails.addressPrimary')}
                </Typography>
                <Typography
                  variant='textMedium'
                  className='min-h-[42px] text-secondary'
                  data-testid='primary-address-value'
                >
                  {primaryAddressToDisplay || '-'}
                </Typography>
              </div>
              <div className='mb-4 flex w-full flex-col md:w-1/2'>
                <Typography variant='textSmall' className='text-grey-56'>
                  {t('common.addressAlternative')}
                </Typography>
                <Typography
                  variant='textMedium'
                  className='min-h-[42px] text-secondary'
                  data-testid='alternative-address-value'
                >
                  {secondaryAddressToDisplay || '-'}
                </Typography>
              </div>
            </div>
            <div className='flex flex-row'>
              <div className='mb-4 flex w-1/2 flex-col'>
                <Typography variant='textSmall' className='text-grey-56'>
                  {t('common.phonePrimary')}
                </Typography>
                <Typography
                  variant='textMedium'
                  className='text-secondary'
                  data-testid='primary-phone-value'
                >
                  {primaryPhone?.number || '-'}
                </Typography>
              </div>
              <div className='mb-4 flex w-1/2 flex-col'>
                <Typography variant='textSmall' className='text-grey-56'>
                  {t('common.phoneAlternative')}
                </Typography>
                <Typography
                  variant='textMedium'
                  className='text-secondary'
                  data-testid='alternative-phone-value'
                >
                  {secondaryPhone?.number || '-'}
                </Typography>
              </div>
            </div>
            <div className='flex flex-col md:flex-row'>
              <div className='mb-4 flex w-1/2 flex-col'>
                <Typography variant='textSmall' className='text-grey-56' I>
                  {t('common.emailPrimary')}
                </Typography>
                <Typography variant='textMediumBold' className='text-primary'>
                  <a
                    href={
                      primaryEmail?.email ? `mailto:${primaryEmail?.email}` : ''
                    }
                    data-testid='primary-email-value'
                  >
                    {primaryEmail?.email || '-'}
                  </a>
                </Typography>
              </div>
              <div className='mb-4 flex w-1/2 flex-col'>
                <Typography variant='textSmall' className='text-grey-56'>
                  {t('common.emailAlternative')}
                </Typography>
                <Typography
                  variant='textMedium'
                  className='text-secondary'
                  data-testid='alternative-email-value'
                >
                  {secondaryEmail?.email || '-'}
                </Typography>
              </div>
            </div>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default OrganisationDetailsBlock;
