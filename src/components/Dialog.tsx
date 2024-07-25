import { Typography } from '@AM-i-B-V/ui-kit';
import { Button, DialogActions, DialogContent, styled } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import Link from 'next/link';
import { IoClose } from 'react-icons/io5';

import { useTranslations } from '@/hooks/translation';

import { generalTestIds } from '../../tests/e2e/constants/testIds';
import Spinner from './Spinner';

interface ICustomDialogProps {
  isOpen: boolean;
  hiddenActions?: {
    cancel: boolean;
    submit: boolean;
  };
  headerElement: string | React.ReactNode;
  disabled?: boolean;
  onClose: () => void;
  cancelText?: string;
  submitText?: string;
  isLoading?: boolean;
  onSubmit: () => void;
  redirectLink?: string;
  children: React.ReactNode;
  testId?: string;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(0),
  },
}));

const CustomDialog = ({
  isOpen,
  onClose,
  children,
  onSubmit,
  cancelText,
  submitText,
  redirectLink,
  headerElement,
  disabled = false,
  isLoading = false,
  hiddenActions = { cancel: false, submit: false },
  testId,
}: ICustomDialogProps) => {
  const t = useTranslations('actions');
  return (
    <BootstrapDialog
      open={isOpen}
      onClose={() => {
        if (!disabled) onClose();
      }}
      data-testid={testId}
    >
      <div className='relative h-full w-full' data-testid={`${testId}-content`}>
        {isLoading ? (
          <>
            <div className='absolute z-10 flex h-full w-full items-center justify-center bg-secondary opacity-20' />
            <div className='absolute z-20 flex h-full w-full items-center justify-center'>
              <Spinner />
            </div>
          </>
        ) : (
          <> </>
        )}

        <div className='p-4'>
          <div className='mb-4 min-w-[360px]'>
            <div className='flex justify-between'>
              <Typography
                variant='titleMediumBold'
                data-testid={`${testId}-header-text`}
              >
                {headerElement}
              </Typography>
              <IoClose
                className='cursor-pointer text-2xl'
                data-testid={`${testId}-close-btn`}
                onClick={() => onClose()}
              />
            </div>
          </div>
          <DialogContent>{children}</DialogContent>
          <DialogActions className='mt-2 flex justify-end pr-0'>
            {!hiddenActions.cancel && (
              <Button
                onClick={onClose}
                sx={{ textTransform: 'none' }}
                disabled={disabled}
                data-testid={generalTestIds.customModalCancel}
              >
                <Typography variant='textMediumBold'>
                  {cancelText || t('cancel')}{' '}
                </Typography>
              </Button>
            )}
            {!hiddenActions.submit && (
              <Button
                variant='outlined'
                color='secondary'
                size='large'
                onClick={onSubmit}
                type='submit'
                sx={{ textTransform: 'none' }}
                disabled={disabled}
                data-testid={generalTestIds.customModalSubmit}
              >
                {redirectLink ? (
                  <Link
                    href={redirectLink}
                    className='text-primary !no-underline'
                    prefetch={false}
                    target='_blank'
                    rel='noreferrer'
                  >
                    <Typography variant='titleSmallBold'>
                      {submitText || t('add')}
                    </Typography>
                  </Link>
                ) : (
                  <Typography variant='titleSmallBold'>
                    {submitText || t('add')}
                  </Typography>
                )}
              </Button>
            )}
          </DialogActions>
        </div>
      </div>
    </BootstrapDialog>
  );
};

export default CustomDialog;
