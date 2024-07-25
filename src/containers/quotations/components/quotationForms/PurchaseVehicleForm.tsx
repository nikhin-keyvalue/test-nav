import { Typography } from '@AM-i-B-V/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid } from '@mui/material';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SyntheticEvent, useEffect, useState } from 'react';
import {
  FormProvider,
  useForm,
  useFormContext,
  UseFormWatch,
} from 'react-hook-form';
import { MdSearch } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';

import { CustomDialog, DatePickerWithController } from '@/components';
import DutchNumberInputField from '@/components/input-fields/DutchNumberInputField';
import ReadOnlyTextField from '@/components/input-fields/ReadOnlyTextField';
import TextFieldWithController from '@/components/TextFieldWithController';
import { setQuotationDetailsInLocalStorage } from '@/containers/vehicles/constants';
import { useTranslations } from '@/hooks/translation';
import { useSetActiveQuotationForms } from '@/hooks/useSetActiveQuotationForms';
import { VoidFnType } from '@/types/common';
import { generateSession, getEmptyValue } from '@/utils/common';
import { getDateinDayjs } from '@/utils/date';

import { proposalTestIds } from '../../../../../tests/e2e/constants/testIds';
import {
  CreateQuotationFormSchema,
  LineGroupItemPurchase,
  LineGroupItemPurchaseExtra,
} from '../../api/type';
import {
  CreateQuotationFormNames,
  IOrderLineConfigState,
  PurchaseFormValidationSchema,
  tenantGroupIdMap,
} from '../../constants';

const EmptyImage = require('@/assets/emptyImage.svg');

