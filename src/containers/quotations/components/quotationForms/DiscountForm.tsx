import { Typography } from '@AM-i-B-V/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid } from '@mui/material';
import { useTranslations } from 'next-intl';
import React, { FC, SyntheticEvent, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import DutchNumberInputField from '@/components/input-fields/DutchNumberInputField';
import ReadOnlyTextField from '@/components/input-fields/ReadOnlyTextField';
import TextFieldWithController from '@/components/TextFieldWithController';
import { euroSymbol } from '@/constants/common';
import { VoidFnType } from '@/types/common';
import { formatAmountAfterRounding } from '@/utils/currency';
import { showErrorToast } from '@/utils/toast';

import {
  CarStockEffectiveAmountResponse,
  getCarStockEffectiveAmountServerAction,
} from '../../api/actions';
import { DiscountRequest, LineGroupItemPurchase } from '../../api/type';
import {
  DiscountFormValidationSchema,
  IOrderLineConfigState,
  LineGroupItemEntityEnum,
} from '../../constants';
import {
  getCalculatedDiscountVal,
  getReverseCalculatedDiscountPercentage,
} from '../../utils';
import { TenantGroupItemEntity } from '../tenantGroups/types';

type DiscountFormSchema = {
  amount: number;
  percentage: number;
  description: string;
};

type DiscountFormNames = keyof DiscountFormSchema;

export const DiscountFormNames: { [K in DiscountFormNames]: K } = {
  amount: 'amount',
  percentage: 'percentage',
  description: 'description',
};

interface discountFormPropType {
  carstockId?: string;
  onCancel: VoidFnType;
  isGeneralDiscount?: boolean;
  selectedDiscountParent:
    | ((LineGroupItemPurchase | TenantGroupItemEntity) & {
        index?: number;
        type?: LineGroupItemEntityEnum;
      })
    | null;
  discountConfig: IOrderLineConfigState & { index: number };
  onDiscountSubmit: (data: DiscountRequest & { index: number }) => void;
}

export type TotalDiscountDisplayStateType = {
  totalDiscountValue: number;
  totalDiscountPercentage: number;
};

type CalculateAndSetDiscountDisplayStateArgs = {
  discountAmountValue: number;
  totalLineItemAmountValue: number;
  discountPercentageValue: number;
};

const DiscountForm: FC<discountFormPropType> = (props) => {
  const {
    onCancel,
    carstockId,
    discountConfig,
    onDiscountSubmit,
    selectedDiscountParent,
    isGeneralDiscount = false,
  } = props;

  const t = useTranslations();
  const [isLoading, setLoading] = useState(false);

  const [totalDiscountDisplayState, setTotalDiscountDisplayState] =
    useState<TotalDiscountDisplayStateType>({
      totalDiscountValue: 0,
      totalDiscountPercentage: 0,
    });

  const validationTranslation = useTranslations('validationMessage');

  const formMethods = useForm<DiscountRequest>({
    defaultValues: {
      amount: discountConfig?.data?.amount,
      percentage: discountConfig?.data?.percentage,
      description: discountConfig?.data?.description,
      totalDiscount: discountConfig?.data?.totalDiscount,
    },
    resolver: zodResolver(DiscountFormValidationSchema(validationTranslation)),
  });

  const {
    control,
    setError,
    handleSubmit,
    clearErrors,
    watch: discountFormWatch,
  } = formMethods;

  const getEffectiveAmountResponse = async ({
    discountAmountValue,
    discountPercentageValue,
  }: {
    discountAmountValue: number;
    discountPercentageValue: number;
  }): Promise<CarStockEffectiveAmountResponse> => {
    if (selectedDiscountParent?.type !== LineGroupItemEntityEnum.PURCHASE) {
      const calculatedDiscount = getCalculatedDiscountVal(
        discountAmountValue,
        selectedDiscountParent?.totalExclVat || 0,
        discountPercentageValue
      );
      return {
        effectiveDiscountAmount: calculatedDiscount,
        effectiveSellingPrice: 0,
        success: true,
      };
    }
    const effectiveAmountResponse =
      await getCarStockEffectiveAmountServerAction({
        pathParams: { id: Number(carstockId) },
        queryParams: {
          discountAmount: discountAmountValue,
          discountPercentage: discountPercentageValue,
        },
      });

    if (effectiveAmountResponse?.success) {
      return effectiveAmountResponse as CarStockEffectiveAmountResponse;
    }
    return effectiveAmountResponse as CarStockEffectiveAmountResponse;
  };

  const calculateAndSetDiscountDisplayState = async ({
    discountAmountValue,
    totalLineItemAmountValue,
    discountPercentageValue,
  }: CalculateAndSetDiscountDisplayStateArgs) => {
    if (selectedDiscountParent?.type === LineGroupItemEntityEnum.PRODUCT) {
      const totalDiscount = getCalculatedDiscountVal(
        discountAmountValue || 0,
        totalLineItemAmountValue || 0,
        discountPercentageValue || 0
      );
      const discountPercentageReverseCalculated =
        getReverseCalculatedDiscountPercentage({
          itemPrice: totalLineItemAmountValue || 0,
          totalDiscountAmount: totalDiscount,
        });
      setTotalDiscountDisplayState({
        totalDiscountValue: totalDiscount,
        totalDiscountPercentage: discountPercentageReverseCalculated,
      });
    } else if (
      selectedDiscountParent?.type === LineGroupItemEntityEnum.PURCHASE
    ) {
      setLoading(true);
      const effectiveAmountRes = (await getEffectiveAmountResponse({
        discountAmountValue: discountAmountValue || 0,
        discountPercentageValue: discountPercentageValue || 0,
      })) as CarStockEffectiveAmountResponse;
      if (!effectiveAmountRes?.success)
        showErrorToast(t('apiErrorMessage.effectiveDiscountError'));
      if (
        effectiveAmountRes?.effectiveDiscountAmount >
        (selectedDiscountParent?.totalExclVat || 0)
      ) {
        setError('amount', { message: t('quotations.invalidDiscount') });
        setError('percentage', { message: t('quotations.invalidDiscount') });
        setLoading(false);
        return;
      }

      clearErrors('amount');
      clearErrors('percentage');

      if (effectiveAmountRes.success) {
        const reverseCalculatedVehicleDiscountPercentage =
          getReverseCalculatedDiscountPercentage({
            itemPrice:
              effectiveAmountRes.effectiveSellingPrice +
              effectiveAmountRes.effectiveDiscountAmount,
            totalDiscountAmount: effectiveAmountRes.effectiveDiscountAmount,
          });
        setTotalDiscountDisplayState({
          totalDiscountValue: effectiveAmountRes.effectiveDiscountAmount,
          totalDiscountPercentage: reverseCalculatedVehicleDiscountPercentage,
        });
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (discountConfig?.data?.amount || discountConfig?.data?.percentage) {
      calculateAndSetDiscountDisplayState({
        discountAmountValue: discountConfig?.data?.amount || 0,
        totalLineItemAmountValue: selectedDiscountParent?.totalExclVat || 0,
        discountPercentageValue: discountConfig?.data?.percentage || 0,
      });
    }
  }, []);

  const [discountAmount, discountPercentage, discountDescription] =
    discountFormWatch([
      DiscountFormNames.amount,
      DiscountFormNames.percentage,
      DiscountFormNames.description,
    ]);

  const onPrimaryButtonClick = async (data: DiscountRequest) => {
    setLoading(true);
    const effectiveAmountRes = (await getEffectiveAmountResponse({
      discountAmountValue: data.amount || 0,
      discountPercentageValue: data.percentage || 0,
    })) as CarStockEffectiveAmountResponse;
    if (!effectiveAmountRes?.success)
      showErrorToast(t('common.somethingWentWrong'));
    if (
      effectiveAmountRes?.effectiveDiscountAmount >
      (selectedDiscountParent?.totalExclVat || 0)
    ) {
      setError('amount', { message: t('quotations.invalidDiscount') });
      setLoading(false);

      return;
    }

    clearErrors('amount');

    if (effectiveAmountRes.success) {
      onDiscountSubmit({
        ...data,
        totalDiscount: effectiveAmountRes.effectiveDiscountAmount,
        index: discountConfig?.data?.index,
      });
    }
    setLoading(false);
  };

  const onBlurDiscountInputFields = () => {
    if (discountAmount || discountPercentage) {
      calculateAndSetDiscountDisplayState({
        discountAmountValue: discountAmount || 0,
        totalLineItemAmountValue: selectedDiscountParent?.totalExclVat || 0,
        discountPercentageValue: discountPercentage || 0,
      });
    } else {
      setTotalDiscountDisplayState({
        totalDiscountPercentage: 0,
        totalDiscountValue: 0,
      });
    }
  };

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(onPrimaryButtonClick)();
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={() => null}>
        {isGeneralDiscount && (
          <div className='flex items-center gap-2 px-6 py-4'>
            <Typography variant='textMediumBold'>
              {`Adding discount for : ${selectedDiscountParent?.name}`}
            </Typography>
            <Typography variant='textSmall' className='text-grey-56'>
              {`(${selectedDiscountParent?.type})`}
            </Typography>
          </div>
        )}
        <Grid
          item
          container
          spacing={3}
          flexDirection='row'
          className='mb-4 px-6 py-4'
        >
          <Grid item sm={12} md={6} lg={6}>
            <DutchNumberInputField
              disabled={false}
              control={control}
              variantType='currency'
              defaultValue={discountAmount}
              name={DiscountFormNames.amount}
              label={t('quotations.discountAmount')}
              onBlur={onBlurDiscountInputFields}
            />
          </Grid>
          <Grid item sm={12} md={6} lg={6}>
            <DutchNumberInputField
              disabled={false}
              control={control}
              variantType='percentage'
              defaultValue={discountPercentage}
              name={DiscountFormNames.percentage}
              label={t('quotations.discountPercentage')}
              onBlur={onBlurDiscountInputFields}
            />
          </Grid>
          <Grid item spacing={2} container xs={6} md={12}>
            <Grid item xs={6}>
              <ReadOnlyTextField
                variantType='currency'
                label={`${t('quotations.totalDiscountIn')} ${euroSymbol}`}
                value={totalDiscountDisplayState.totalDiscountValue}
              />
            </Grid>
            <Grid item xs={6}>
              <ReadOnlyTextField
                variantType='percentageEnd'
                label={`${t('quotations.totalDiscountIn')} %`}
                value={formatAmountAfterRounding({
                  value: totalDiscountDisplayState.totalDiscountPercentage,
                })}
              />
            </Grid>
          </Grid>
          <Grid item md={12}>
            <TextFieldWithController
              required
              rows={6}
              multiline
              control={control}
              sx={{
                input: { height: '160px' },
              }}
              defaultValue={discountDescription}
              label={t('quotations.description')}
              name={DiscountFormNames.description}
              testId='discount-section-description-text-field'
            />
          </Grid>
          <div className='flex w-full justify-end'>
            <div className='flex gap-5 pb-9 pl-6 pt-5'>
              <Button
                disabled={isLoading}
                onClick={onCancel}
                sx={{ textTransform: 'none' }}
              >
                <Typography variant='titleSmallBold' className='capitalize'>
                  {t('actions.cancel')}
                </Typography>
              </Button>
              <Button
                type='submit'
                variant='outlined'
                onClick={onSubmit}
                disabled={isLoading}
                className='border-secondary text-secondary'
                sx={{ textTransform: 'none', height: '40px' }}
                data-testid='discount-form-submit-line-save-button'
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

export default DiscountForm;
