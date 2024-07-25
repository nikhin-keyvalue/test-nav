import { Typography } from '@AM-i-B-V/ui-kit';

import { useTranslations } from '@/hooks/translation';

import Dialog from './Dialog';

const ConfirmationModal = ({
  open,
  message,
  onClose,
  onSubmit,
  headerText,
  disabled = false,
  isLoading = false,
}: {
  open: boolean;
  message: string;
  headerText: string;
  disabled?: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: () => void;
}) => {
  const t = useTranslations();
  return (
    <Dialog
      isOpen={open}
      onClose={onClose}
      disabled={disabled}
      onSubmit={onSubmit}
      isLoading={isLoading}
      headerElement={headerText}
      submitText={t('actions.confirm')}
    >
      <Typography>{message}</Typography>
    </Dialog>
  );
};

export default ConfirmationModal;
