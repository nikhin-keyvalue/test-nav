import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { MdClose } from 'react-icons/md';

import { searchCriteriaQueryKey } from '@/constants/stockFilters';
import { deleteSearchCriteria } from '@/utils/actions/deleteSearchCriteria';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

import { SearchCriteriaListItem } from './types';

const queryKey = searchCriteriaQueryKey;

export const DeleteSearchPopup = ({
  id,
  open,
  closePopup,
  criteriaName,
}: {
  id: string;
  open: boolean;
  closePopup: () => void;
  criteriaName: string;
}) => {
  const t = useTranslations();
  const queryClient = useQueryClient();

  const onSubmit = async () => {
    try {
      const response = await deleteSearchCriteria(id);
      if (response.success) {
        const currentCriteriaList = queryClient.getQueryData(
          queryKey
        ) as Array<SearchCriteriaListItem>;
        const updatedCriteriaList = currentCriteriaList.filter(
          (item) => item.id !== id
        );
        queryClient.setQueryData(queryKey, updatedCriteriaList);
        queryClient.invalidateQueries({
          queryKey,
        });
        showSuccessToast(t('searchCriteria.deleteSuccess'));
      } else {
        showErrorToast(response?.message ?? t('searchCriteria.deleteFailed'));
      }
    } catch (deleteError) {
      showErrorToast(t('searchCriteria.deleteFailed'));
    }
    closePopup();
  };

  return (
    <Dialog
      open={open}
      onClose={closePopup}
      className='z-[1401]'
      sx={{
        '& .MuiDialog-container': {
          '& .MuiPaper-root': {
            width: '100%',
            maxWidth: '22.5rem',
          },
        },
      }}
    >
      <DialogTitle className='font-kanit text-[1.375rem] font-semibold'>
        {t('searchCriteria.deleteSearch')}
        <IconButton
          aria-label='close'
          onClick={closePopup}
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
          }}
        >
          <MdClose className='1.25rem text-secondary' />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText className='text-[15px] text-secondary'>
          {t('searchCriteria.deleteConfirmationMessage', {
            filterName: criteriaName || '-',
          })}
        </DialogContentText>
      </DialogContent>
      <DialogActions className='px-6 pb-4 pt-0'>
        <Button
          variant='text'
          color='primary'
          className='font-sans'
          onClick={closePopup}
        >
          {t('common.cancel')}
        </Button>
        <Button variant='outlined' color='secondary' onClick={onSubmit}>
          {t('common.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
