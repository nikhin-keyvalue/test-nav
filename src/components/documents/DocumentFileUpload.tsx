'use client';

import { components } from '@generated/documents-types';
import { MenuItem, TextField } from '@mui/material';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import Dialog from '@/components/Dialog';
import FileUpload from '@/components/FileUpload';
import { useTranslations } from '@/hooks/translation';
import { DocumentParentEntities } from '@/types/common';
import { documentUploadAction } from '@/utils/actions/formActions';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

import {
  DocumentSubCategory,
  DocumentSubCategoryWithLabel,
} from '../../containers/opportunities/types';

const DocumentFileUpload = ({
  subcategories,
  parentEntityId,
  category,
  addSubcategory,
  uploadFinishCallback = () => null,
  parentType,
}: {
  subcategories: DocumentSubCategoryWithLabel[];
  parentEntityId: number | string;
  category: components['schemas']['CarStockCategory'];
  addSubcategory: (subcategory: DocumentSubCategory) => void;
  uploadFinishCallback?: (isLoading: boolean) => void;
  parentType: DocumentParentEntities;
}) => {
  const t = useTranslations();
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedValue, setSelectedValue] = useState('');
  const [error, setError] = useState('');
  const [showUploadError, setShowUploadError] = useState(false);
  const rootFormMethods = useFormContext<{
    isLoading: boolean;
    isSuccess: boolean;
  }>();
  const { setValue: setContextFormValue, watch: watchContextFormValue } =
    rootFormMethods;
  const onUploadDialogClose = () => {
    setUploadedFile(null);
    setShowFileUpload(false);
    setSelectedValue('');
    setError('');
  };

  const handleUploadError = () => {
    setShowUploadError(true);
  };
  const clearUploadError = () => {
    setShowUploadError(false);
  };
  const handleSave = async () => {
    setContextFormValue('isLoading', true);
    if (!selectedValue) {
      setError(t('documentUpload.selectDocumentType'));
      setContextFormValue('isLoading', false);
      return;
    }
    if (uploadedFile) {
      setShowFileUpload(false);
      addSubcategory(selectedValue as DocumentSubCategory);
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('category', category);
      formData.append('subcategory', selectedValue);

      const response = await documentUploadAction(
        formData,
        parentEntityId,
        parentType
      );

      uploadFinishCallback(true);
      if (response.success) {
        uploadFinishCallback(false);
        showSuccessToast(t('documentUpload.uploadSuccessful'));
      } else {
        uploadFinishCallback(false);
        handleUploadError();
        showErrorToast(response?.message ?? t('common.somethingWentWrong'));
      }
      setContextFormValue('isLoading', false);
      onUploadDialogClose();
    }
  };

  return (
    <>
      <FileUpload
        onFileSelect={(files: File[]) => {
          setShowFileUpload(true);
          setUploadedFile(files[0]);
        }}
        disabled={watchContextFormValue('isLoading')}
        multiple={false}
        showError={false}
        showProgress={false}
        accept={{
          'image/jpeg': ['.jpg', '.jpeg'],
          'image/png': ['.png'],
          'application/pdf': ['.pdf'],
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            ['.docx'],
        }}
        maxSize={15728640} // 15 mb in bytes
        className='bg-grey-8 py-8'
        handleError={handleUploadError}
      />

      <Dialog
        headerElement={t('documentUpload.uploadFiles')}
        onClose={onUploadDialogClose}
        onSubmit={handleSave}
        isOpen={showFileUpload}
        submitText={t('actions.saveAndClose')}
      >
        <div className='max-w-[22.5rem]'>
          <p className='pb-2'>
            {t('documentUpload.selectSubCategoryMessage', {
              fileName: uploadedFile?.name ?? '-',
            })}
          </p>
          <TextField
            label={t('documentUpload.type')}
            select
            fullWidth
            value={selectedValue}
            onChange={(event) => {
              event.preventDefault();
              setSelectedValue(event.target.value);
              setError('');
            }}
          >
            {subcategories.map((subcategory) => (
              <MenuItem key={subcategory.value} value={subcategory.value}>
                {t(`documents.subcategories.${subcategory.value}`)}
              </MenuItem>
            ))}
          </TextField>
          {error && <div className='text-sm text-primary'>{error}</div>}{' '}
        </div>
      </Dialog>

      <Dialog
        headerElement={t('documentUpload.uploadFiles')}
        onClose={clearUploadError}
        onSubmit={clearUploadError}
        isOpen={showUploadError}
        submitText={t('actions.close')}
        hiddenActions={{ cancel: true, submit: false }}
      >
        <p>{t('documentUpload.errorMessage')}</p>
      </Dialog>
    </>
  );
};

export default DocumentFileUpload;
