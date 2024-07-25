'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { SyntheticEvent } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';

import { useTranslations } from '@/hooks/translation';

export interface SaveButtonProps {
  label?: string;
  form?: string;
  disabled?: boolean;
}
interface Props extends React.HTMLAttributes<HTMLDivElement> {
  testId?: string;
  goBack?: () => void;
  hideButton?: boolean;
  isDetailPage?: boolean;
  opportunityId?: number;
  saveButtonProps?: SaveButtonProps;
  onSubmit?: (e: SyntheticEvent) => void;
}

const FormPageHeader = ({
  goBack,
  children,
  className,
  testId = '',
  isDetailPage,
  saveButtonProps,
  hideButton = false,
  onSubmit,
  ...props
}: Props & SaveButtonProps) => {
  const router = useRouter();
  const t = useTranslations('common');
  const { label, form, disabled } = saveButtonProps ?? {};

  return (
    <div
      className={twMerge(
        `flex flex-col lg:flex-row px-4 lg:px-0 gap-6 pb-6 ${
          isDetailPage ? '' : 'border'
        } border-solid border-b-secondary-300 border-x-0 border-t-0`,
        className
      )}
      data-testid={testId}
      {...props}
    >
      <div className='flex justify-between'>
        <div
          role='presentation'
          className='flex cursor-pointer items-center border-0 border-r border-solid border-secondary-300 pr-6'
          onClick={() => (goBack ? goBack() : router.back())}
          data-testid={`${testId}-back-arrow-button`}
        >
          <MdArrowBack size='24' className=' text-secondary ' />
        </div>
        <div className='block h-12 lg:hidden'>
          {!isDetailPage && (
            <Button
              variant='contained'
              sx={{ height: '40px' }}
              type='submit'
              form={form}
              disabled={disabled}
              onClick={onSubmit}
              data-testid={`${testId}-save-button-top-mobile`}
            >
              <Typography variant='titleSmallBold' className='capitalize'>
                {label || t('saveAndClose')}
              </Typography>
            </Button>
          )}
        </div>
      </div>
      <div className='flex-1'>{children}</div>
      <div className='hidden h-12 lg:block'>
        {!isDetailPage && !hideButton && (
          <Button
            sx={{ height: '48px' }}
            variant='contained'
            type='submit'
            form={form}
            disabled={disabled}
            onClick={onSubmit}
            data-testid={`${testId}-save-button-top`}
          >
            <Typography variant='titleSmallBold' className='capitalize'>
              {label || t('saveAndClose')}
            </Typography>
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormPageHeader;
