'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import { opportunityTestIds } from '@test/constants/testIds';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { NoData } from '@/components';
import FormPageHeader from '@/components/FormPageHeader';
import SubmitLine from '@/components/SubmitLine';
import { useTranslations } from '@/hooks/translation';
import { NewOpportunities, OpportunityDetails } from '@/types/api';
import { getDateinDayjs } from '@/types/dayjs';
import {
  createOpportunity,
  editOpportunity,
} from '@/utils/actions/formActions';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

import { getDealerDetails } from '../api/actions';
import OpportunityForm from '../components/OpportunityForm';
import {
  CreateEditOpportunityValidation,
  createOpportunityStatuses,
} from '../constants';
import {
  CreateEditOpportunityFormProps,
  opportunityFlows,
  OpportunityFlowType,
} from '../types';

const EditOpportunity = ({
  details,
  flow,
}: {
  details: OpportunityDetails | undefined | null;
  flow?: OpportunityFlowType;
}) => {
  const isDuplicateOpportunity = flow === opportunityFlows.duplicateOpportunity;
  const t = useTranslations();
  const validationTranslation = useTranslations('validationMessage');
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const formMethods = useForm<
    NewOpportunities & CreateEditOpportunityFormProps
  >({
    defaultValues: {
      name: details?.name,
      status: isDuplicateOpportunity
        ? createOpportunityStatuses[0]
        : details?.status,
      customer: details?.customer,
      type: details?.type,
      organisation: details?.organisation,
      dealer: details?.dealer,
      leasingCompany: details?.leasingCompany,
      salespersons: details?.salespersons,
      additionalComments: details?.additionalComments,
      newCloseDate: isDuplicateOpportunity
        ? getDateinDayjs(Date())
        : getDateinDayjs(details?.closeDate),
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

  const onOpportunitySubmit = async (
    data: NewOpportunities & CreateEditOpportunityFormProps
  ) => {
    const dealerDetails = await getDealerDetails({
      dealerId: data.dealer.dealerId,
    });

    const payload = {
      ...data,
      dealer: {
        ...data.dealer,
        dealerId: data?.dealer?.dealerId,
        address: {
          ...(data.dealer.address || {}),
          city: dealerDetails.city,
          countryCode: dealerDetails.country,
        },
      },
      type: data.type,
      customerId: data.customer?.id,
      organisationId: data.organisation?.id,
      salespersons: data?.salespersons,
      leasingCompanyId: data.leasingCompany?.id,
      closeDate: data?.newCloseDate?.format('YYYY-MM-DD'),
    };

    if (data?.type === 'Private') {
      delete payload.organisationId;
    }

    delete payload.customer;
    delete payload.newCloseDate;
    delete payload.organisation;
    delete payload.leasingCompany;
    if (details) {
      if (isDuplicateOpportunity) {
        const res = await createOpportunity(payload);
        if (res?.id) {
          showSuccessToast(t('common.savedSuccessfully'));
          startTransition(() =>
            router.replace(`/opportunities/${res.id}/details`)
          );
        } else {
          showErrorToast(t('common.somethingWentWrong'));
        }
      } else {
        const res = await editOpportunity(details?.id, payload);
        if (res?.success) {
          showSuccessToast(t('common.savedSuccessfully'));
          startTransition(() =>
            router.replace(`/opportunities/${details?.id}/details`)
          );
        } else {
          showErrorToast(t('common.somethingWentWrong'));
        }
      }
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(onOpportunitySubmit)}
        id='opportunityCreate'
        className='w-full'
        noValidate
      >
        <FormPageHeader
          hideButton={!details}
          saveButtonProps={{ disabled: isPending || isSubmitting }}
        >
          <Typography variant='titleLargeBold' className='text-secondary'>
            {isDuplicateOpportunity
              ? t('opportunities.duplicateOpportunity')
              : t('editOpportunity.title')}
          </Typography>
        </FormPageHeader>
        {details ? (
          <>
            <div className='mb-5 mt-8 flex w-1/2 flex-col'>
              <OpportunityForm formMethods={formMethods} isEdit flow={flow} />
            </div>
            <SubmitLine
              testId={opportunityTestIds.editOpportunitySubmitLineSaveButton}
              disableButtons={isPending || isSubmitting}
            />
          </>
        ) : (
          <div className='h-[75vh] w-full'>
            <NoData
              primaryText={t('opportunities.opportunityNotFoundPrimaryText')}
              secondaryText={t(
                'opportunities.opportunityNotFoundSecondaryText'
              )}
            />
          </div>
        )}
      </form>
    </FormProvider>
  );
};

export default EditOpportunity;
