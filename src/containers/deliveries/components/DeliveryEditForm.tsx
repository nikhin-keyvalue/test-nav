import { Grid, MenuItem } from '@mui/material';
import { UseFormReturn } from 'react-hook-form';

import { DatePickerWithController, SelectWithController } from '@/components';
import SubmitLine from '@/components/SubmitLine';
import TextFieldWithController from '@/components/TextFieldWithController';
import { useTranslations } from '@/hooks/translation';
import { getDateinDayjs } from '@/utils/date';

import { DeliveryStatusEnum } from '../api/constants';
import { DeliveryStatus, DeliveryUpdateRequest } from '../api/type';

interface CreateEditPersonFormProps {
  isPending: boolean;
  formMethods: UseFormReturn<DeliveryUpdateRequest>;
}

const EditDeliveryForm = (props: CreateEditPersonFormProps) => {
  const t = useTranslations();
  const { isPending, formMethods } = props;

  const {
    control,
    register,
    getValues,
    formState: { isSubmitting },
  } = formMethods;

  return (
    <div className='flex-column h-50% my-5 w-1/2 overflow-hidden'>
      <Grid item sm={5.5} px={3}>
        <Grid container rowSpacing={1}>
          <Grid item container display='flex' columnSpacing={2}>
            <Grid item sm={6}>
              <TextFieldWithController
                fullWidth
                id='name'
                control={control}
                name='name'
                label={t('common.name')}
                required
              />
            </Grid>
            <Grid item sm={6}>
              <SelectWithController
                testId='select-controller-delivery-status'
                defaultValue={getValues('status')}
                control={control}
                name='status'
                label={t('filters.status')}
                options={Object.values(DeliveryStatusEnum)}
                renderOption={(option) => (
                  <MenuItem key={option} value={option}>
                    {t(`deliveries.deliveryStatus.${option as DeliveryStatus}`)}
                  </MenuItem>
                )}
                required
              />
            </Grid>
          </Grid>
          <Grid item container display='flex' columnSpacing={2}>
            <Grid item sm={6}>
              <DatePickerWithController
                control={control}
                format='DD/MM/YYYY'
                name='dealerArrivalDate'
                sx={{ width: '100%' }}
                label={t('deliveries.dealerArrivalDate')}
                defaultValue={getDateinDayjs(getValues('dealerArrivalDate'))}
              />
            </Grid>
            <Grid item sm={6}>
              <DatePickerWithController
                control={control}
                format='DD/MM/YYYY'
                name='customerDeliveryDate'
                sx={{ width: '100%' }}
                label={t('deliveries.customerDeliveryDate')}
                defaultValue={getDateinDayjs(getValues('customerDeliveryDate'))}
              />
            </Grid>
          </Grid>
          <Grid item container display='flex' columnSpacing={2}>
            <Grid item sm={6}>
              <DatePickerWithController
                control={control}
                format='DD/MM/YYYY'
                name='doNotDeliverBefore'
                sx={{ width: '100%' }}
                label={t('deliveries.doNotDeliverBefore')}
                defaultValue={getDateinDayjs(getValues('doNotDeliverBefore'))}
              />
            </Grid>
            <Grid item sm={6}>
              <TextFieldWithController
                fullWidth
                control={control}
                id='currentLocation'
                {...register('currentLocation')}
                label={t('stock.orderTransport.currentLocation')}
              />
            </Grid>
          </Grid>
          <Grid item container display='flex' columnSpacing={2}>
            <Grid item sm={6}>
              <TextFieldWithController
                fullWidth
                control={control}
                id='leaseContactPersons'
                {...register('leaseContactPersons')}
                label={t('deliveries.leaseContactPerson')}
              />
            </Grid>
            <Grid item sm={6}>
              <TextFieldWithController
                fullWidth
                control={control}
                id='leaseOrderNumber'
                {...register('leaseOrderNumber')}
                label={t('deliveries.leaseOrderNumber')}
              />
            </Grid>
          </Grid>
          <Grid item container display='flex' columnSpacing={2}>
            <Grid item sm={6}>
              <TextFieldWithController
                fullWidth
                control={control}
                id='leaseSystem'
                {...register('leaseSystem')}
                label={t('deliveries.leaseSystem')}
              />
            </Grid>
            <Grid item sm={6}>
              <TextFieldWithController
                fullWidth
                control={control}
                id='ascriptionCode'
                {...register('ascriptionCode')}
                label={t('deliveries.ascriptionCode')}
              />
            </Grid>
          </Grid>

          <Grid item container display='flex' columnSpacing={2}>
            <Grid item sm={6}>
              <TextFieldWithController
                fullWidth
                control={control}
                id='licenseCardNumber'
                {...register('licenseCardNumber')}
                label={t('deliveries.licenseCardNumber')}
              />
            </Grid>
            <Grid item sm={6}>
              <TextFieldWithController
                fullWidth
                control={control}
                id='ottCode'
                {...register('ottCode')}
                label={t('deliveries.ottCode')}
              />
            </Grid>
          </Grid>

          <Grid item container display='flex' columnSpacing={2}>
            <Grid item sm={6}>
              <TextFieldWithController
                fullWidth
                control={control}
                id='seller'
                {...register('seller')}
                label={t('deliveries.seller')}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <SubmitLine
        testId='delivery-edit-submit-line'
        className='mt-4'
        disableButtons={isSubmitting || isPending}
      />
    </div>
  );
};

export default EditDeliveryForm;
