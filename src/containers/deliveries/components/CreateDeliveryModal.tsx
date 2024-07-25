import { Typography } from '@AM-i-B-V/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { CustomDialog, TextFieldWithController } from '@/components';
import { useTranslations } from '@/hooks/translation';
import useFormSubmission from '@/hooks/useFormSubmission';

import { createDelivery } from '../api/actions';
import { createDeliveryValidation } from '../api/constants';
import { DeliveryCreateRequest } from '../api/type';

const CreateDeliveryModal = ({
  open,
  handleClose,
  quotationId,
  defaultName,
}: {
  open: boolean;
  defaultName?: string;
  handleClose: () => void;
  quotationId: string | number;
}) => {
  const t = useTranslations('deliveries');
  const validationTranslation = useTranslations('validationMessage');

  const formMethods = useForm<DeliveryCreateRequest>({
    defaultValues: {
      name: `${t('deliveryOf')} ${defaultName}`,
    },
    resolver: zodResolver(createDeliveryValidation(validationTranslation)),
  });

  const { control, handleSubmit } = formMethods;

  const { handleApiCall, isLoading } = useFormSubmission({
    handleClose,
  });

  const onSubmit = async (data: DeliveryCreateRequest) => {
    const payload = {
      ...data,
      quotationId: quotationId as string,
    };
    handleApiCall(createDelivery, payload);
  };

  return (
    <CustomDialog
      isOpen={open}
      onClose={handleClose}
      headerElement={t('createDelivery')}
      onSubmit={handleSubmit(onSubmit)}
      submitText={t('convertIntoDelivery')}
      disabled={isLoading}
      isLoading={isLoading}
    >
      <Typography variant='textMedium' className='mb-3 text-secondary'>
        {t('dealClosedMessage')}
      </Typography>
      <TextFieldWithController
        control={control}
        name='name'
        label={t('deliveryName')}
        required
      />
    </CustomDialog>
  );
};

export default CreateDeliveryModal;
