'use client';

import { Button } from '@mui/material';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { FullPageError } from '@/components/Error';
import { isDevelopmentMode } from '@/constants/env';

const Error = (props: { error: Error; reset: () => void }) => {
  const t = useTranslations('common');
  const tNav = useTranslations('navBar');
  const { error, reset } = props;
  return (
    <FullPageError
      title={t('thereWasAProblem')}
      description={isDevelopmentMode ? error.message : t('genericError')}
      actions={
        <div className='flex gap-4'>
          <Button variant='contained' onClick={reset}>
            {t('tryAgain')}
          </Button>
          <Link href='/persons'>
            <Button variant='outlined' color='secondary'>
              {tNav('persons')}
            </Button>
          </Link>
        </div>
      }
    />
  );
};

export default Error;
