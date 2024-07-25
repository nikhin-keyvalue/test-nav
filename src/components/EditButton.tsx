'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import Button, { ButtonProps } from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { MdOutlineCreate } from 'react-icons/md';

import { useTranslations } from '@/hooks/translation';

const EditButton = ({ href, ...props }: ButtonProps) => {
  const router = useRouter();
  const t = useTranslations('common');
  return (
    <Button
      disabled={props.disabled}
      className='flex gap-1'
      variant='outlined'
      onClick={() => router.push(href || '')}
    >
      <MdOutlineCreate size='1.25rem' />
      <Typography variant='titleSmallBold' className='capitalize'>
        {t('edit')}
      </Typography>
    </Button>
  );
};

export default EditButton;
