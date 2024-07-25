import { createFilterOptions, Grid, MenuItem } from '@mui/material';
import { opportunityTestIds } from '@test/constants/testIds';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

import {
  AutocompleteWithController,
  DatePickerWithController,
  RenderPersonOption,
} from '@/components';
import If from '@/components/If';
import SelectWithController from '@/components/select-with-controller/SelectWithController';
import TextFieldWithController from '@/components/TextFieldWithController';
import { personTypesList } from '@/constants/filter';
import { useOptions } from '@/hooks/options';
import { useTranslations } from '@/hooks/translation';
import { NewOpportunities, PersonTypeStrict } from '@/types/api';
import { PersonTypeEnum } from '@/types/common';
import { DealersResponse, SalespersonListResponse } from '@/types/metafactory';
import { mergeStrings } from '@/utils/common';
import { getDateinDayjs } from '@/utils/date';

import { getDealers, getSalesPersons } from '../api/api';
import { createOpportunityStatuses, status } from '../constants';
import {
  CreateEditOpportunityFormProps,
  opportunityFlows,
  OpportunityFlowType,
  OpportunityStatusType,
} from '../types';

interface OpportunityFormProps {
  formMethods: UseFormReturn<NewOpportunities & CreateEditOpportunityFormProps>;
  isEdit?: boolean;
  isQuickQuotation?: boolean;
  flow?: OpportunityFlowType;
}

