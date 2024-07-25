import { Button } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';

import ConfirmationModal from '@/components/ConfirmationModal';
import { QUOTATION_STATUSES } from '@/containers/opportunities/types';
import { useTranslations } from '@/hooks/translation';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

import { acceptQuotation } from '../api/actions';
import { PrimaryColor } from '../constants';
import LanguageChangeComponent from './LanguageChangeComponent';

const Footer = ({
  pageIndex,
  setPageNumber,
  maxPages = 4,
  status,
}: {
  pageIndex: number;
  setPageNumber: Dispatch<SetStateAction<number>>;
  maxPages: number;
  status: QUOTATION_STATUSES;
}) => {
  const t = useTranslations();
  const [isAcceptModalOpen, setAcceptModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const shareToken = searchParams.get('token') || '';

  const handleAcceptQuotationClick = async () => {
    setLoading(true);
    const res = await acceptQuotation(shareToken!);
    if (res) {
      showSuccessToast(t('common.savedSuccessfully'));
      setPageNumber(maxPages);
      window.location.reload();
      setAcceptModalOpen(false);
    } else {
      showErrorToast(t('common.somethingWentWrong'));
    }
    setLoading(false);
  };

  return (
    <>
      <div className='fixed bottom-0 inline-flex h-20 w-full items-center justify-between bg-grey-26 px-4 sm:px-20'>
        <LanguageChangeComponent />

        {!(pageIndex > maxPages) ? (
          <div className='flex items-center justify-center gap-6'>
            <Button
              className='text-white'
              color='secondary'
              disabled={pageIndex === 1}
              size='small'
              onClick={() => setPageNumber((page) => Math.max(page - 1, 0))}
            >
              <MdArrowBack size='1.5rem' className='text-inherit' />
            </Button>
            <div className='text-base font-bold leading-tight text-white'>
              {t('shareQuotation.page')} {pageIndex}/{maxPages}
            </div>
            <Button
              className='text-white'
              color='secondary'
              size='small'
              disabled={pageIndex >= maxPages}
              onClick={() =>
                setPageNumber((page) => Math.min(page + 1, maxPages))
              }
            >
              <MdArrowForward size='1.5rem' className='text-inherit' />
            </Button>
          </div>
        ) : (
          <div />
        )}

        {status === QUOTATION_STATUSES.SHARE_QUOTATION ? (
          <Button
            sx={{
              backgroundColor: PrimaryColor,
            }}
            className='flex h-12 w-48 items-center justify-center gap-1 rounded px-4 hover:!bg-sky-700'
            onClick={() => setAcceptModalOpen(true)}
          >
            <div className='flex items-start justify-start px-1 pb-0.5'>
              <div className='text-base font-bold normal-case leading-tight text-white'>
                {t('shareQuotation.acceptQuotation')}
              </div>
            </div>
          </Button>
        ) : (
          <div />
        )}

        {pageIndex > maxPages && (
          <Button
            className='text-white'
            color='secondary'
            size='small'
            onClick={() => setPageNumber((page) => page - 1)}
          >
            <MdArrowBack size='1.5rem' className='text-inherit' />
            <span className='pl-2'>{t('shareQuotation.backToQuotation')}</span>
          </Button>
        )}
      </div>
      <ConfirmationModal
        open={isAcceptModalOpen}
        message={t('shareQuotation.acceptQuoteConfirmation')}
        headerText={t('shareQuotation.acceptQuotation')}
        onClose={() => setAcceptModalOpen(false)}
        isLoading={isLoading}
        onSubmit={handleAcceptQuotationClick}
      />
    </>
  );
};

export default Footer;
