'use client';

import { Button } from '@mui/material';
import { useTranslations } from 'next-intl';

import { FullPageError } from '@/components/Error';
import { isDevelopmentMode } from '@/constants/env';

const ErrorPage = (props: { error: Error; reset: () => void }) => {
  const { error, reset } = props;
  const t = useTranslations('common');

  return (
    <FullPageError
      title={t('thereWasAProblem')}
      description={isDevelopmentMode ? error.message : t('genericError')}
      actions={
        <div className='flex gap-4'>
          <Button variant='contained' onClick={reset}>
            {t('tryAgain')}
          </Button>
        </div>
      }
    />
  );
};

export default ErrorPage;
