'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { SyntheticEvent } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import SubmitLine from '@/components/SubmitLine';

import FormPageHeader from '../FormPageHeader';

const DocumentEditForm = ({
  internalList,
  entityName,
}: {
  internalList?: JSX.Element;
  entityName: string;
}) => {
  const t = useTranslations('documents');
  const { back } = useRouter();

  const onFormSubmit = (
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>
  ) => {
    event.preventDefault();
    back();
  };

  const contextForm = useForm<{
    isLoading: boolean;
    isSuccess: boolean;
  }>({
    defaultValues: { isLoading: false, isSuccess: false },
  });
  const { getValues: getContextFormValues } = contextForm;

  return (
    <FormProvider {...contextForm}>
      <FormPageHeader
        saveButtonProps={{ disabled: getContextFormValues('isLoading') }}
      >
        <Typography variant='titleLargeBold' className='text-secondary'>
          {t('manageDocuments')} {entityName}
        </Typography>
      </FormPageHeader>

      <form onSubmit={onFormSubmit} id='editDocumentsForm'>
        <div className='grid gap-x-[4.5rem] gap-y-6 px-6 py-8 lg:grid-cols-2'>
          {/* Internal */}
          <div className='flex flex-col gap-y-4'>
            <p className='m-0 font-kanit text-[1.375rem] font-semibold'>
              {t('forInternalUse')}
            </p>
            {internalList}
          </div>
        </div>
        <SubmitLine
          testId='document-edit-submit-line'
          disableButtons={getContextFormValues('isLoading')}
        />
      </form>
    </FormProvider>
  );
};

export default DocumentEditForm;
