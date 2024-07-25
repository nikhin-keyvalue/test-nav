import { Typography } from '@AM-i-B-V/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@mui/material';
import { quickProposalIds } from '@test/constants/testIds';
import { useTranslations } from 'next-intl';
import { SyntheticEvent, useEffect } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

import { getDealerDetails } from '@/containers/opportunities/api/actions';
import OpportunityForm from '@/containers/opportunities/components/OpportunityForm';
import {
  CreateEditOpportunityValidation,
  createOpportunityStatuses,
} from '@/containers/opportunities/constants';
import { CreateEditOpportunityFormProps } from '@/containers/opportunities/types';
import { currentUser } from '@/hooks/server/currentUser';
import { NewOpportunities } from '@/types/api';
import {
  createOpportunity,
  editOpportunity,
} from '@/utils/actions/formActions';
import { formatDate, getCurrentDate, getDateinDayjs } from '@/utils/date';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

import {
  opportunityDetailsResetValue,
  QuickQuotationStateNames,
} from '../../constants';
import {
  CreateEditOpportunityQQProps,
  QuickQuotationFormSchema,
} from '../../types';

const CreateEditOpportunityQQ = ({
  customer,
  organisation,
  opportunity,
  isEdit,
}: CreateEditOpportunityQQProps) => {
  const t = useTranslations();
  const validationTranslation = useTranslations('validationMessage');
  const { setValue: setParentValue } =
    useFormContext<QuickQuotationFormSchema>();

  const defaultValues = isEdit
    ? {
        ...opportunity,
        newCloseDate: getDateinDayjs(opportunity?.closeDate),
      }
    : {
        name: `${t('opportunities.salesOpportunity')} ${formatDate(getCurrentDate({ formatToISOString: true }).date as string, 'DD-MM-YYYY')}`,
        newCloseDate: getDateinDayjs(Date()),
        customer,
        organisation,
        status: createOpportunityStatuses[0],
        salespersons: [],
      };

  const formMethods = useForm<
    NewOpportunities & CreateEditOpportunityFormProps
  >({
    defaultValues,
    resolver: zodResolver(
      CreateEditOpportunityValidation(validationTranslation)
    ),
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = formMethods;

  const addSalesPerson = async () => {
    const userDetails = await currentUser();
    setValue('salespersons', [
      {
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        email: userDetails.email,
        salespersonId: `${userDetails.id}`,
        loginId: userDetails.login,
      },
    ]);
  };

  useEffect(() => {
    if (!isEdit) addSalesPerson();
  }, []);

  const onCreateOpportunity = async (
    data: NewOpportunities & CreateEditOpportunityFormProps
  ) => {
    const dealerDetails = await getDealerDetails({
      dealerId: data.dealer.dealerId,
    });

    const payload = {
      ...data,
      dealer: {
        ...data.dealer,
        address: {
          ...(data.dealer.address || {}),
          city: dealerDetails.city,
          countryCode: dealerDetails.country,
        },
      },
      customerId: data.customer?.id,
      organisationId: data.organisation?.id,
      leasingCompanyId: data.leasingCompany?.id,
      closeDate: data?.newCloseDate?.format('YYYY-MM-DD'),
    };

    if (data?.type === 'Private') {
      delete payload.organisationId;
    }

    delete payload.customer;
    delete payload.organisation;
    delete payload.leasingCompany;

    setParentValue('isLoading.isLoadingOpportunity', true);
    const res = isEdit
      ? await editOpportunity(opportunity?.id as string, payload)
      : await createOpportunity(payload);

    if (res?.id) {
      showSuccessToast(t('common.savedSuccessfully'));
      setParentValue(QuickQuotationStateNames.opportunityDetails, res);
      setParentValue(
        QuickQuotationStateNames.editOpportunityDetails,
        opportunityDetailsResetValue
      );
    } else {
      showErrorToast(t('common.somethingWentWrong'));
    }
    setParentValue('isLoading.isLoadingOpportunity', false);
  };

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(onCreateOpportunity)}
        id='opportunityCreate'
        className='mt-4 lg-mui:w-1/2'
      >
        <div
          data-testid={quickProposalIds.quickProposalOpportunityFormContainer}
          className='flex flex-col gap-4'
        >
          <Typography variant='titleMediumBold' className='text-secondary'>
            {isEdit
              ? t('quotations.quickQuotation.editOpportunityDetails')
              : t('quotations.quickQuotation.enterOpportunityDetails')}
          </Typography>
          <OpportunityForm
            isQuickQuotation
            formMethods={formMethods}
            isEdit={isEdit}
          />
          <div>
            <Button
              data-testid={quickProposalIds.opportunitySaveAndProceedButton}
              variant='contained'
              type='submit'
              sx={{ textTransform: 'none', height: '48px' }}
              onClick={(e: SyntheticEvent) => {
                e.stopPropagation();
                e.preventDefault();
                handleSubmit(onCreateOpportunity)();
              }}
              disabled={isSubmitting}
            >
              <Typography variant='titleSmallBold' className='capitalize'>
                {t('common.save&Proceed')}
              </Typography>
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default CreateEditOpportunityQQ;
