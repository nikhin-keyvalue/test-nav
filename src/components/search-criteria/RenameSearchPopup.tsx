'use client';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';

import { searchCriteriaQueryKey } from '@/constants/stockFilters';
import { renameSearchCriteria } from '@/utils/actions/renameSearchCriteria';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

import { SearchCriteriaListItem } from './types';

const queryKey = searchCriteriaQueryKey;
const SEARCH_NAME_MAX_LENGTH = 30;

export const RenameSearchPopup = ({
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
  const [searchName, setSearchName] = useState(criteriaName);
  const [error, setError] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (criteriaName) {
      setSearchName(criteriaName);
    }
  }, [criteriaName]);

  const onSubmit = async () => {
    try {
      const trimmedName = searchName.trim();
      if (!trimmedName.length) {
        setError(true);
        return;
      }
      const formData = new FormData();
      formData.append('name', trimmedName);
      const response = await renameSearchCriteria(formData, id);
      if (response.success) {
        const currentCriteriaList = queryClient.getQueryData(
          queryKey
        ) as Array<SearchCriteriaListItem>;
        const updatedCriteriaList = currentCriteriaList.map((item) => {
          if (item.id === id) {
            return { ...item, name: trimmedName };
          }
          return item;
        });
        queryClient.setQueryData(queryKey, updatedCriteriaList);
        queryClient.invalidateQueries({ queryKey });
        showSuccessToast(t('searchCriteria.updateSuccess'));
      } else {
        showErrorToast(response?.message ?? t('searchCriteria.updateFailed'));
      }
      closePopup();
    } catch (renameError) {
      showErrorToast(t('searchCriteria.updateFailed'));
    }
  };
  const getRemainingLength = () =>
    SEARCH_NAME_MAX_LENGTH - Number(searchName.length);
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
        {t('searchCriteria.renameSearch')}
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
        <DialogContentText>
          <TextField
            label={t('stock.saveSearch.label')}
            fullWidth
            name='searchName'
            value={searchName}
            inputProps={{
              maxLength: SEARCH_NAME_MAX_LENGTH,
            }}
            onChange={(e) => {
              e.stopPropagation();
              setError(false);
              setSearchName(e.target.value);
            }}
            error={error}
          />
          <span className='text-xs text-secondary'>
            {t('common.charactersLeft', {
              count: getRemainingLength(),
            })}
          </span>
        </DialogContentText>
      </DialogContent>
      <DialogActions className='px-6 pb-4 pt-0'>
        <Button
          variant='text'
          color='primary'
          className='font-sans'
          onClick={(e) => {
            e.stopPropagation();
            closePopup();
          }}
        >
          {t('common.cancel')}
        </Button>
        <Button variant='outlined' color='secondary' onClick={onSubmit}>
          {t('common.saveAndClose')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
