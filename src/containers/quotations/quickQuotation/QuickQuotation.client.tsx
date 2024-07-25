'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import Box from '@mui/material/Box/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider/Divider';
import Grid from '@mui/material/Grid';
import { quickProposalIds } from '@test/constants/testIds';
import { useRouter } from 'next/navigation';
import { FC, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import If from '@/components/If';
import SpinnerScreen from '@/components/SpinnerScreen';
import SubmitLine from '@/components/SubmitLine';
import { getOpportunityDetailsById } from '@/containers/opportunities/api/actions';
import { getOrganisationDetailsById } from '@/containers/organisations/api/api';
import { getPersonDetailsById } from '@/containers/persons/api/api';
import { useTranslations } from '@/hooks/translation';
import { PersonTypeEnum } from '@/types/common';
import { showErrorToast } from '@/utils/toast';

import { QuickQuotationStateNames } from '../constants';
import {
  QuickQuotationClientProps,
  QuickQuotationFlows,
  QuickQuotationFormSchema,
} from '../types';
import CreateEditOpportunityQQ from './components/CreateEditOpportunityQQ';
import FindOpportunitySection from './components/FindOpportunitySection';
import FindOrganisation from './components/FindOrganisation';
import FindPersonSection from './components/FindPersonSection';
import OpportunityDetailsSection from './components/OpportunityDetailsSection';
import OrganisationDetailsSection from './components/OrganisationDetailsSection';
import PersonDetailsSection from './components/PersonDetailsSection';
import PersonTypeSection from './components/PersonTypeSection';
import VehicleDetails from './components/VehicleDetails';

const QuickQuotation: FC<QuickQuotationClientProps> = ({
  searchParams,
  vehicleHeaderDetails,
  vehicleImageDetails,
}) => {
  const t = useTranslations();
  const router = useRouter();
  const { vehicleId } = searchParams;

  const formMethods = useForm<QuickQuotationFormSchema>({
    defaultValues: {
      isLoading: {
        isLoadingOrganisation: false,
        isLoadingPerson: false,
        isLoadingOpportunity: false,
      },
      flow: QuickQuotationFlows.FIND_OPPORTUNITY,
    },
  });
  const { watch, handleSubmit, setValue, reset } = formMethods;

  const opportunityDetailsWatch = watch(
    QuickQuotationStateNames.opportunityDetails
  );
  const editOpportunityDetailsWatch = watch(
    QuickQuotationStateNames.editOpportunityDetails
  );
  const personDetailsWatch = watch(QuickQuotationStateNames.personDetails);
  const organisationWatch = watch(QuickQuotationStateNames.organisationDetails);
  const personIdWatch = watch(QuickQuotationStateNames.personId);
  const quickQuotationFlow = watch(QuickQuotationStateNames.flow);
  const quotationPersonType = watch(QuickQuotationStateNames.personType);
  const personTypeWatch = watch(QuickQuotationStateNames.personType);
  const isLoadingWatcher = watch(QuickQuotationStateNames.isLoading);
  const organisationIdWatcher = watch(QuickQuotationStateNames.organisationId);

  const getOrganisationDetails = async (organisationId: string) => {
    setValue('isLoading.isLoadingOrganisation', true);

    const organisationDetails = await getOrganisationDetailsById({
      pathParams: { organisationId },
      queryParams: { excludeRelated: true },
    });
    if (organisationDetails?.id) {
      setValue(QuickQuotationStateNames.organisationId, organisationId);
      setValue(
        QuickQuotationStateNames.organisationDetails,
        organisationDetails
      );
    } else {
      showErrorToast(t('common.somethingWentWrong'));
    }
    setValue('isLoading.isLoadingOrganisation', false);
  };

  const getPersonDetails = async (personId: string) => {
    setValue('isLoading.isLoadingPerson', true);
    const personDetails = await getPersonDetailsById({
      pathParams: { personId },
      queryParams: { excludeRelated: true },
    });
    if (personDetails?.id) {
      setValue(QuickQuotationStateNames.personId, personId);
      setValue(QuickQuotationStateNames.personDetails, personDetails);
      setValue(
        QuickQuotationStateNames.flow,
        QuickQuotationFlows.CREATE_OPPORTUNITY
      );
      if (!quotationPersonType) {
        const personType = personDetails.type;
        if (personType === PersonTypeEnum.Business) {
          setValue(
            QuickQuotationStateNames.personType,
            PersonTypeEnum.Business
          );
          if (personDetails?.organisation?.id)
            getOrganisationDetails(personDetails?.organisation?.id);
        } else {
          setValue(QuickQuotationStateNames.personType, PersonTypeEnum.Private);
        }
      }
    } else {
      showErrorToast(t('common.somethingWentWrong'));
    }
    setValue('isLoading.isLoadingPerson', false);
  };

  const getOpportunityDetails = async (opportunityId: string) => {
    setValue('isLoading.isLoadingOpportunity', true);

    const opportunityDetails = await getOpportunityDetailsById({
      pathParams: { opportunityId },
      queryParams: { excludeRelated: true },
    });
    if (opportunityDetails?.id) {
      setValue(QuickQuotationStateNames.opportunityDetails, opportunityDetails);
    } else {
      showErrorToast(t('common.somethingWentWrong'));
    }
    setValue('isLoading.isLoadingOpportunity', false);
  };

  useEffect(() => {
    const { opportunityId, personId, organisationId } = searchParams;
    if (opportunityId) {
      getOpportunityDetails(opportunityId);
    } else if (personId) {
      getPersonDetails(personId);
    } else if (organisationId) {
      getOrganisationDetails(organisationId);
      setValue(QuickQuotationStateNames.personType, 'Business');
      setValue(
        QuickQuotationStateNames.flow,
        QuickQuotationFlows.CREATE_PERSON
      );
    }
  }, []);

  useEffect(() => {
    if (organisationIdWatcher && !organisationWatch?.id) {
      getOrganisationDetails(organisationIdWatcher);
    }
  }, [organisationIdWatcher]);

  useEffect(() => {
    if (opportunityDetailsWatch?.organisation?.id) {
      getOrganisationDetails(opportunityDetailsWatch?.organisation?.id);
    }
    if (opportunityDetailsWatch?.customer?.id) {
      getPersonDetails(opportunityDetailsWatch?.customer?.id);
    }
    if (opportunityDetailsWatch?.id) {
      getOpportunityDetails(opportunityDetailsWatch?.id);
    }
  }, [opportunityDetailsWatch?.id]);

  useEffect(() => {
    if (!opportunityDetailsWatch?.id && organisationWatch?.id) {
      getOrganisationDetails(organisationWatch?.id);
    }
  }, [organisationWatch?.id]);

  useEffect(() => {
    if (!opportunityDetailsWatch?.id && personDetailsWatch?.id) {
      getPersonDetails(personDetailsWatch?.id);
    }
  }, [personDetailsWatch?.id]);

  useEffect(() => {
    if (!personDetailsWatch?.id && personIdWatch) {
      getPersonDetails(personIdWatch);
    }
  }, [personIdWatch]);

  const onCreateNewOpportunityClick = () => {
    setValue(
      QuickQuotationStateNames.flow,
      QuickQuotationFlows.CREATE_OPPORTUNITY
    );
  };

  const onChangeOpportunity = () => {
    reset({
      [QuickQuotationStateNames.flow]: QuickQuotationFlows.FIND_OPPORTUNITY,
    });
  };

  const checkForOrganisation =
    quotationPersonType === 'Private' ||
    (quotationPersonType === 'Business' && organisationWatch?.id);

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(() => {})} className='min-h-80'>
        <If
          condition={
            isLoadingWatcher?.isLoadingOrganisation ||
            isLoadingWatcher?.isLoadingOpportunity ||
            isLoadingWatcher?.isLoadingPerson
          }
        >
          <SpinnerScreen />
        </If>
        {/* This hidden input is to prevent  chrome from autofilling the next input field */}
        <input className='hidden' type='text' value='prevent-chrome-autofill' />
        <Typography
          data-testid={quickProposalIds.quickProposalHeading}
          variant='titleLargeBold'
          className='mb-5 text-secondary'
        >
          {t('quotations.quickQuotation.quickQuotation')}
        </Typography>
        <Divider className='mb-8' />
        <If condition={Boolean(vehicleId)}>
          <Box className='right-8 top-[140px] mb-6 pl-6 lg-mui:absolute lg-mui:w-[48%] lg-mui:pl-14'>
            <VehicleDetails
              vehicleHeaderDetails={vehicleHeaderDetails}
              vehicleImageDetails={vehicleImageDetails}
            />
          </Box>
        </If>
        <If
          condition={
            !opportunityDetailsWatch &&
            quickQuotationFlow === QuickQuotationFlows.FIND_OPPORTUNITY
          }
        >
          <Box paddingLeft={3}>
            <FindOpportunitySection
              onCreateNewOpportunity={onCreateNewOpportunityClick}
            />
          </Box>
        </If>
        <Box paddingLeft={3}>
          {organisationWatch?.id && <OrganisationDetailsSection />}
          {personDetailsWatch?.id && <PersonDetailsSection />}
          {opportunityDetailsWatch?.id && <OpportunityDetailsSection />}
          <If
            condition={
              quickQuotationFlow === QuickQuotationFlows.CREATE_OPPORTUNITY &&
              !organisationWatch?.id &&
              !personDetailsWatch?.id
            }
          >
            <Grid container className='mb-6' xs={12} md={6}>
              <Grid item className='mb-2'>
                <Typography
                  data-testid={
                    quickProposalIds.quickQuotationIsThereOpportunityTitle
                  }
                  variant='titleSmallBold'
                  className='text-secondary'
                >
                  {t('quotations.quickQuotation.isThereOpportunity')}
                </Typography>
              </Grid>

              <Grid
                item
                container
                padding={3}
                display='flex'
                alignItems='center'
                className='rounded bg-grey-8'
                xs={12}
              >
                <Grid item xs={8}>
                  <Typography variant='textMedium' className='text-secondary'>
                    {t('quotations.quickQuotation.NoOpportunityExists')}
                  </Typography>
                </Grid>
                <Grid container item xs={4}>
                  <Button
                    className='ml-auto'
                    onClick={onChangeOpportunity}
                    variant='text'
                  >
                    <Typography
                      variant='textMediumBold'
                      className='normal-case text-primary'
                    >
                      {t('common.change')}
                    </Typography>
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <PersonTypeSection />
          </If>
        </Box>
        <Box paddingLeft={3}>
          <If condition={personTypeWatch === 'Business'}>
            <FindOrganisation />
          </If>
          <If
            condition={
              !!checkForOrganisation &&
              !personDetailsWatch?.id &&
              !personIdWatch
            }
          >
            <FindPersonSection />
          </If>
          <If
            condition={
              !opportunityDetailsWatch?.id &&
              !!checkForOrganisation &&
              !!personDetailsWatch?.id
            }
          >
            <CreateEditOpportunityQQ
              customer={personDetailsWatch}
              organisation={organisationWatch}
              opportunity={editOpportunityDetailsWatch}
              isEdit={!!editOpportunityDetailsWatch?.id}
            />
          </If>
        </Box>
        <Grid item xs={6}>
          <If condition={!!opportunityDetailsWatch?.id}>
            <SubmitLine
              testId={quickProposalIds.quickQuotationSubmitLine}
              className='mt-4 border-t-0'
              onSubmit={() => {
                router.push(
                  `/quotations/new?opportunityId=${opportunityDetailsWatch?.id}${vehicleId ? `&vehicleId=${vehicleId}` : ''}`
                );
              }}
              onCancel={() => {}}
              primaryButtonText={t('common.createQuotation')}
              hideCancel
              disableButtons={
                isLoadingWatcher?.isLoadingOpportunity ||
                isLoadingWatcher?.isLoadingOrganisation ||
                isLoadingWatcher?.isLoadingPerson ||
                !opportunityDetailsWatch?.id
              }
            />
          </If>
        </Grid>
      </form>
    </FormProvider>
  );
};

export default QuickQuotation;
