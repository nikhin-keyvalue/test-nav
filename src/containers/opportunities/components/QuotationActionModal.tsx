import { TransitionStartFunction } from 'react';

import ConfirmationModal from '@/components/ConfirmationModal';
import {
  deleteQuotation,
  updateQuotationStatus,
} from '@/containers/quotations/api/actions';
import {
  QuotationStatus,
  QuotationStatusEnum,
} from '@/containers/quotations/api/type';
import {
  ConfirmationModalType,
  ModalProps,
} from '@/containers/quotations/types';
import { useTranslations } from '@/hooks/translation';
import useFormSubmission from '@/hooks/useFormSubmission';

const QuotationActionModal = ({
  isConfirmationModalOpen,
  onClose,
  opportunityId,
  startTransition = () => null,
}: {
  isConfirmationModalOpen: ModalProps;
  onClose: () => void;
  opportunityId: string;
  startTransition: TransitionStartFunction;
}) => {
  const t = useTranslations();
  const { handleApiCall, isLoading } = useFormSubmission({
    handleClose: onClose,
  });

  const onDeleteQuotation = () => {
    const payload = {
      id: isConfirmationModalOpen!.id,
      opportunityId,
    };

    startTransition(async () => {
      await handleApiCall(deleteQuotation, payload);
    });
  };

  const onUpdateStatus = async (status: QuotationStatus) => {
    const payload = {
      id: isConfirmationModalOpen!.id,
      status,
      opportunityId,
    };

    await handleApiCall(updateQuotationStatus, payload);
  };

  const getModalProps = (
    name?: ConfirmationModalType
  ): {
    headerText: string;
    onSubmit: () => void;
    messageKey:
      | 'deleteQuotationMessage'
      | 'confirmClientAgreed'
      | 'confirmClientSigned';
  } => {
    // TODO: Change message key and on submit for clientSigned and clientAgreed
    switch (name) {
      case 'clientAgreed':
        return {
          headerText: t('actions.confirm'),
          onSubmit: () =>
            onUpdateStatus(QuotationStatusEnum.PRELIMINARY_AGREEMENT),
          messageKey: 'confirmClientAgreed',
        };
      case 'clientSigned':
        return {
          headerText: t('actions.confirm'),
          onSubmit: () => onUpdateStatus(QuotationStatusEnum.AGREEMENT_SIGNED),
          messageKey: 'confirmClientSigned',
        };
      case 'delete':
      default:
        return {
          headerText: t('common.delete'),
          onSubmit: onDeleteQuotation,
          messageKey: 'deleteQuotationMessage',
        };
    }
  };

  return (
    <ConfirmationModal
      disabled={isLoading}
      open={!!isConfirmationModalOpen?.name}
      headerText={getModalProps(isConfirmationModalOpen?.name).headerText}
      message={t(
        `quotationActions.${
          getModalProps(isConfirmationModalOpen?.name).messageKey
        }`
      )}
      onClose={onClose}
      onSubmit={getModalProps(isConfirmationModalOpen?.name).onSubmit}
    />
  );
};

export default QuotationActionModal;
