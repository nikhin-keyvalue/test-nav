import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import ConfirmationModal from '@/components/ConfirmationModal';
import { QUOTATION_STATUSES } from '@/containers/opportunities/types';
import { QuotationResponse } from '@/containers/quotations/api/type';
import { useTranslations } from '@/hooks/translation';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

import { reSharePublicQuotation } from '../api/actions';

const AcceptedQuotation = ({
  quoteDetails,
}: {
  quoteDetails: QuotationResponse;
}) => {
  const t = useTranslations('shareQuotation');
  const searchParams = useSearchParams();
  const shareToken = searchParams.get('token') || '';

  const [isReShareModalOpen, setReShareModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleReShareClick = async () => {
    setLoading(true);
    const res = await reSharePublicQuotation(shareToken!);
    if (res) {
      showSuccessToast(t('reShareSuccess'));
      setReShareModalOpen(false);
    } else {
      showErrorToast(t('reShareFailure'));
    }
    setLoading(false);
  };
  return (
    <>
      <div className='px-6 lg:px-20'>
        <div className='flex flex-col items-start justify-start gap-6'>
          <div className='self-stretch text-3xl font-bold leading-10 text-grey-26'>
            {t('Quotation')}
          </div>
          <div className='self-stretch text-base font-normal leading-tight text-grey-26'>
            {t('acceptQuotationText')}
          </div>

          {quoteDetails.status === QUOTATION_STATUSES.PRELIMINARY_AGREEMENT && (
            <span className='text-[15px] font-semibold leading-[21px] text-primary'>
              {t('noEMail')}{' '}
              <span
                role='presentation'
                onClick={() => setReShareModalOpen(true)}
                className='cursor-pointer underline'
              >
                {t('reSendLink')}
              </span>
            </span>
          )}

          <span className='text-[15px] font-semibold leading-[21px] text-primary'>
            {t('help')}{' '}
            <a
              className='underline'
              href={`mailto:${quoteDetails?.sharedBy?.email}?subject=${t(
                // TODO: change to email address from sharedBy
                'emailSubject'
              )}`}
            >
              {t('contactUs')}
            </a>
          </span>
        </div>
      </div>
      <ConfirmationModal
        open={isReShareModalOpen}
        headerText={t('reShareTitle')}
        message={t('reShareConfirmationMessage')}
        onClose={() => setReShareModalOpen(false)}
        isLoading={isLoading}
        onSubmit={handleReShareClick}
      />
    </>
  );
};

export default AcceptedQuotation;