const OpportunityForm = ({
  formMethods,
  isEdit,
  isQuickQuotation,
  flow,
}: OpportunityFormProps) => {
  const isDuplicateOpportunity = flow === opportunityFlows.duplicateOpportunity;
  const t = useTranslations();
  const router = useRouter();

  const {
    watch,
    control,
    register,
    setValue,
    getValues,
    formState: {
      errors: { businessCustomerValidation },
    },
  } = formMethods;

  const customerType = watch('type');
  const customerIdWatch = watch('customer');
  const organisationWatch = watch('organisation');

  const [dealerListData, setDealerListData] = useState<DealersResponse>([]);

  const [salespersonListData, setSalespersonListData] =
    useState<SalespersonListResponse>([]);

  const fetchSalespersons = async () => {
    const response = await getSalesPersons();
    setSalespersonListData(response);
  };

  const fetchDealers = async () => {
    const response = await getDealers();
    if (response.length === 1) {
      const dealer = response[0];
      const { id, name, address, houseNumber, zipCode } = dealer;
      setValue('dealer', {
        address: {
          street: address,
          houseNumber: houseNumber ? houseNumber.toString() : undefined,
          postalCode: zipCode,
        },
        dealerId: id.toString(),
        dealerName: name,
      });
    }
    setDealerListData(response);
  };

  useEffect(() => {
    const newCustomerType = customerIdWatch?.type as PersonTypeStrict;
    setValue('type', newCustomerType ?? null);
  }, [customerIdWatch]);

  useEffect(() => {
    if (organisationWatch) setValue('type', PersonTypeEnum.Business);
  }, [organisationWatch]);

  useEffect(() => {
    fetchDealers();
    fetchSalespersons();
  }, []);

  const dealerListSelectables =
    dealerListData.map((dealer) => ({
      dealerId: dealer.id.toString(),
      dealerName: dealer.name,
      address: {
        houseNumber: `${dealer.houseNumber || ''}`,
        street: dealer.address,
        postalCode: dealer.zipCode,
      },
    })) ?? [];

  const salespersonListSelectables =
    salespersonListData
      ?.filter(({ id, email }) => id && email)
      ?.map(({ id, email, login, lastName, firstName }) => ({
        id,
        email,
        loginId: login,
        lastName,
        firstName,
        salespersonId: id.toString(),
      })) ?? [];

  const {
    options: customerList,
    onInputChange: onCustomerInputChange,
    loading: customerLoading,
    onOpen: onCustomerOpen,
  } = useOptions({
    url: `/api/getPersons?isActive=true${
      organisationWatch?.id && customerType === PersonTypeEnum.Business
        ? `&organisationId=${organisationWatch?.id}`
        : ''
    }`,
    customSearchParamKeys: ['name', 'email'],
  });

  const {
    options: organisationList,
    onInputChange: onOrganisationInputChange,
    loading: organisationLoading,
    onOpen: onOrganisationOpen,
  } = useOptions({
    url: `/api/getOrganisations?isActive=true${
      customerIdWatch?.id ? `&personId=${customerIdWatch?.id}` : ''
    }`,
  });

  const {
    options: leasingCompanyList,
    onInputChange: onLeasingCompanyInputChange,
    loading: leasingCompanyLoading,
    onOpen: onLeasingCompanyOpen,
  } = useOptions({
    url: '/api/getOrganisations?isActive=true&type=LeasingCompany',
  });

  return (
    <div>
      <Grid
        container
        display='flex'
        width='100%'
        ml={0}
        justifyContent='space-between'
        rowSpacing={1}
        px={isQuickQuotation ? 0 : 4}
      >
        <Grid item width='100%'>
          <Grid
            container
            width='100%'
            display='flex'
            rowSpacing={1}
            columnSpacing={2}
          >
            <Grid item sm={12} md={6} lg={6} columnSpacing={2}>
              <TextFieldWithController
                testId={opportunityTestIds.createOpportunityNameTextField}
                fullWidth
                control={control}
                {...register('name')}
                label={t('common.name')}
                required
              />
            </Grid>
            <Grid item sm={12} md={6} lg={6} columnSpacing={2}>
              <SelectWithController
                testId={opportunityTestIds.createOpportunityStatusTextField}
                name='status'
                options={
                  isEdit && !isDuplicateOpportunity
                    ? status
                    : createOpportunityStatuses
                }
                control={control}
                disabled={!isEdit || isDuplicateOpportunity}
                label={t('filters.status')}
                renderOption={(option) => (
                  <MenuItem key={option} value={option}>
                    {t(`opportunityStatus.${option as OpportunityStatusType}`)}
                  </MenuItem>
                )}
              />
            </Grid>
          </Grid>
        </Grid>
        <If condition={!isQuickQuotation}>
          <Grid item width='100%'>
            <Grid container display='flex' width='100%' columnSpacing={2}>
              <Grid item sm={12} md={6} lg={6}>
                <AutocompleteWithController
                  name='customer'
                  testId={opportunityTestIds.createOpportunityCustomerTextField}
                  control={control}
                  label={t('common.customer')}
                  disabled={isEdit && !isDuplicateOpportunity}
                  options={customerList}
                  isOptionEqualToValue={(option, value) => {
                    if (value.lastName === 'Add new person') {
                      router.push(`/persons/new`);
                    }
                    return option?.id === value?.id;
                  }}
                  getOptionLabel={(option) =>
                    mergeStrings({
                      values: [
                        option.firstName,
                        option.middleName,
                        option.lastName,
                      ],
                    })
                  }
                  renderOption={RenderPersonOption}
                  onInputChange={onCustomerInputChange}
                  loading={customerLoading}
                  loadingText={`${t('common.loading')}...`}
                  noOptionsText={t('common.startTyping')}
                  onOpen={onCustomerOpen}
                  // Note: this disables the built-in filtering of the Autocomplete component
                  filterOptions={(x) => x}
                  required
                />
              </Grid>
              <Grid item sm={12} md={6} lg={6}>
                <SelectWithController
                  testId={
                    opportunityTestIds.createOpportunitySelectControllerCustomerType
                  }
                  disabled
                  name='type'
                  control={control}
                  key={customerType}
                  options={personTypesList}
                  label={t('common.customerType')}
                  renderOption={(option) => (
                    <MenuItem key={option} value={option}>
                      {t(`filters.${option as PersonTypeStrict}`)}
                    </MenuItem>
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item width='100%'>
            <Grid container columnSpacing={2} rowSpacing={1} width='100%'>
              {customerType === PersonTypeEnum.Business && (
                <Grid item sm={12} md={6} lg={6}>
                  <AutocompleteWithController
                    testId={
                      opportunityTestIds.createOpportunityOrganisationTextField
                    }
                    control={control}
                    name='organisation'
                    disabled={isEdit && !isDuplicateOpportunity}
                    options={organisationList}
                    label={t('common.businessOrganisation')}
                    isOptionEqualToValue={(option, value) => {
                      if (value.name === 'Add new organisation') {
                        router.push(`/organisations/new`);
                      }
                      return option?.id === value?.id;
                    }}
                    getOptionLabel={(option) => option?.name || ''}
                    customError={businessCustomerValidation}
                    onInputChange={onOrganisationInputChange}
                    loading={organisationLoading}
                    loadingText={`${t('common.loading')}...`}
                    noOptionsText={t('common.startTyping')}
                    onOpen={onOrganisationOpen}
                    required
                  />
                </Grid>
              )}
              <Grid item sm={12} md={6} lg={6}>
                <DatePickerWithController
                  name='newCloseDate'
                  control={control}
                  sx={{ width: '100%' }}
                  format='DD/MM/YYYY'
                  label={t('common.closeDate')}
                  defaultValue={getDateinDayjs(getValues('closeDate'))}
                  required
                />
              </Grid>
            </Grid>
          </Grid>
        </If>
        <Grid item width='100%'>
          <Grid container columnSpacing={2} width='100%' rowSpacing={1}>
            <Grid item sm={12} md={6} lg={6}>
              <AutocompleteWithController
                testId={opportunityTestIds.createOpportunityDealershipTextField}
                name='dealer'
                control={control}
                label={t('common.dealer')}
                options={dealerListSelectables || []}
                isOptionEqualToValue={(option, value) =>
                  option.dealerId === value.dealerId
                }
                getOptionLabel={(option) => option.dealerName || ''}
                required
              />
            </Grid>
            <Grid item sm={12} md={6} lg={6}>
              <AutocompleteWithController
                testId={
                  opportunityTestIds.createOpportunityLeasingCompanyTextField
                }
                control={control}
                name='leasingCompany'
                label={t('common.leasingCompany')}
                options={leasingCompanyList}
                isOptionEqualToValue={(option, value) => {
                  if (value.name === 'Add new person') {
                    router.push(`/persons/new`);
                  }
                  return option?.id === value?.id;
                }}
                getOptionLabel={(option) => option.name || ''}
                onInputChange={onLeasingCompanyInputChange}
                loading={leasingCompanyLoading}
                loadingText={`${t('common.loading')}...`}
                noOptionsText={
                  <div
                    data-testid={
                      opportunityTestIds.createOpportunityLeasingCompanyNoOptionsText
                    }
                  >
                    {t('common.startTyping')}
                  </div>
                }
                onOpen={onLeasingCompanyOpen}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item width='100%'>
          <Grid container columnSpacing={2} width='100%' rowSpacing={1}>
            <Grid item sm={12} md={6} lg={6}>
              <AutocompleteWithController
                testId={
                  opportunityTestIds.createOpportunitySalesPersonsTextField
                }
                isMultiple
                control={control}
                name='salespersons'
                label={t('common.salespersons')}
                options={salespersonListSelectables || []}
                isOptionEqualToValue={(option, value) =>
                  option.salespersonId === value.salespersonId
                }
                getOptionLabel={(option) =>
                  mergeStrings({
                    values: [option.firstName, option.lastName],
                  })
                }
                renderOption={(props, option) =>
                  RenderPersonOption(props, option)
                }
                filterOptions={createFilterOptions({
                  stringify: ({ firstName, lastName, email }) =>
                    `${firstName} ${lastName} ${email}`,
                })}
                required
              />
            </Grid>
            <Grid item sm={12} md={6} lg={6} height='100%'>
              <TextFieldWithController
                testId={
                  opportunityTestIds.createOpportunityAdditionalCommentsTextField
                }
                multiline
                fullWidth
                control={control}
                {...register('additionalComments')}
                label={t('common.additionalRelations')}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default OpportunityForm;
