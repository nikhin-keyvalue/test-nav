import { Button, Typography } from '@AM-i-B-V/ui-kit';
import { Grid } from '@mui/material';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import { quickProposalIds } from '@test/constants/testIds';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MdOutlineCreate } from 'react-icons/md';

import { useTranslations } from '@/hooks/translation';
import { PersonsDetails } from '@/types/api';
import { mergeStrings } from '@/utils/common';
import { formatDate } from '@/utils/date';

const PersonDetailsBlock = (props: {
  personDetails: PersonsDetails | undefined | null;
  inQuickQuotation?: boolean;
  disableEdit?: boolean;
  editActionText?: string;
  onEditClick?: () => void;
}) => {
  const t = useTranslations();
  const router = useRouter();
  const {
    personDetails,
    inQuickQuotation,
    disableEdit = false,
    editActionText,
    onEditClick,
  } = props;

  const primaryPhone = personDetails?.phoneNumbers?.find(
    (phone) => phone.isPrimary
  );
  const primaryAddress = personDetails?.addresses?.find(
    (address) => address.isPrimary
  );
  const primaryAddressToDisplay = Object.values(primaryAddress || {})
    .filter((value) => typeof value !== 'boolean')
    .join(', ');

  const secondaryAddress = personDetails?.addresses?.find(
    (address) => !address.isPrimary
  );
  const secondaryAddressToDisplay = Object.values(secondaryAddress || {})
    .filter((value) => typeof value !== 'boolean')
    .join(', ');

  const primaryEmail = personDetails?.emails?.find((email) => email.isPrimary);
  const secondaryEmail = personDetails?.emails?.find(
    (email) => !email.isPrimary
  );
  const secondaryPhone = personDetails?.phoneNumbers?.find(
    (phone) => !phone.isPrimary
  );

  return (
    <Paper className='rounded p-6 pt-2 shadow'>
      <div data-testid='person-details-block'>
        {inQuickQuotation ? (
          <div className='person-detail-header mt-4 flex justify-between'>
            <div className='flex-col'>
              <Typography
                data-testid={quickProposalIds.quickProposalPersonDetailsTitle}
                variant='textSmallBold'
                className='text-secondary'
              >
                {t('personDetails.title')}
              </Typography>
              <Typography variant='titleMediumBold' className='text-secondary'>
                {mergeStrings({
                  values: [
                    personDetails?.firstName,
                    personDetails?.middleName,
                    personDetails?.lastName,
                  ],
                })}
              </Typography>
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
          </div>
        ) : (
          <div className='person-detail-header mt-4 flex justify-between'>
            <Typography variant='titleMediumBold' className='text-secondary'>
              {t('personDetails.title')}
            </Typography>
            {!disableEdit && (
              <Button
                className='flex gap-1'
                color='secondary'
                variant='outlined'
                onClick={() => router.push('edit')}
                sx={{ textTransform: 'none' }}
              >
                <MdOutlineCreate size='1.25rem' />
                <Typography variant='titleSmallBold'>
                  {t('common.edit')}
                </Typography>
              </Button>
            )}
          </div>
        )}
        <div className='person-detail-body mt-4 flex flex-col'>
          <div className='mb-4 flex-col justify-between'>
            <Grid container>
              <Grid item lg={3} md={4} xs={6}>
                <div className='mb-3.5'>
                  <Typography variant='textSmall' className='text-grey-56'>
                    {t('common.initials')}
                  </Typography>
                  <Tooltip title={personDetails?.initials}>
                    <Typography
                      variant='textMedium'
                      className='text-secondary'
                      data-testid='initials-value'
                    >
                      {personDetails?.initials ?? '-'}
                    </Typography>
                  </Tooltip>
                </div>
              </Grid>
              <Grid item lg={3} md={4} xs={6}>
                <div className='mb-3.5 '>
                  <Typography variant='textSmall' className='text-grey-56'>
                    {t('personDetails.firstName')}
                  </Typography>
                  <Tooltip title={personDetails?.firstName}>
                    <Typography
                      variant='textMedium'
                      className='text-secondary'
                      data-testid='first-name-value'
                    >
                      {personDetails?.firstName ?? '-'}
                    </Typography>
                  </Tooltip>
                </div>
              </Grid>
              <Grid item lg={3} md={4} xs={6}>
                <div className='mb-3.5 '>
                  <Typography variant='textSmall' className='text-grey-56'>
                    {t('personDetails.middleName')}
                  </Typography>
                  <Tooltip title={personDetails?.middleName}>
                    <Typography variant='textMedium' className='text-secondary'>
                      {personDetails?.middleName ?? '-'}
                    </Typography>
                  </Tooltip>
                </div>
              </Grid>
              <Grid item lg={3} md={4} xs={6}>
                <div className='mb-3.5 '>
                  <Typography variant='textSmall' className='text-grey-56'>
                    {t('personDetails.lastName')}
                  </Typography>
                  <Tooltip title={personDetails?.lastName}>
                    <Typography
                      variant='textMedium'
                      className='text-secondary'
                      data-testid='last-name-value'
                    >
                      {personDetails?.lastName}
                    </Typography>
                  </Tooltip>
                </div>
              </Grid>
              <Grid item lg={3} md={4} xs={6}>
                <div className='mb-3.5 '>
                  <Typography variant='textSmall' className='text-grey-56'>
                    {t('common.gender')}
                  </Typography>
                  <Tooltip title={personDetails?.gender}>
                    <Typography
                      variant='textMedium'
                      className='text-secondary'
                      data-testid='gender-value'
                    >
                      {personDetails?.gender}
                    </Typography>
                  </Tooltip>
                </div>
              </Grid>
              <Grid item lg={3} md={4} xs={6}>
                <div className='mb-3.5 '>
                  <Typography variant='textSmall' className='text-grey-56'>
                    {t('personDetails.dateOfBirth')}
                  </Typography>
                  <Tooltip title=''>
                    <Typography
                      variant='textMedium'
                      className='text-secondary'
                      data-testid='dob-value'
                    >
                      {personDetails?.dateOfBirth
                        ? formatDate(personDetails?.dateOfBirth)
                        : '-'}
                    </Typography>
                  </Tooltip>
                </div>
              </Grid>
              <Grid item lg={3} md={4} xs={6}>
                <div className='flex-col'>
                  <Typography variant='textSmall' className='text-grey-56'>
                    {t('personDetails.tutoyeren')}
                  </Typography>
                  <Tooltip title={personDetails?.politeForm}>
                    <Typography
                      variant='textMedium'
                      className='text-secondary'
                      data-testid='title-value'
                    >
                      {personDetails?.politeForm}
                    </Typography>
                  </Tooltip>
                </div>
              </Grid>
              <Grid item lg={3} md={4} xs={6}>
                <div className='flex-col'>
                  <Typography variant='textSmall' className='text-grey-56'>
                    {t('personDetails.driversLicense')}
                  </Typography>
                  <Tooltip title={personDetails?.driversLicenseNumber}>
                    <Typography
                      variant='textMedium'
                      className='text-secondary'
                      data-testid='drivers-license-number-value'
                    >
                      {personDetails?.driversLicenseNumber ?? '-'}
                    </Typography>
                  </Tooltip>
                </div>
              </Grid>
              <Grid item lg={3} md={4} xs={6}>
                <div className='flex-col'>
                  <Typography variant='textSmall' className='text-grey-56'>
                    {t('personDetails.licenseExpires')}
                  </Typography>
                  <Tooltip title={personDetails?.driversLicenseExpiry}>
                    <Typography
                      variant='textMedium'
                      className='text-secondary'
                      data-testid='drivers-license-expiry-value'
                    >
                      {personDetails?.driversLicenseExpiry
                        ? formatDate(personDetails?.driversLicenseExpiry)
                        : '-'}
                    </Typography>
                  </Tooltip>
                </div>
              </Grid>
            </Grid>
          </div>
          <Grid container rowGap={2}>
            <Grid item xs={6} md={6} lg={6}>
              <div className='mb-[5px] flex flex-col'>
                <Typography variant='textSmall' className='text-grey-56'>
                  {t('personDetails.personType')}
                </Typography>
                {personDetails?.organisation?.name ? (
                  <div className='inline-flex gap-1'>
                    <Typography variant='textMedium' className='text-secondary'>
                      {personDetails?.type} customer for{' '}
                      <Typography
                        variant='textMediumBold'
                        className='inline text-primary'
                      >
                        <Link
                          href={`/organisations/${personDetails?.organisation?.id}/details`}
                        >
                          {personDetails?.organisation?.name || '-'}
                        </Link>
                      </Typography>
                    </Typography>
                  </div>
                ) : (
                  <div
                    className='text-secondary'
                    data-testid='person-type-value'
                  >
                    {personDetails?.type}
                  </div>
                )}
              </div>
            </Grid>
            <Grid item xs={6} md={6} lg={6}>
              <div className='mb-[5px] flex w-[50%] flex-col'>
                <Typography variant='textSmall' className='text-grey-56'>
                  {t('personDetails.status')}
                </Typography>
                <Typography
                  variant='textMedium'
                  className='text-secondary'
                  data-testid='status-value'
                >
                  {personDetails?.isActive ? 'Active' : 'Inactive'}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <div className='mb-[5px] flex w-[90%] flex-col'>
                <Typography variant='textSmall' className='text-grey-56'>
                  {t('personDetails.addressPrimary')}
                </Typography>
                <Typography
                  variant='textMedium'
                  className='text-secondary'
                  data-testid='primary-address-value'
                >
                  {primaryAddressToDisplay || '-'}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <div className='mb-[5px] flex w-[90%] flex-col'>
                <Typography variant='textSmall' className='text-grey-56'>
                  {t('common.addressAlternative')}
                </Typography>
                <Typography
                  variant='textMedium'
                  className='text-secondary'
                  data-testid='alternate-address-value'
                >
                  {secondaryAddressToDisplay || '-'}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <div className='mb-[5px] flex w-[50%] flex-col'>
                <Typography variant='textSmall' className='text-grey-56'>
                  {t('common.phonePrimary')}
                </Typography>
                <Typography
                  variant='textMedium'
                  className='text-secondary'
                  data-testid='primary-phone-number-value'
                >
                  {primaryPhone?.number || '-'}
                </Typography>
              </div>
            </Grid>
            <Grid item>
              <div className='flex flex-col'>
                <Typography variant='textSmall' className='text-grey-56'>
                  {t('common.phoneAlternative')}
                </Typography>
                <Typography
                  variant='textMedium'
                  className='text-secondary'
                  data-testid='secondary-phone-number-value'
                >
                  {secondaryPhone?.number || '-'}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <div className='mb-[5px] flex flex-col'>
                <Typography variant='textSmall' className='text-grey-56'>
                  {t('common.emailPrimary')}
                </Typography>
                <Typography
                  variant='textMediumBold'
                  className='text-primary'
                  data-testid='primary-email-value'
                >
                  <a
                    href={
                      primaryEmail?.email ? `mailto:${primaryEmail?.email}` : ''
                    }
                  >
                    {primaryEmail?.email || '-'}
                  </a>
                </Typography>
              </div>
            </Grid>
            <Grid item>
              <div className='flex flex-col'>
                <Typography variant='textSmall' className='text-grey-56'>
                  {t('common.emailAlternative')}
                </Typography>
                <Typography
                  variant='textMedium'
                  className='text-secondary'
                  data-testid='secondary-email-value'
                >
                  {secondaryEmail?.email || '-'}
                </Typography>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </Paper>
  );
};

export default PersonDetailsBlock;
