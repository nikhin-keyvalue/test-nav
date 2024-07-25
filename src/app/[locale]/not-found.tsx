import { Button } from '@mui/material';
import Link from 'next/link';

import { FullPageError } from '@/components/Error';
import { useTranslations } from '@/hooks/translation';

export default function NotFound() {
  const t = useTranslations();

  return (
    <FullPageError
      title={t('common.pageNotFoundTitle')}
      description={t('common.pageNotFound')}
      actions={
        <Link href='/persons'>
          <Button variant='contained' color='primary'>
            {t('navBar.persons')}
          </Button>
        </Link>
      }
    />
  );
}