const PurchaseVehicleForm = ({
  mainFormData,
  onCancel,
  tenantGroupId,
  testGroupName,
  onAddPurchaseItem,
  purchaseFormConfig,
  onEditPurchaseItem,
}: {
  mainFormData: UseFormWatch<CreateQuotationFormSchema>;
  groupName: string;
  tenantGroupId: string;
  testGroupName?: string;
  onAddPurchaseItem: (
    data: LineGroupItemPurchase & LineGroupItemPurchaseExtra
  ) => void;
  purchaseFormConfig?: IOrderLineConfigState;
  onEditPurchaseItem: (
    data: LineGroupItemPurchase & LineGroupItemPurchaseExtra
  ) => void;
  onCancel: VoidFnType;
}) => {
  const t = useTranslations();
  const validationTranslation = useTranslations('validationMessage');
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [hasUnsavedForms, setHasUnsavedForms] = useState(false);

  const { watch: parentWatch, setValue: setParentValues } =
    useFormContext<CreateQuotationFormSchema>();

  const formMethods = useForm<
    LineGroupItemPurchase & LineGroupItemPurchaseExtra
  >({
    defaultValues: {
      // calc:add correct value
      BPM: purchaseFormConfig?.data?.BPM,
      vin: purchaseFormConfig?.data?.vin,
      name: purchaseFormConfig?.data?.name,
      discount: purchaseFormConfig?.data?.discount,
      imageUrls: purchaseFormConfig?.data?.imageUrls,
      carstockId: purchaseFormConfig?.data?.carstockId,
      description: purchaseFormConfig?.data?.description,
      licensePlate: purchaseFormConfig?.data?.licensePlate,
      totalExclVat: purchaseFormConfig?.data?.totalExclVat,
      totalInclVat: purchaseFormConfig?.data?.totalInclVat,
      vehiclePrice: purchaseFormConfig?.data?.vehiclePrice,
      newLicenseDate: getDateinDayjs(purchaseFormConfig?.data?.licenseDate),
      newDeliveryDate: getDateinDayjs(purchaseFormConfig?.data?.deliveryDate),
      driver:
        purchaseFormConfig?.data?.driver ||
        parentWatch('opportunityCustomerName'),
    },
    resolver: zodResolver(PurchaseFormValidationSchema(validationTranslation)),
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { isDirty },
    setValue,
  } = formMethods;

  const { handleChildFormSubmit } = useSetActiveQuotationForms({
    isDirty,
    tenantGroupId,
  });

  useEffect(() => {
    setParentValues('duplicateCheck.isPurchaseFormActive', true);
  }, []);

  useEffect(
    () => () => {
      setParentValues('duplicateCheck.isPurchaseFormActive', false);
    },
    []
  );

  const tenantGroup = tenantGroupIdMap[Number(tenantGroupId) || 0];

  const vatType = parentWatch(CreateQuotationFormNames.VAT_TYPE);

  const onPrimaryButtonClick = (
    data: LineGroupItemPurchase & LineGroupItemPurchaseExtra
  ) => {
    const newPurchaseItem = {
      ...data,
      deliveryDate: data?.newDeliveryDate?.format('YYYY-MM-DD') || '',
      licenseDate: data?.newLicenseDate?.format('YYYY-MM-DD') || '',
    };

    delete newPurchaseItem.newDeliveryDate;
    delete newPurchaseItem.newLicenseDate;

    handleChildFormSubmit();

    if (purchaseFormConfig?.isEdit) {
      const modifiedlineGroupPurchaseItem: LineGroupItemPurchase & {
        index: number;
      } = {
        ...newPurchaseItem,
        index: purchaseFormConfig?.data?.index || 0,
        id: purchaseFormConfig?.data?.id,
        totalExclVat: purchaseFormConfig?.data?.totalExclVat,
      };
      onEditPurchaseItem(modifiedlineGroupPurchaseItem);
      return;
    }
    onAddPurchaseItem(newPurchaseItem);
  };

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(onPrimaryButtonClick)();
  };

  const formData = mainFormData();
  const handleRedirectionToVehicleSelection = async () => {
    if (!formData.sessionId) formData.sessionId = generateSession();
    formData.purchaseTenantId = tenantGroupId;
    formData.duplicateCheck.isPurchaseFormActive = false;
    const opportunityId = searchParams.get('opportunityId') as string;
    const redirectUrl = `${pathName}${
      opportunityId ? `?opportunityId=${opportunityId}` : ''
    }`;
    setQuotationDetailsInLocalStorage({
      formData,
      redirectUrl,
      setExpiry: true,
    });

    const { activeForms } = formData;
    delete activeForms[tenantGroup];

    if (Object.values(activeForms).some((value) => value)) {
      setHasUnsavedForms(true);
      return;
    }
    router.push(`/vehicles`);
  };

  const purchaseFormData = formMethods.watch();

  return (
    <>
      <FormProvider {...formMethods}>
        <form onSubmit={() => null}>
          <Grid container columnSpacing={3} rowSpacing={2}>
            <Grid item lg={6}>
              {purchaseFormData?.carstockId ? (
                <div className=' h-[243px] w-full flex-col items-center justify-between rounded border p-1'>
                  <div className='flex h-3/5 w-full justify-between p-2'>
                    <Image
                      unoptimized
                      src={purchaseFormData.imageUrls?.[0] || EmptyImage}
                      alt='Car'
                      width={170}
                      height={100}
                      data-testid={`${testGroupName}${proposalTestIds.purchaseVehicleImage}`}
                    />
                    <div
                      className='flex size-[40px] cursor-pointer items-center justify-center rounded border-2 border-black'
                      data-testid={
                        proposalTestIds.deletePurchaseVehicleImageBtn
                      }
                      role='presentation'
                      onClick={() => {
                        Object.keys(purchaseFormData).forEach((key) =>
                          setValue(
                            key as keyof LineGroupItemPurchase,
                            getEmptyValue(
                              purchaseFormData[
                                key as keyof LineGroupItemPurchase
                              ] as unknown
                            )
                          )
                        );
                        setParentValues(`${tenantGroup}.purchases`, []);
                      }}
                    >
                      <RiDeleteBin6Line size='20px' />
                    </div>
                  </div>
                  <div className='ml-2'>
                    <Typography variant='textSmall' className='text-secondary'>
                      {purchaseFormData.licensePlate ||
                        purchaseFormData.vin ||
                        '-'}
                    </Typography>
                  </div>
                </div>
              ) : (
                <div className='flex h-[250px] items-center justify-center rounded border bg-grey-8'>
                  <div
                    className='flex cursor-pointer items-center rounded border-2 border-black bg-white p-2 !py-1'
                    onClick={handleRedirectionToVehicleSelection}
                    role='presentation'
                    data-testid={`${testGroupName}${proposalTestIds.findVehicleField}`}
                  >
                    <MdSearch size={20} />
                    <Typography variant='titleSmallBold' className='ml-2'>
                      {t('quotations.findVehicle')}
                    </Typography>
                  </div>
                </div>
              )}
            </Grid>
            <Grid item lg={6}>
              {/* <div className='h-[250px] rounded border px-3 py-4'>
              brand and model description
            </div> */}
              <TextFieldWithController
                defaultValue=''
                testId={`${testGroupName}${proposalTestIds.purchaseVehicleDescription}`}
                id='description'
                multiline
                rows={9}
                key='description'
                control={control}
                label={t('common.brand-description')}
                disabled={!purchaseFormData.carstockId}
                {...register(CreateQuotationFormNames.DESCRIPTION)}
                required
              />
            </Grid>
            <Grid item lg={6} sm={12}>
              <DutchNumberInputField
                control={control}
                testId={`${testGroupName}${proposalTestIds.purchaseVehicleVehiclePriceExclVat}`}
                label={t('common.vehiclePriceExclVat')}
                name={CreateQuotationFormNames.VEHICLE_PRICE}
                defaultValue={purchaseFormConfig?.data?.vehiclePrice}
                variantType='currency'
                disabled
                required
              />
            </Grid>
            <Grid item lg={6} sm={12}>
              <TextFieldWithController
                defaultValue=''
                testId={`${testGroupName}${proposalTestIds.purchaseVehicleDriverName}`}
                id='driver'
                key='driver'
                control={control}
                label={t('common.driverName')}
                disabled={!purchaseFormData.carstockId}
                {...register(CreateQuotationFormNames.DRIVER)}
              />
            </Grid>
            <Grid item lg={3} sm={6}>
              <DutchNumberInputField
                testId={`${testGroupName}${proposalTestIds.purchaseVehicleBpm}`}
                control={control}
                label={t('common.BPM')}
                name={CreateQuotationFormNames.BPM}
                defaultValue={purchaseFormConfig?.data?.BPM}
                variantType='currency'
                disabled
              />
            </Grid>
            <Grid item lg={3} sm={6}>
              <ReadOnlyTextField
                testId={`${testGroupName}${proposalTestIds.purchaseVehicleVatTye}`}
                value={vatType}
                variantType='default'
                label={t('common.vatType')}
              />
            </Grid>
            <Grid item lg={3} sm={6}>
              <DatePickerWithController
                control={control}
                format='DD/MM/YYYY'
                name={CreateQuotationFormNames.NEW_LICENSE_DATE}
                testId={`${testGroupName}${proposalTestIds.purchaseVehicleLicenseDate}`}
                sx={{ width: '100%' }}
                label={t('common.licenseDate')}
                disabled={!purchaseFormData.carstockId}
                defaultValue={getDateinDayjs(
                  purchaseFormConfig?.data?.licenseDate
                )}
              />
            </Grid>
            <Grid item lg={3} sm={6}>
              <DatePickerWithController
                control={control}
                format='DD/MM/YYYY'
                testId={`${testGroupName}${proposalTestIds.purchaseVehicleDeliveryDate}`}
                name={CreateQuotationFormNames.NEW_DELIVERY_DATE}
                sx={{ width: '100%' }}
                disabled={!purchaseFormData.carstockId}
                label={t('common.deliveryDate')}
                defaultValue={getDateinDayjs(
                  purchaseFormConfig?.data?.deliveryDate
                )}
              />
            </Grid>
          </Grid>
          <div className='flex w-full justify-end'>
            <div className='flex gap-5 pb-9 pl-6 pt-5'>
              <Button
                onClick={onCancel}
                sx={{ textTransform: 'none' }}
                data-testid={`${proposalTestIds.addPurchaseVehicleSubmitBtn}-cancel-btn`}
              >
                <Typography variant='titleSmallBold' className='capitalize'>
                  {t('actions.cancel')}
                </Typography>
              </Button>
              <Button
                type='submit'
                variant='outlined'
                onClick={onSubmit}
                sx={{ textTransform: 'none', height: '40px' }}
                className='border-secondary text-secondary'
                data-testid={`${proposalTestIds.addPurchaseVehicleSubmitBtn}-save-btn`}
              >
                <Typography variant='titleSmallBold' className='capitalize'>
                  {t('actions.done')}
                </Typography>
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>

      <CustomDialog
        headerElement={t('actions.confirm')}
        isOpen={hasUnsavedForms}
        onClose={() => setHasUnsavedForms(false)}
        onSubmit={() => router.push('/vehicles')}
        submitText='Proceed'
      >
        {t('quotations.unSavedChangeConfirmation')}
      </CustomDialog>
    </>
  );
};

export default PurchaseVehicleForm;
