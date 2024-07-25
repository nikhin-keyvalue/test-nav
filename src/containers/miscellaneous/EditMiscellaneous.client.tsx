'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
import { FC, useTransition } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import CheckboxWithController from '@/components/CheckboxWithController';
import FormPageHeader from '@/components/FormPageHeader';
import SubmitLine from '@/components/SubmitLine';
import { useTranslations } from '@/hooks/translation';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

import { editMiscellaneousTestIds } from '../../../tests/e2e/constants/testIds';
import { editMiscellaneousSettings } from './api/actions';
import { EditMiscellaneousValidationSchema } from './constants';
import {
  EditMiscellaneousFormProps,
  MiscellaneousSettingsResponse,
} from './types';

interface EditMiscellaneousProps {
  details: MiscellaneousSettingsResponse;
}

const EditMiscellaneous: FC<EditMiscellaneousProps> = ({ details }) => {
  const t = useTranslations();
  const miscellaneousTranslations = useTranslations('settings.miscellaneous');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const formMethods = useForm<EditMiscellaneousFormProps>({
    defaultValues: {
      showProposalPreviewOnCreate: details?.proposalPreviewOnCreate ?? false,
      publishOnlineProposalPriorSigning:
        details?.publishOnlineProposalPriorSigning ?? false,
    },
    resolver: zodResolver(EditMiscellaneousValidationSchema(t)),
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = formMethods;

  const onEditMiscellaneous = async (data: EditMiscellaneousFormProps) => {
    const { showProposalPreviewOnCreate, publishOnlineProposalPriorSigning } =
      data;

    const editPayload = {
      proposalPreviewOnCreate: showProposalPreviewOnCreate,
      publishOnlineProposalPriorSigning,
    };

    const res = await editMiscellaneousSettings(editPayload);

    if (res?.success) {
      showSuccessToast(t('common.savedSuccessfully'));
      router.push('/crm-settings');
    } else {
      showErrorToast(t('common.somethingWentWrong'));
    }
  };

  const onFormSubmit = (data: EditMiscellaneousFormProps) => {
    startTransition(() => {
      onEditMiscellaneous(data);
    });
  };

  return (
    <Box className='m-3'>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
          <FormPageHeader
            saveButtonProps={{ disabled: isPending || isSubmitting }}
          >
            <Typography variant='titleLargeBold' className='text-secondary'>
              {miscellaneousTranslations('title')}
            </Typography>
          </FormPageHeader>
          <Grid container direction='column' className='mt-8'>
            <Grid container item direction='column' className='px-6'>
              <Grid item>
                <CheckboxWithController
                  labelProps={{
                    label: miscellaneousTranslations(
                      'showProposalPreviewOnCreateCheckboxLabel'
                    ),
                  }}
                  checkboxProps={{
                    name: 'showProposalPreviewOnCreate',
                    control,
                    checkboxTestId:
                      editMiscellaneousTestIds.showProposalPreviewOnCreateCheckbox,
                  }}
                />
              </Grid>
              <Grid item>
                <CheckboxWithController
                  labelProps={{
                    label: miscellaneousTranslations(
                      'publishOnlineProposalPriorSigningCheckboxLabel'
                    ),
                  }}
                  checkboxProps={{
                    name: 'publishOnlineProposalPriorSigning',
                    control,
                    checkboxTestId:
                      editMiscellaneousTestIds.publishOnlineProposalPriorSigningCheckbox,
                  }}
                />
              </Grid>
            </Grid>
            <Grid item>
              <SubmitLine
                testId={editMiscellaneousTestIds.submitBtnBottom}
                className='mt-8'
                disableButtons={isSubmitting || isPending}
              />
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </Box>
  );
};

export default EditMiscellaneous;
