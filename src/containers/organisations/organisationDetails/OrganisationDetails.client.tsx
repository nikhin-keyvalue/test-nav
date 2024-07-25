'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import { Grid } from '@mui/material';

import { NoData } from '@/components';
import ConnectionsSection from '@/components/blocks/connections/ConnectionSection';
import DeliveriesSection from '@/components/blocks/deliveries/DeliveriesSection';
import NotesSection from '@/components/blocks/notes/NotesSection';
import OpportunitiesSection from '@/components/blocks/opportunities/OpportunitiesSection';
import FormPageHeader from '@/components/FormPageHeader';
import { useTranslations } from '@/hooks/translation';
import { IOrganisationDetails } from '@/types/api';
import { ENTITIES } from '@/types/common';

import OrganisationDetailsBlock from './OrganisationDetailsBlock';

const Page = ({
  organisationDetails,
}: {
  organisationDetails: IOrganisationDetails | undefined | null;
}) => {
  const t = useTranslations();

  return (
    <div className='w-full'>
      <FormPageHeader isDetailPage testId='organisation-details-header'>
        <div className='flex flex-col gap-1'>
          <Typography
            variant='titleLargeBold'
            className='text-secondary'
            data-testid='organisation-title'
          >
            {`${organisationDetails?.name || ''}`}
          </Typography>
          <Typography
            variant='textMediumBold'
            className='capitalize text-secondary'
          >
            {`${t('common.organisation')} `}
            <span
              data-testid='opportunities-and-deliveries-count'
              className='h-[21px] w-[21px] rounded-[4px] bg-secondary p-1 text-center text-white'
            >
              {(organisationDetails?.opportunitiesAndDeliveries?.opportunities
                ?.length || 0) +
                (organisationDetails?.opportunitiesAndDeliveries?.deliveries
                  ?.length || 0)}
            </span>
            {` ${t('common.opportunities')} & ${t('common.deliveries')}`}
          </Typography>
        </div>
      </FormPageHeader>
      {organisationDetails ? (
        <Grid
          container
          display='flex'
          gap={2}
          xs={12}
          justifyContent='space-between'
        >
          <Grid
            item
            gap={2}
            xs={12}
            md={5.8}
            display='flex'
            flexDirection='column'
          >
            <Grid item>
              <OrganisationDetailsBlock
                organisationDetails={organisationDetails}
              />
            </Grid>
            <Grid item>
              <NotesSection
                testId='organisation-details-notes'
                noteList={organisationDetails?.notes}
              />
            </Grid>
          </Grid>

          <Grid
            item
            gap={2}
            xs={12}
            md={5.8}
            display='flex'
            flexDirection='column'
          >
            <Grid item>
              <OpportunitiesSection
                parentEntity={ENTITIES.ORGANISATION}
                testId='organisation-details-opportunities'
                disableAdd={!organisationDetails?.isActive}
                opportunitiesAndDeliveriesList={
                  organisationDetails?.opportunitiesAndDeliveries
                }
              />
            </Grid>
            <Grid item>
              <DeliveriesSection
                testId='organisation-details-deliveries'
                opportunitiesAndDeliveriesList={
                  organisationDetails?.opportunitiesAndDeliveries
                }
              />
            </Grid>
            <Grid item>
              <ConnectionsSection
                parentEntity={ENTITIES.ORGANISATION}
                testId='organisation-details-connections'
                connections={organisationDetails?.connections}
              />
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <div className='h-[75vh] w-full'>
          <NoData
            primaryText={t('common.noOrganisationDataFoundPrimaryText')}
          />
        </div>
      )}
    </div>
  );
};

export default Page;
