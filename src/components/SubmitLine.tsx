'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { SyntheticEvent } from 'react';
import { twMerge } from 'tailwind-merge';

import { useTranslations } from '@/hooks/translation';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  testId: string;
  className?: string;
  hideCancel?: boolean;
  disableButtons?: boolean;
  primaryButtonText?: string;
  isPrimaryButtonFirst?: boolean;
  onSubmit?: (e: SyntheticEvent) => void;
  onCancel?: (e: SyntheticEvent) => void;
}

const SubmitLine = ({
  testId,
  onSubmit,
  onCancel,
  className,
  disableButtons,
  primaryButtonText,
  hideCancel = false,
  isPrimaryButtonFirst = true,
  ...props
}: Props) => {
  const t = useTranslations('actions');
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const onCancelClick = (e: SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onCancel) onCancel(e);
    else goBack();
  };

  return (
    <div
      className={twMerge(
        'flex gap-6 pl-6 pt-5 border border-solid border-t-secondary-300 border-x-0 border-b-0 pb-9',
        className
      )}
      {...props}
    >
      {isPrimaryButtonFirst ? (
        <>
          <Button
            type='submit'
            onClick={onSubmit}
            variant='contained'
            data-testid={`${testId}-save-btn`}
            sx={{
              textTransform: 'none',
              height: '48px',
            }}
            disabled={disableButtons}
          >
            <Typography variant='titleSmallBold' className='capitalize'>
              {primaryButtonText || t('saveAndClose')}
            </Typography>
          </Button>
          {!hideCancel && (
            <Button
              onClick={onCancelClick}
              disabled={disableButtons}
              data-testid={`${testId}-cancel-btn`}
              sx={{ textTransform: 'none' }}
            >
              <Typography variant='titleSmallBold' className='capitalize'>
                {t('cancel')}
              </Typography>
            </Button>
          )}
        </>
      ) : (
        <>
          <Button
            onClick={onCancelClick}
            disabled={disableButtons}
            sx={{ textTransform: 'none' }}
            data-testid={`${testId}-cancel-btn`}
          >
            <Typography variant='titleSmallBold' className='capitalize'>
              {t('cancel')}
            </Typography>
          </Button>
          <Button
            type='submit'
            onClick={onSubmit}
            variant='contained'
            data-testid={`${testId}-save-btn`}
            disabled={disableButtons}
            sx={{ textTransform: 'none', height: '40px' }}
          >
            <Typography variant='titleSmallBold' className='capitalize'>
              {primaryButtonText || t('saveAndClose')}
            </Typography>
          </Button>
        </>
      )}
    </div>
  );
};

export default SubmitLine;
