import { Typography } from '@AM-i-B-V/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid } from '@mui/material';
import { SyntheticEvent, useEffect } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

import DutchNumberInputField from '@/components/input-fields/DutchNumberInputField';
import ReadOnlyTextField from '@/components/input-fields/ReadOnlyTextField';
import TextFieldWithController from '@/components/TextFieldWithController';
import { VAT_MULTIPLIER } from '@/constants/common';
import { useTranslations } from '@/hooks/translation';
import { useSetActiveQuotationForms } from '@/hooks/useSetActiveQuotationForms';
import { VoidFnType } from '@/types/common';

import { proposalTestIds } from '../../../../../tests/e2e/constants/testIds';
import {
  CreateQuotationFormSchema,
  LineGroupItemProduct,
} from '../../api/type';
import {
  CreateQuotationFormNames,
  IOrderLineConfigState,
  ProductFormValidationSchema,
} from '../../constants';
import { calcProductTotal } from '../../utils';

const AddProduct = ({
  onCancel,
  onAddProduct,
  onEditProduct,
  testGroupName,
  tenantGroupId,
  productFormConfig,
}: {
  onCancel: VoidFnType;
  tenantGroupId: string;
  testGroupName?: string;
  productFormConfig?: IOrderLineConfigState;
  onAddProduct: (data: LineGroupItemProduct) => void;
  onEditProduct: (data: LineGroupItemProduct & { index: number }) => void;
}) => {
  const t = useTranslations();
  const validationTranslation = useTranslations('validationMessage');
  const formMethods = useForm<LineGroupItemProduct>({
    defaultValues: {
      name: productFormConfig?.data?.name ?? '',
      quantity: productFormConfig?.data?.quantity ?? 1,
      unitPrice: productFormConfig?.data?.unitPrice ?? 0,
      discount: productFormConfig?.data?.discount,
    },
    resolver: zodResolver(ProductFormValidationSchema(validationTranslation)),
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { isDirty },
  } = formMethods;

  const { handleChildFormSubmit } = useSetActiveQuotationForms({
    isDirty,
    tenantGroupId,
  });

  const { watch: parentWatch, setValue: setParentValues } =
    useFormContext<CreateQuotationFormSchema>();

  useEffect(() => {
    setParentValues('duplicateCheck.isProductFromActive', true);
  }, []);

  useEffect(
    () => () => {
      setParentValues('duplicateCheck.isProductFromActive', false);
    },
    []
  );

  const vatType = parentWatch(CreateQuotationFormNames.VAT_TYPE);

  const onPrimaryButtonClick = (productFormData: LineGroupItemProduct) => {
    const lineGroupItemProduct: LineGroupItemProduct = {
      ...productFormData,
      name: productFormData.name,
      quantity: productFormData.quantity,
      unitPrice: productFormData.unitPrice,
      totalExclVat: calcProductTotal({
        quantity: productFormData.quantity,
        unitPrice: productFormData.unitPrice,
      }),
      totalInclVat:
        calcProductTotal({
          quantity: productFormData.quantity,
          unitPrice: productFormData.unitPrice,
        }) * VAT_MULTIPLIER,
    };

    handleChildFormSubmit();

    if (productFormConfig?.isEdit) {
      const modifiedlineGroupItemProduct: LineGroupItemProduct & {
        index: number;
      } = {
        ...productFormData,
        index: productFormConfig?.data?.index,
        name: productFormData.name,
        quantity: productFormData.quantity,
        unitPrice: productFormData.unitPrice,
        totalExclVat: calcProductTotal({
          quantity: productFormData.quantity,
          unitPrice: productFormData.unitPrice,
        }),
        totalInclVat:
          calcProductTotal({
            quantity: productFormData.quantity,
            unitPrice: productFormData.unitPrice,
          }) * VAT_MULTIPLIER,
      };
      onEditProduct(modifiedlineGroupItemProduct);
      return;
    }
    onAddProduct(lineGroupItemProduct);
  };

  const onSubmit = (e: SyntheticEvent) => {
    handleSubmit(onPrimaryButtonClick)();
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={() => null}>
        <Grid container columnSpacing={3} rowSpacing={2}>
          <Grid item lg={12}>
            <TextFieldWithController
              id='productName'
              key='productName'
              control={control}
              testId={`${testGroupName}${proposalTestIds.productName}`}
              label={t('common.product')}
              {...register('name')}
              required
            />
          </Grid>
          <Grid item lg={3} sm={12}>
            <DutchNumberInputField
              id='amount'
              key='amount'
              control={control}
              defaultValue={productFormConfig?.data?.quantity ?? 1}
              label={t('common.quantity')}
              testId={`${testGroupName}${proposalTestIds.productQuantity}`}
              isDecimalAllowed={false}
              name={CreateQuotationFormNames.QUANTITY}
              required
            />
          </Grid>
          <Grid item lg={3} sm={3}>
            <DutchNumberInputField
              control={control}
              label={t('common.unitPriceExclVat')}
              testId={`${testGroupName}${proposalTestIds.productUnitPriceExclVat}`}
              defaultValue={productFormConfig?.data?.unitPrice || 0}
              name={CreateQuotationFormNames.UNIT_PRICE}
              variantType='currency'
              required
            />
          </Grid>
          <Grid item lg={3} sm={6}>
            <ReadOnlyTextField
              value={vatType}
              testId={`${testGroupName}${proposalTestIds.productVatType}`}
              variantType='default'
              label={t('common.vatType')}
            />
          </Grid>
          <div className='flex w-full justify-end'>
            <div className='flex gap-5 pb-9 pl-6 pt-5'>
              <Button
                onClick={onCancel}
                sx={{ textTransform: 'none' }}
                data-testid={`${proposalTestIds.addProductSubmitBtn}-cancel-btn`}
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
                data-testid={`${proposalTestIds.addProductSubmitBtn}-save-btn`}
              >
                <Typography variant='titleSmallBold' className='capitalize'>
                  {t('actions.done')}
                </Typography>
              </Button>
            </div>
          </div>
        </Grid>
      </form>
    </FormProvider>
  );
};

export default AddProduct;
