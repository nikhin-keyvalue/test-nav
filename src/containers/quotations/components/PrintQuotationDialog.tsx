import { Typography } from '@AM-i-B-V/ui-kit';
import { Checkbox, DialogContent } from '@mui/material';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import CustomDialog from '@/components/Dialog';
import { useTranslations } from '@/hooks/translation';
import { showErrorToast } from '@/utils/toast';

import { getPrintableQuotation } from '../api/api';
import { ESignMethodResponse } from '../api/type';

const PrintQuotationDialog = ({
  open,
  handleClose,
  quotationId,
  activeDealer,
}: {
  open: boolean;
  quotationId: string;
  handleClose: () => void;
  activeDealer: ESignMethodResponse;
}) => {
  const t = useTranslations();
  const { id: opportunityId } = useParams();
  const [isLoading, setLoading] = useState(false);

  const [shareQuotationStatus, setShareQuotationStatus] =
    useState<boolean>(false);

  const handlePdfGeneration = async () => {
    setLoading(true);
    try {
      const quotationPrintResponse = await getPrintableQuotation({
        quotationId,
        opportunityId: `${opportunityId}`,
        markAsShared: shareQuotationStatus,
        eSignService: activeDealer.eSignService,
      });

      if (shareQuotationStatus) setTimeout(() => window.location.reload());
      window.open(quotationPrintResponse.url);
      handleClose();
    } catch {
      showErrorToast(t('common.somethingWentWrong'));
    }
    setLoading(false);
  };

  return (
    <CustomDialog
      isOpen={open}
      disabled={isLoading}
      onClose={handleClose}
      isLoading={isLoading}
      onSubmit={handlePdfGeneration}
      submitText={t('quotations.print')}
      headerElement={t('quotations.printQuotation')}
    >
      <DialogContent sx={{ maxWidth: '360px' }}>
        <div className='flex items-center'>
          <Checkbox
            color='secondary'
            sx={{ p: 0, mr: 1 }}
            checked={shareQuotationStatus}
            onChange={(e) => setShareQuotationStatus(e.target.checked)}
          />
          <Typography variant='textMedium'>
            {t('quotations.updateQuotationStatus')}
          </Typography>
        </div>
      </DialogContent>
    </CustomDialog>
  );
};

export default PrintQuotationDialog;
