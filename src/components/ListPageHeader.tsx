'use client';

import { Button, Typography } from '@AM-i-B-V/ui-kit';
import Link from 'next/link';
import { FC } from 'react';
import { MdAdd } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';

import { useTranslations } from '@/hooks/translation';

interface ListPageHeaderProps {
  title: string;
  addHref?: string;
  className?: string;
  testId?: string;
}

const ListPageHeader: FC<ListPageHeaderProps> = ({
  title = '',
  addHref,
  className,
  testId,
}) => {
  const t = useTranslations();

  return (
    <div className={twMerge('flex justify-between', className)}>
      <Typography variant='titleLargeBold' className='text-secondary'>
        {title}
      </Typography>
      {addHref && (
        <Link href={addHref}>
          <Button
            className='h-full'
            onClick={() => null}
            variant='contained'
            data-testid={testId}
          >
            <div className='flex gap-2 px-4'>
              <MdAdd className='text-white' size='20' />
              <Typography variant='titleSmallBold' className='capitalize'>
                {t('common.add')}
              </Typography>
            </div>
          </Button>
        </Link>
      )}
    </div>
  );
};

export default ListPageHeader;
