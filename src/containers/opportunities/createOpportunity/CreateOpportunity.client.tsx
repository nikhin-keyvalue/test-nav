'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { opportunityTestIds } from '@test/constants/testIds';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { MdErrorOutline } from 'react-icons/md';

import FormPageHeader from '@/components/FormPageHeader';
import SubmitLine from '@/components/SubmitLine';
import { UserDetails } from '@/components/user-details/types';
import { apiErrors } from '@/containers/persons/constants';
import { useTranslations } from '@/hooks/translation';
import { NewOpportunities } from '@/types/api';
import {
  ErrorMessageType,
  FieldNames,
  InvalidFieldApiErrorResponseType,
  ObjectKeyValueStringType,
} from '@/types/common';
import { createOpportunity } from '@/utils/actions/formActions';
import { getErrorMessage } from '@/utils/common';
import { formatDate, getCurrentDate, getDateinDayjs } from '@/utils/date';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

import { getDealerDetails } from '../api/actions';
import { CreateOpportunityPrefillData } from '../api/type';
import OpportunityForm from '../components/OpportunityForm';
import {
  CreateEditOpportunityValidation,
  createOpportunityStatuses,
} from '../constants';
import { CreateEditOpportunityFormProps } from '../types';

const CreateOpportunity = ({
  userDetails,
  prefillData,
}: {
  userDetails: UserDetails;
  prefillData: CreateOpportunityPrefillData;
}) => {
  const [formError, setFormError] = useState({});

  const t = useTranslations();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const currentUserDetails = {
    firstName: userDetails.firstName,
    lastName: userDetails.lastName,
    email: userDetails.email,
    salespersonId: `${userDetails.id}`,
    loginId: userDetails.login,
  };

  const validationTranslation = useTranslations('validationMessage');

  const formMethods = useForm<
    NewOpportunities & CreateEditOpportunityFormProps
  >({
    defaultValues: {
      name: `${t('opportunities.salesOpportunity')} ${formatDate(getCurrentDate({ formatToISOString: true }).date as string, 'DD-MM-YYYY')}`,
      newCloseDate: getDateinDayjs(Date()),
      status: createOpportunityStatuses[0],
      salespersons: [currentUserDetails],
      ...(prefillData.person && {
        customer: prefillData.person,
        organisation: prefillData.person.organisation,
      }),
      ...(prefillData.organisation && {
        ...(prefillData.organisation.type === 'LeasingCompany'
          ? { leasingCompany: prefillData.organisation }
          : { organisation: prefillData.organisation }),
      }),
    },
    resolver: zodResolver(
      CreateEditOpportunityValidation(validationTranslation)
    ),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formMethods;

  // useEffect(() => {
  //   if (leasingCompanySelectable) {
  //     leasingCompanySelectable.push({
  //       // name: <div className='text-red-700	'>Add new organisation</div>,
  //       name: 'Add new organisation',
  //       id: 'create',
  //     });
  //   }
  //   if (customerSelectable) {
  //     customerSelectable.push({
  //       firstName: '',
  //       lastName: 'Add new person',
  //       id: 'create',
  //       type: 'Business',
  //     });
  //   }
  //   if (organisationSelectables) {
  //     organisationSelectables.push({
  //       name: 'Add new organisation',
  //       id: 'create',
  //     });
  //   }
  // });

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
      salespersons: data?.salespersons,
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
    const res = await createOpportunity(payload);

    if (res?.id) {
      showSuccessToast(t('common.savedSuccessfully'));
      startTransition(() => router.replace(`/opportunities/${res.id}/details`));
    } else if (res?.error?.errorCode === apiErrors.inputValidationFailed) {
      showErrorToast(t(getErrorMessage(res.error?.errorCode)));
      const errorsList: ObjectKeyValueStringType = {};
      res?.error?.invalidFields?.forEach(
        (fieldItem: InvalidFieldApiErrorResponseType) => {
          const fieldName = fieldItem.name;
          errorsList[fieldName] = fieldItem.reason;
        }
      );
      setFormError(errorsList);
    } else if (res?.error?.errorCode) {
      showErrorToast(
        t(getErrorMessage(res.error?.errorCode as ErrorMessageType))
      );
    }
  };

  const getFormErrorsJSX = () => (
    <div>
      {Object.keys(formError).map((error) => (
        <div key={error} className='text-sm'>
          {t(`apiErrorName.${error as FieldNames}`)}:{' '}
          {formError[error as keyof typeof formError]}
        </div>
      ))}
    </div>
  );

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(onCreateOpportunity)}
        id='opportunityCreate'
        className='w-full'
        noValidate
      >
        <FormPageHeader
          saveButtonProps={{ disabled: isPending || isSubmitting }}
        >
          <div className='flex items-center'>
            <Typography variant='titleLargeBold' className='text-secondary'>
              {t('createOpportunity.title')}
            </Typography>

            {formError && Object.keys(formError).length > 0 && (
              <Tooltip title={getFormErrorsJSX()} placement='right' arrow>
                <Box
                  sx={{
                    color: 'primary.contrastText',
                    p: 0,
                  }}
                >
                  <MdErrorOutline className='ml-2 mt-1 size-6 text-primary' />
                </Box>
              </Tooltip>
            )}
          </div>
        </FormPageHeader>
        <div className='mb-5 mt-8 flex w-1/2 flex-col'>
          <OpportunityForm formMethods={formMethods} />
        </div>
        <SubmitLine
          onSubmit={handleSubmit(onCreateOpportunity)}
          testId={opportunityTestIds.createOpportunitySubmitLineSaveButton}
          disableButtons={isPending || isSubmitting}
        />
      </form>
    </FormProvider>
  );
};

export default CreateOpportunity;
