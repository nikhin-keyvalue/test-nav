import { Typography } from '@AM-i-B-V/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogContent, TextField } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import CustomDialog from '@/components/Dialog';
import { useTranslations } from '@/hooks/translation';
import { renameDialogFormType } from '@/types/common';
import { requiredWithRefine } from '@/utils/validations';

const RenameGroupDialog = ({
  open,
  handleClose,
  defaultValue,
  onRename,
}: {
  open: boolean;
  defaultValue: string;
  onRename: (name: renameDialogFormType) => void;
  handleClose: () => void;
}) => {
  const t = useTranslations();
  const tError = useTranslations('validationMessage');

  const formMethods = useForm<renameDialogFormType>({
    resolver: zodResolver(
      z.object({
        name: requiredWithRefine(tError, z.string()),
      })
    ),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={() => {}}>
        <CustomDialog
          isOpen={open}
          headerElement={t('quotations.renameGroup')}
          onClose={handleClose}
          onSubmit={() => {
            handleSubmit(onRename)();
          }}
          submitText={t('common.saveAndClose')}
        >
          <DialogContent sx={{ maxWidth: '360px' }}>
            <Typography variant='textMedium' className='mb-4'>
              {t('quotations.renameOrderLineGroup')}
            </Typography>
            <TextField
              {...register('name')}
              defaultValue={defaultValue}
              sx={{ mb: 2 }}
              label={t('quotations.rename')}
              required
              error={!!errors.name}
              helperText={errors.name?.message || ''}
            />
          </DialogContent>
        </CustomDialog>
      </form>
    </FormProvider>
  );
};

export default RenameGroupDialog;
