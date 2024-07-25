'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import { Button } from '@mui/material';
import { useCallback, useState } from 'react';
import { Accept, FileRejection, useDropzone } from 'react-dropzone';
import { twMerge } from 'tailwind-merge';

import { useTranslations } from '@/hooks/translation';

import { proposalTestIds } from '../../tests/e2e/constants/testIds';
import ProgressBar from './ProgressBar';

const FileUpload = ({
  onFileSelect,
  multiple = true,
  accept,
  showProgress = true,
  showError = true,
  handleError,
  progress = 20,
  maxSize,
  className,
  disabled = false,
}: {
  onFileSelect: (files: File[]) => void;
  className?: string;
  multiple?: boolean;
  accept?: Accept | undefined;
  showProgress?: boolean;
  showError?: boolean;
  progress?: number;
  handleError?: () => void;
  maxSize?: number;
  disabled?: boolean;
}) => {
  const [error, setError] = useState('');
  const t = useTranslations('common');

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setError('');
      if (fileRejections.length > 0) {
        setError(t('invalidFiles'));
        if (handleError) {
          handleError();
        }
      }

      if (fileRejections.length === 0) {
        onFileSelect(acceptedFiles);
      }
    },
    [handleError, onFileSelect, t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept,
    disabled,
    ...(maxSize && { maxSize }),
  });
  const { onClick, ...rootProps } = getRootProps();
  const inputProps = getInputProps();

  return (
    <div
      {...rootProps}
      className={twMerge(
        'box-border w-full bg-grey-8 px-16 py-4 transition duration-300 ease-in-out',
        isDragActive ? 'bg-blue-100 border-blue-500' : '',
        className
      )}
    >
      <input {...inputProps} />
      <div className='flex flex-col items-center justify-center gap-2'>
        <div className='flex flex-row items-center gap-x-6'>
          <p data-testid={`${proposalTestIds.tradeInDragFileText}`}>
            {t('dragFilesHere', { files: multiple ? 2 : 1 })}
          </p>
          <Button
            variant='outlined'
            color='secondary'
            component='label'
            onClick={onClick}
            data-testid={`${proposalTestIds.tradeInDragFileBtn}`}
            disabled={disabled}
            sx={{ textTransform: 'none' }}
          >
            <Typography variant='titleSmallBold'>
              {t('uploadFiles', { files: multiple ? 2 : 1 })}
            </Typography>
          </Button>
        </div>
        {showProgress && (
          <ProgressBar
            testId={proposalTestIds.tradeInDragFileProgressBar}
            progress={progress}
            color='#323C49'
            className='w-1/2'
          />
        )}
        {error && showError && (
          <div
            data-testid={proposalTestIds.tradeInDragFileError}
            className='text-sm text-primary'
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
