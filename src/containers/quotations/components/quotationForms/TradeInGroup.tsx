import { Typography } from '@AM-i-B-V/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Button, Grid, MenuItem } from '@mui/material';
import Image from 'next/image';
import { SyntheticEvent, useEffect, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

import { DatePickerWithController, SelectWithController } from '@/components';
import DutchNumberInputField from '@/components/input-fields/DutchNumberInputField';
import TextFieldWithController from '@/components/TextFieldWithController';
import { useTranslations } from '@/hooks/translation';
import { useSetActiveQuotationForms } from '@/hooks/useSetActiveQuotationForms';
import { VoidFnType } from '@/types/common';
import { formatDate, getDateinDayjs } from '@/utils/date';

import { proposalTestIds } from '../../../../../tests/e2e/constants/testIds';
import { getTradeInVehicleDetails } from '../../api/actions';
import {
  CreateQuotationFormSchema,
  CreateTradeInFormSchema,
  ImageFile,
  LineGroupItemTradeIn,
  TradeInVehicleDetails,
} from '../../api/type';
import {
  CreateQuotationFormNames,
  IOrderLineConfigState,
  MarginOptionsList,
  TradeInToOptionsList,
  TradeInValidation,
} from '../../constants';
import { useCreateQuotationContext } from '../../CreateQuotationContextWrapper';
import { CreateQuotationReducerActionType } from '../../CreateQuotationReducer';
import { calcTradeInTotal } from '../../utils';
import UploadTradeInVehicle from '../UploadTradeInVehicle';

const TradeInGroup = ({
  onCancel,
  tenantGroupId,
  testGroupName,
  onAddTradeInItem,
  onEditTradeInItem,
  tradeInFormConfig,
}: {
  groupName: string;
  onCancel: VoidFnType;
  tenantGroupId: string;
  testGroupName?: string;
  tradeInFormConfig?: IOrderLineConfigState;
  onAddTradeInItem: (data: LineGroupItemTradeIn) => void;
  onEditTradeInItem: (data: LineGroupItemTradeIn & { index: number }) => void;
}) => {
  const t = useTranslations();
  const validationTranslation = useTranslations('validationMessage');

  const formMethods = useForm<CreateTradeInFormSchema>({
    defaultValues: { ...tradeInFormConfig?.data },
    resolver: zodResolver(TradeInValidation(validationTranslation)),
  });
  const {
    watch,
    control,
    register,
    setError,
    setValue,
    getValues,
    clearErrors,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = formMethods;

  const { handleChildFormSubmit } = useSetActiveQuotationForms({
    isDirty,
    tenantGroupId,
  });
  const [uploadPhoto, setUploadPhoto] = useState(false);
  const { dispatch } = useCreateQuotationContext();
  const imageUrls = getValues('imageUrls');

  const { setValue: setParentValues } =
    useFormContext<CreateQuotationFormSchema>();

  useEffect(() => {
    setParentValues('duplicateCheck.isTradeInFormActive', true);
  }, []);

  useEffect(
    () => () => {
      setParentValues('duplicateCheck.isTradeInFormActive', false);
    },
    []
  );

  useEffect(() => {
    const html = document.getElementsByTagName('html')[0];
    if (uploadPhoto) html.classList.add('hide-overflow');
    else html.classList.remove('hide-overflow');
    return () => {
      html.classList.remove('hide-overflow');
    };
  }, [uploadPhoto]);

  const closeUploadPhoto = () => {
    setUploadPhoto(false);
  };

  const addTradeInImages = (images: ImageFile[]) => {
    setValue('imageUrls', images.map((item) => item.location) as string[]);
    dispatch({
      type: CreateQuotationReducerActionType.UPDATE_TRADE_IN_IMAGE_MAP,
      payload: images,
    });
    setUploadPhoto(false);
  };

  const onPrimaryButtonClick = (tradeInFormData: CreateTradeInFormSchema) => {
    handleChildFormSubmit();

    if (tradeInFormConfig?.isEdit)
      onEditTradeInItem({
        ...tradeInFormData,
        index: tradeInFormConfig?.data?.index,
        tradeInDate: formatDate(
          tradeInFormData.tradeInDate as string,
          'YYYY-MM-DD'
        ),
        registrationDate: formatDate(
          tradeInFormData.registrationDate as string,
          'YYYY-MM-DD'
        ),
        totalExclVat: calcTradeInTotal({
          margin: tradeInFormData.margin,
          residualBpm: tradeInFormData.residualBPM,
          tradeInValue: tradeInFormData.tradeInValue,
        }),
        totalInclVat: calcTradeInTotal({
          margin: tradeInFormData.margin,
          residualBpm: tradeInFormData.residualBPM,
          tradeInValue: tradeInFormData.tradeInValue,
        }),
      });
    else
      onAddTradeInItem({
        ...tradeInFormData,
        tradeInDate: formatDate(
          tradeInFormData.tradeInDate as string,
          'YYYY-MM-DD'
        ),
        registrationDate: formatDate(
          tradeInFormData.registrationDate as string,
          'YYYY-MM-DD'
        ),
        totalExclVat: calcTradeInTotal({
          margin: tradeInFormData.margin,
          residualBpm: tradeInFormData.residualBPM,
          tradeInValue: tradeInFormData.tradeInValue,
        }),
        totalInclVat: calcTradeInTotal({
          margin: tradeInFormData.margin,
          residualBpm: tradeInFormData.residualBPM,
          tradeInValue: tradeInFormData.tradeInValue,
        }),
      });
  };

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(onPrimaryButtonClick)();
  };

  const licensePlate = watch('licensePlate');
  const vin = watch('vin');
  const orderId = watch('orderId');

  const fetchTradeInData = async () => {
    const vehicleDetails = (await getTradeInVehicleDetails({
      licensePlate: licensePlate!,
    })) as TradeInVehicleDetails;

    if (vehicleDetails.bpm) setValue('originalBPM', vehicleDetails.bpm);
    if (vehicleDetails.rdwColor) setValue('colour', vehicleDetails.rdwColor);
    if (vehicleDetails.restBPM) setValue('residualBPM', vehicleDetails.restBPM);
    if (vehicleDetails.dateFirstRecognition)
      setValue('registrationDate', vehicleDetails.dateFirstRecognition);
    if (vehicleDetails.carBrand || vehicleDetails.carGrade)
      setValue(
        'description',
        `${vehicleDetails.carBrand} ${vehicleDetails.carGrade}`
      );
  };

  const handleFindVehicle = () => {
    if (!licensePlate && !vin && !orderId) {
      setError('licensePlate', {
        message: t('validationMessage.tradeInValidationMessage'),
      });
      setError('vin', {
        message: t('validationMessage.tradeInValidationMessage'),
      });
      setError('orderId', {
        message: t('validationMessage.tradeInValidationMessage'),
      });
    } else {
      clearErrors(['licensePlate', 'vin', 'orderId']);
      fetchTradeInData();
    }
  };

  return (
    <>
      <FormProvider {...formMethods}>
        <Grid container spacing={2}>
          <Grid item md={6} sm={12} xs={12}>
            <div className='grid h-full min-h-[160px] place-items-center rounded-[4px] bg-grey-8 p-4'>
              {imageUrls && imageUrls.length > 0 ? (
                <div className='flex h-full w-full flex-wrap justify-between gap-6'>
                  <Image
                    unoptimized
                    src={imageUrls[0]}
                    alt='Trade-in Image'
                    className='max-h-[160px]'
                    width={160}
                    height={160}
                    data-TestId={`${testGroupName}${proposalTestIds.tradeInImage}`}
                  />
                  <div>
                    <Button
                      variant='outlined'
                      color='secondary'
                      component='label'
                      onClick={() => setUploadPhoto(true)}
                      data-TestId={`${testGroupName}${proposalTestIds.tradeInImageUploadGearBtn}`}
                    >
                      <SettingsOutlinedIcon />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant='outlined'
                  color='secondary'
                  component='label'
                  sx={{ textTransform: 'none' }}
                  onClick={() => setUploadPhoto(true)}
                  startIcon={<UploadFileIcon sx={{ fontSize: 20 }} />}
                  data-TestId={`${testGroupName}${proposalTestIds.tradeInImageUploadBtn}`}
                >
                  <Typography variant='titleSmallBold'>
                    {t('quotations.lineGroups.tradeIn.uploadPhotos')}
                  </Typography>
                </Button>
              )}
            </div>
          </Grid>
          <Grid item md={6} sm={12} xs={12}>
            <TextFieldWithController
              multiline
              control={control}
              testId={`${testGroupName}${proposalTestIds.tradeInBrandModelDescription}`}
              label={t('quotations.lineGroups.tradeIn.brandModelDescription')}
              rows={6}
              {...register('description')}
              required
            />
          </Grid>
          <Grid item md={3} sm={6} xs={6}>
            <TextFieldWithController
              control={control}
              label={t('quotations.lineGroups.tradeIn.licensePlate')}
              testId={`${testGroupName}${proposalTestIds.tradeInLicensePlate}`}
              {...register(CreateQuotationFormNames.LICENSE_PLATE)}
              onBlur={handleFindVehicle}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleFindVehicle();
                }
              }}
            />
          </Grid>
          <Grid item md={3} sm={6} xs={6}>
            <DutchNumberInputField
              control={control}
              label={t('quotations.lineGroups.tradeIn.mileage')}
              defaultValue={tradeInFormConfig?.data?.mileage}
              name={CreateQuotationFormNames.MILEAGE}
              testId={`${testGroupName}${proposalTestIds.tradeInMileage}`}
              variantType='default'
              required
            />
          </Grid>
          <Grid item md={3} sm={6} xs={6}>
            <TextFieldWithController
              control={control}
              label={t('quotations.lineGroups.tradeIn.vin')}
              testId={`${testGroupName}${proposalTestIds.tradeInVin}`}
              {...register(CreateQuotationFormNames.VIN)}
            />
          </Grid>
          <Grid item md={3} sm={6} xs={6}>
            <TextFieldWithController
              control={control}
              label={t('quotations.lineGroups.tradeIn.orderId')}
              testId={`${testGroupName}${proposalTestIds.tradeInOrderId}`}
              {...register(CreateQuotationFormNames.ORDER_ID)}
            />
          </Grid>
          <Grid item md={6} sm={12} xs={12}>
            <TextFieldWithController
              required
              control={control}
              label={t('quotations.lineGroups.tradeIn.color')}
              testId={`${testGroupName}${proposalTestIds.tradeInColor}`}
              name='colour'
            />
          </Grid>
          <Grid item md={6} sm={12} xs={12}>
            <DatePickerWithController
              control={control}
              required
              format='DD/MM/YYYY'
              name='registrationDate'
              testId={`${testGroupName}${proposalTestIds.tradeRegistrationDate}`}
              sx={{ width: '100%' }}
              label={t('quotations.lineGroups.tradeIn.registrationDate')}
              defaultValue={getDateinDayjs(getValues('registrationDate'))}
            />
          </Grid>

          <Grid item md={3} sm={6} xs={6}>
            <DutchNumberInputField
              control={control}
              name={CreateQuotationFormNames.TRADE_IN_VALUE}
              testId={`${testGroupName}${proposalTestIds.tradeInValue}`}
              defaultValue={tradeInFormConfig?.data?.tradeInValue}
              label={t('quotations.lineGroups.tradeIn.tradeInValue')}
              variantType='currency'
              required
            />
          </Grid>
          <Grid item md={3} sm={6} xs={6}>
            <DutchNumberInputField
              defaultValue={tradeInFormConfig?.data?.valuation}
              testId={`${testGroupName}${proposalTestIds.tradeInValuation}`}
              control={control}
              name={CreateQuotationFormNames.VALUATION}
              label={t('quotations.lineGroups.tradeIn.valuation')}
              variantType='currency'
            />
          </Grid>

          <Grid item md={3} sm={6} xs={6}>
            <DutchNumberInputField
              control={control}
              label={t('quotations.lineGroups.tradeIn.originalBPM')}
              testId={`${testGroupName}${proposalTestIds.tradeInOriginalBPM}`}
              defaultValue={
                watch('originalBPM') || tradeInFormConfig?.data?.originalBPM
              }
              name={CreateQuotationFormNames.ORIGINAL_BPM}
              variantType='currency'
            />
          </Grid>
          <Grid item md={3} sm={6} xs={6}>
            <DutchNumberInputField
              control={control}
              testId={`${testGroupName}${proposalTestIds.tradeInResidualBPM}`}
              defaultValue={
                watch('residualBPM') || tradeInFormConfig?.data?.residualBPM
              }
              name={CreateQuotationFormNames.RESIDUAL_BPM}
              label={t('quotations.lineGroups.tradeIn.residualBPM')}
              variantType='currency'
              required={watch('margin') === 'VATVehicle'}
            />
          </Grid>
          <Grid item md={6} sm={12} xs={12}>
            <DatePickerWithController
              testId={`${testGroupName}${proposalTestIds.tradeInDate}`}
              control={control}
              format='DD/MM/YYYY'
              name='tradeInDate'
              sx={{ width: '100%' }}
              label={t('quotations.lineGroups.tradeIn.tradeInDate')}
              defaultValue={getDateinDayjs(getValues('tradeInDate'))}
            />
          </Grid>
          <Grid item md={3} sm={6} xs={6}>
            <SelectWithController
              testId={`${testGroupName}${proposalTestIds.tradeInInto}`}
              control={control}
              name='tradeInTo'
              label={t('quotations.lineGroups.tradeIn.tradeInTo')}
              options={TradeInToOptionsList}
              renderOption={(option) => (
                <MenuItem
                  key={option}
                  data-testid={`${testGroupName}${proposalTestIds.tradeInInto}-${option}`}
                  value={option}
                >
                  {t(`tradeInTo.${option}`)}
                </MenuItem>
              )}
              required
            />
          </Grid>
          <Grid item md={3} sm={6} xs={6}>
            <SelectWithController
              control={control}
              name='margin'
              label={t('quotations.lineGroups.tradeIn.margin')}
              testId={`${testGroupName}${proposalTestIds.tradeInMargin}`}
              options={MarginOptionsList}
              renderOption={(option) => (
                <MenuItem
                  key={option}
                  value={option}
                  data-testid={`${testGroupName}${proposalTestIds.tradeInMargin}-${option}`}
                >
                  {t(`margin.${option}`)}
                </MenuItem>
              )}
              required
            />
          </Grid>
        </Grid>
        <div className='flex w-full justify-end'>
          <div className='flex gap-5 pb-9 pl-6 pt-5'>
            <Button
              onClick={onCancel}
              sx={{ textTransform: 'none' }}
              data-testid={`${proposalTestIds.addTradeInSubmitBtn}-cancel-btn`}
            >
              <Typography variant='titleSmallBold' className='capitalize'>
                {t('actions.cancel')}
              </Typography>
            </Button>
            <Button
              type='submit'
              variant='outlined'
              onClick={onSubmit}
              disabled={isSubmitting}
              sx={{ textTransform: 'none', height: '40px' }}
              className='border-secondary text-secondary'
              data-testid={`${proposalTestIds.addTradeInSubmitBtn}-save-btn`}
            >
              <Typography variant='titleSmallBold' className='capitalize'>
                {t('actions.done')}
              </Typography>
            </Button>
          </div>
        </div>
      </FormProvider>
      {uploadPhoto && (
        <UploadTradeInVehicle
          closeUploadPhoto={closeUploadPhoto}
          addTradeInImages={addTradeInImages}
          images={imageUrls || []}
          tradeInId={tradeInFormConfig?.data?.productId}
        />
      )}
    </>
  );
};

export default TradeInGroup;
