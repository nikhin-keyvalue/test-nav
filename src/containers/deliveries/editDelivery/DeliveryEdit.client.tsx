'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FormPageHeader from '@/components/FormPageHeader';
import { getDateFromDateTime } from '@/utils/date';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

import { editDelivery } from '../api/actions';
import { DeliveryEditValidationSchema } from '../api/constants';
import { DeliveryDetails, DeliveryUpdateRequest } from '../api/type';
import EditDeliveryForm from '../components/DeliveryEditForm';

export const getDateInDayjs = (date: string | undefined) => {
  if (date) return dayjs(date);
  return null;
};

const DeliveryEditClient = ({
  id,
  deliveryDetails,
}: {
  id: string;
  deliveryDetails: DeliveryDetails;
}) => {
  const t = useTranslations();
  const validationTranslation = useTranslations('validationMessage');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const formMethods = useForm<DeliveryUpdateRequest>({
    defaultValues: {
      name: deliveryDetails.name,
      status: deliveryDetails.status,
      dealerArrivalDate: deliveryDetails.dealerArrivalDate,
      customerDeliveryDate: deliveryDetails.customerDeliveryDate,
      doNotDeliverBefore: deliveryDetails.doNotDeliverBefore,
      currentLocation: deliveryDetails.currentLocation,
      leaseContactPersons: deliveryDetails.leaseContactPersons,
      leaseOrderNumber: deliveryDetails.leaseOrderNumber,
      leaseSystem: deliveryDetails.leaseSystem,
      ascriptionCode: deliveryDetails.ascriptionCode,
      licenseCardNumber: deliveryDetails.licenseCardNumber,
      ottCode: deliveryDetails.ottCode,
      seller: deliveryDetails.seller,
    },
    resolver: zodResolver(DeliveryEditValidationSchema(validationTranslation)),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formMethods;

  const deliveryEditSubmit = async (data: DeliveryUpdateRequest) => {
    const { dealerArrivalDate, customerDeliveryDate, doNotDeliverBefore } =
      data;
    if (dealerArrivalDate)
      data.dealerArrivalDate = getDateFromDateTime(dealerArrivalDate);
    if (customerDeliveryDate)
      data.customerDeliveryDate = getDateFromDateTime(customerDeliveryDate);
    if (doNotDeliverBefore)
      data.doNotDeliverBefore = getDateFromDateTime(doNotDeliverBefore);
    const res = await editDelivery(id, data);

    if (res?.success) {
      showSuccessToast(t('common.savedSuccessfully'));
      startTransition(() => router.replace(`/deliveries/${res.id}/details`));
    } else {
      showErrorToast(t('common.somethingWentWrong'));
    }
  };

  return (
    <div className='m-3 flex'>
      <FormProvider {...formMethods}>
        <form
          onSubmit={handleSubmit(deliveryEditSubmit)}
          id='deliveryEdit'
          className='w-full'
          noValidate
        >
          <FormPageHeader
            saveButtonProps={{ disabled: isPending || isSubmitting }}
          >
            <Typography variant='titleLargeBold' className='text-secondary'>
              {t('deliveries.editDelivery')}
            </Typography>
          </FormPageHeader>

          <EditDeliveryForm isPending={isPending} formMethods={formMethods} />
        </form>
      </FormProvider>
    </div>
  );
};

export default DeliveryEditClient;
