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
import { PersonsDetails } from '@/types/api';
import { ENTITIES } from '@/types/common';
import { mergeStrings } from '@/utils/common';

import PersonDetailsBlock from './PersonDetailsBlock';

const PersonDetails = (props: {
  personDetails: PersonsDetails | undefined | null;
}) => {
  const t = useTranslations();

  const { personDetails } = props;

  return (
    <div className='w-full'>
      <FormPageHeader isDetailPage testId='person-details-page'>
        <div className='flex flex-col gap-1'>
          <Typography variant='titleLargeBold' className='text-secondary'>
            {personDetails
              ? mergeStrings({
                  values: [
                    personDetails?.firstName,
                    personDetails?.middleName,
                    personDetails?.lastName,
                  ],
                })
              : 'Person Details'}
          </Typography>
          <Typography
            variant='textMediumBold'
            className='capitalize text-secondary'
          >
            {`${personDetails?.organisation?.name || ''} `}
            <span className='h-[21px] w-[21px] rounded-[4px] bg-secondary p-1 text-center text-white'>
              {(personDetails?.opportunitiesAndDeliveries?.opportunities
                ?.length || 0) +
                (personDetails?.opportunitiesAndDeliveries?.deliveries
                  ?.length || 0)}
            </span>
            {` ${t('common.opportunities')} & ${t('common.deliveries')}`}
          </Typography>
        </div>
      </FormPageHeader>
      {personDetails ? (
        <Grid
          container
          display='flex'
          justifyContent='space-between'
          xs={12}
          gap={2}
        >
          <Grid
            item
            gap={2}
            md={5.8}
            xs={12}
            display='flex'
            flexDirection='column'
          >
            <Grid item>
              <PersonDetailsBlock personDetails={personDetails} />
            </Grid>
            <Grid item>
              <NotesSection
                noteList={personDetails?.notes}
                testId='person-details-notes'
              />
            </Grid>
          </Grid>

          <Grid
            item
            gap={2}
            md={5.8}
            xs={12}
            display='flex'
            flexDirection='column'
          >
            <Grid item>
              <OpportunitiesSection
                opportunitiesAndDeliveriesList={
                  personDetails?.opportunitiesAndDeliveries
                }
                parentEntity={ENTITIES.PERSON}
                disableAdd={!personDetails?.isActive}
              />
            </Grid>
            <Grid item>
              <DeliveriesSection
                opportunitiesAndDeliveriesList={
                  personDetails?.opportunitiesAndDeliveries
                }
              />
            </Grid>
            <Grid item>
              <ConnectionsSection
                connections={personDetails?.connections}
                parentEntity={ENTITIES.PERSON}
              />
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <div className='h-[75vh] w-full'>
          <NoData
            primaryText={t('personDetails.noPersonDataFoundPrimaryText')}
          />
        </div>
      )}
    </div>
  );
};

export default PersonDetails;
