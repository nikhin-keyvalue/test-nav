import { zodResolver } from '@hookform/resolvers/zod';
import { Grid, MenuItem } from '@mui/material';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { SyntheticEvent } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import {
  DatePickerWithController,
  SelectWithController,
  TextFieldWithController,
} from '@/components';
import DutchNumberInputField from '@/components/input-fields/DutchNumberInputField';
import SubmitLine from '@/components/SubmitLine';
import { formatDate, getDateinDayjs } from '@/utils/date';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

import { createBonus, updateBonus } from '../../api/actions';
import { BonusRequestData, BonusResponseData } from '../../api/type';
import { BonusValidation, PayoutAfterOptionList } from '../../constants';

interface BonusFormProps {
  handleClose: () => void;
  bonusData?: BonusResponseData;
}

const BonusForm = ({ handleClose, bonusData }: BonusFormProps) => {
  const t = useTranslations();
  const validationTranslation = useTranslations('validationMessage');

  const { id: deliveryId } = useParams();
  const formMethods = useForm<BonusRequestData>({
    defaultValues: bonusData,
    resolver: zodResolver(BonusValidation(validationTranslation)),
  });
  const {
    handleSubmit,
    register,
    control,
    formState: { isSubmitting },
    getValues,
  } = formMethods;

  const onPrimaryButtonClick = async (bonusFormData: BonusRequestData) => {
    const modifiedData = {
      ...bonusFormData,
      bonusMonth: formatDate(bonusFormData.bonusMonth as string, 'YYYY-MM-DD'),
      ...(bonusFormData.receivedOn && {
        receivedOn: formatDate(
          bonusFormData.receivedOn as string,
          'YYYY-MM-DD'
        ),
      }),
    };

    let res;
    if (bonusData?.id)
      res = await updateBonus({
        body: modifiedData,
        pathParams: { id: bonusData?.id, deliveryId: deliveryId as string },
      });
    else res = await createBonus(modifiedData, deliveryId as string);

    if (res.success) {
      showSuccessToast(t('common.savedSuccessfully'));
      handleClose();
    } else {
      showErrorToast(t('common.somethingWentWrong'));
    }
  };

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(onPrimaryButtonClick)();
  };

  return (
    <FormProvider {...formMethods}>
      <Grid
        container
        spacing={2}
        className='ml-0 mt-6 w-full bg-grey-4 px-6 py-4'
      >
        <Grid item md={6} sm={12} xs={12}>
          <TextFieldWithController
            control={control}
            label={t('deliveries.bonus.bonusTitle')}
            rows={6}
            {...register('title')}
            required
          />
        </Grid>
        <Grid item md={6} sm={12} xs={12}>
          <SelectWithController
            testId='select-controller-payout-after'
            control={control}
            name='payoutAfter'
            label={t('deliveries.bonus.payoutAfter')}
            options={PayoutAfterOptionList}
            renderOption={(option) => (
              <MenuItem key={option} value={option}>
                {t(`payoutAfter.${option}`)}
              </MenuItem>
            )}
            required
          />
        </Grid>
        <Grid container spacing={2} item md={6} sm={12} className='flex'>
          <Grid item xs={6}>
            <DutchNumberInputField
              defaultValue={bonusData?.bonusPercentage}
              control={control}
              name='bonusPercentage'
              label={t('deliveries.bonus.bonusPercentage')}
              variantType='percentage'
            />
          </Grid>
          <Grid item xs={6}>
            <DutchNumberInputField
              defaultValue={bonusData?.bonusAmount}
              control={control}
              name='bonusAmount'
              label={t('deliveries.bonus.bonusAmount')}
              variantType='currency'
            />
          </Grid>
          <Grid item xs={6}>
            <DatePickerWithController
              control={control}
              format='MMM YYYY'
              name='bonusMonth'
              sx={{ width: '100%' }}
              label={t('deliveries.bonus.bonusMonth')}
              views={['month', 'year']}
              defaultValue={getDateinDayjs(getValues('bonusMonth'))}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <DatePickerWithController
              control={control}
              format='DD/MM/YYYY'
              name='receivedOn'
              sx={{ width: '100%' }}
              label={t('deliveries.bonus.receivedOn')}
              defaultValue={getDateinDayjs(getValues('receivedOn'))}
            />
          </Grid>
        </Grid>
        <Grid item md={6} sm={12} xs={12}>
          <TextFieldWithController
            multiline
            control={control}
            label={t('deliveries.bonus.comment')}
            rows={4}
            {...register('comment')}
          />
        </Grid>
        <div className='flex w-full justify-end'>
          <SubmitLine
            testId='bonus-submit-line'
            isPrimaryButtonFirst={false}
            className='border-none'
            primaryButtonText={t('actions.done')}
            onSubmit={onSubmit}
            onCancel={handleClose}
            disableButtons={isSubmitting}
          />
        </div>
      </Grid>
    </FormProvider>
  );
};

export default BonusForm;
