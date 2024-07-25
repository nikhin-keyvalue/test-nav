import { Typography } from '@AM-i-B-V/ui-kit';
import { DialogContent } from '@mui/material';

import CustomDialog from '@/components/Dialog';
import { QUOTATION_STATUSES } from '@/containers/opportunities/types';
import { useTranslations } from '@/hooks/translation';
import useFormSubmission from '@/hooks/useFormSubmission';

import { updateQuotationStatus } from '../api/actions';

const RejectQuotationDialog = ({
  open,
  handleClose,
  quotationId,
  opportunityId,
}: {
  open: boolean;
  quotationId: string;
  opportunityId: string;
  handleClose: () => void;
}) => {
  const t = useTranslations();
  const { handleApiCall, isLoading } = useFormSubmission({
    handleClose,
  });

  const onRejectQuotation = async () => {
    const payload = {
      opportunityId,
      id: quotationId,
      status: QUOTATION_STATUSES.REJECTED,
    };

    handleApiCall(updateQuotationStatus, payload);
  };

  return (
    <CustomDialog
      isOpen={open}
      disabled={isLoading}
      isLoading={isLoading}
      onClose={handleClose}
      onSubmit={onRejectQuotation}
      submitText={t('quotations.reject')}
      headerElement={t('quotations.rejectQuotation')}
    >
      <DialogContent sx={{ maxWidth: '360px' }}>
        <Typography variant='textMedium'>
          {t('quotations.rejectQuotationConfirmation')}
        </Typography>
      </DialogContent>
    </CustomDialog>
  );
};

export default RejectQuotationDialog;
