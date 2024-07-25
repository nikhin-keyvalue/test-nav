import { Typography } from '@AM-i-B-V/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid, MenuItem } from '@mui/material';
import { SyntheticEvent, useEffect } from 'react';
import {
  FormProvider,
  useForm,
  useFormContext,
  UseFormWatch,
} from 'react-hook-form';

import DutchNumberInputField from '@/components/input-fields/DutchNumberInputField';
import ReadOnlyTextField from '@/components/input-fields/ReadOnlyTextField';
import SelectWithController from '@/components/select-with-controller/SelectWithController';
import { PERSON_TYPES } from '@/constants/filter';
import { useTranslations } from '@/hooks/translation';
import { useSetActiveQuotationForms } from '@/hooks/useSetActiveQuotationForms';
import { VoidFnType } from '@/types/common';
import { roundValue } from '@/utils/currency';

import { proposalTestIds } from '../../../../../tests/e2e/constants/testIds';
import {
  CreateQuotationFormSchema,
  LineGroupItemFinance,
} from '../../api/type';
import {
  CreateQuotationFormNames,
  financeFormValidationSchema,
  FinanceLineGroupItemTypes,
  IOrderLineConfigState,
} from '../../constants';
import { useCreateQuotationContext } from '../../CreateQuotationContextWrapper';
import { calculateMonthlyExclVat } from '../../utils';

const AddFinance = ({
  onCancel,
  onEditFinance,
  testGroupName,
  tenantGroupId,
  parentWatcher,
  onAddFinanceItem,
  financeFormConfig,
}: {
  groupName: string;
  onCancel: VoidFnType;
  tenantGroupId: string;
  testGroupName?: string;
  financeFormConfig?: IOrderLineConfigState;
  onAddFinanceItem: (data: LineGroupItemFinance) => void;
  parentWatcher: UseFormWatch<CreateQuotationFormSchema>;
  onEditFinance: (data: LineGroupItemFinance & { index: number }) => void;
}) => {
  const t = useTranslations();
  const validationTranslation = useTranslations('validationMessage');
  const { state } = useCreateQuotationContext();

  const formMethods = useForm<LineGroupItemFinance>({
    defaultValues: {
      type: financeFormConfig?.data?.type,
      durationInMonths: financeFormConfig?.data?.durationInMonths,
      finalTerm: financeFormConfig?.data?.finalTerm,
      // tradeInVehicle: financeFormConfig?.data?.tradeInVehicle,
      // yearlyMileage: financeFormConfig?.data?.yearlyMileage,
      monthlyExclVAT: financeFormConfig?.data?.monthlyExclVAT,
      annualInterestRate: financeFormConfig?.data?.annualInterestRate,
      downPayment: financeFormConfig?.data?.downPayment,
    },
    resolver: zodResolver(financeFormValidationSchema(validationTranslation)),
  });

  const {
    handleSubmit,
    watch,
    register,
    setValue,
    control,
    formState: { isDirty },
  } = formMethods;

  const durationWatcher = watch('durationInMonths');
  const downPaymentWatcher = watch('downPayment');
  const interestWatcher = watch('annualInterestRate');
  const finalTermWatcher = watch('finalTerm');
  const monthlyExclVATWatcher = watch('monthlyExclVAT');
  useEffect(() => {
    const totalExcludingVat = parentWatcher(
      CreateQuotationFormNames.TOTAL_AFTER_DISCOUNT_EXCL_VAT
    );
    const totalIncludingVat = parentWatcher(
      CreateQuotationFormNames.TOTAL_AFTER_DISCOUNT_INCL_VAT
    );
    if (durationWatcher >= 0 && interestWatcher >= 0) {
      const monthlyFeeForFinance = calculateMonthlyExclVat({
        duration: durationWatcher,
        downPayment: downPaymentWatcher,
        interest: interestWatcher,
        finalTerm: finalTermWatcher,
        totalExcludingVat,
        totalIncludingVat,
        quotationType: state.opportunityType,
      });
      const roundedMonthlyVat = roundValue({ value: monthlyFeeForFinance });
      setValue('monthlyExclVAT', roundedMonthlyVat);
    } else {
      setValue('monthlyExclVAT', 0);
    }
  }, [durationWatcher, downPaymentWatcher, interestWatcher, finalTermWatcher]);

  const { handleChildFormSubmit } = useSetActiveQuotationForms({
    isDirty,
    tenantGroupId,
  });

  const { setValue: setParentValues } =
    useFormContext<CreateQuotationFormSchema>();

  useEffect(() => {
    setParentValues('duplicateCheck.isFinanceFormActive', true);
  }, []);

  useEffect(
    () => () => {
      // Added this separately since unmounting case was not working with the previous useEffect
      setParentValues('duplicateCheck.isFinanceFormActive', false);
    },
    []
  );

  const onPrimaryButtonClick = (financeFormData: LineGroupItemFinance) => {
    const lineGroupItemFinance: LineGroupItemFinance = financeFormData;
    handleChildFormSubmit();
    if (financeFormConfig?.isEdit) {
      const modifiedLineGroupItemFinance: LineGroupItemFinance & {
        index: number;
      } = {
        index: financeFormConfig?.data?.index,
        ...financeFormData,
      };

      onEditFinance(modifiedLineGroupItemFinance);
      return;
    }

    onAddFinanceItem(lineGroupItemFinance);
  };

  const onSubmit = (e: SyntheticEvent) => {
    handleSubmit(onPrimaryButtonClick)();
    e.stopPropagation();
    e.preventDefault();
  };

  const getFinanceTypes = () => {
    if (state.opportunityType === PERSON_TYPES.PRIVATE) {
      return [FinanceLineGroupItemTypes.PRIVATE_FINANCE];
    }
    return [FinanceLineGroupItemTypes.FINANCIAL_LEASE];
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={() => null}>
        <Grid container columnSpacing={3} rowSpacing={2}>
          <Grid item lg={4}>
            <SelectWithController
              testId={proposalTestIds.selectControllerFinanceType}
              key='financeType'
              options={getFinanceTypes()}
              control={control}
              label={t('filters.type')}
              renderOption={(option) => (
                <MenuItem
                  data-testid={`${proposalTestIds.selectControllerFinanceType}`}
                  key={option}
                  value={option}
                >
                  {t(`quotations.financeTypes.${option}`)}
                </MenuItem>
              )}
              defaultValue={financeFormConfig?.data?.type}
              {...register(CreateQuotationFormNames.FINANCE_TYPE)}
              required
            />
          </Grid>
          <Grid item lg={4} sm={12}>
            <DutchNumberInputField
              testId={`${testGroupName}${proposalTestIds.financeDurationMonths}`}
              control={control}
              variantType='default'
              label={t('quotations.lineGroups.finance.durationInMonths')}
              defaultValue={financeFormConfig?.data?.durationInMonths}
              name={CreateQuotationFormNames.DURATION_IN_MONTHS}
              required
            />
          </Grid>
          <Grid item lg={4} sm={12}>
            <DutchNumberInputField
              control={control}
              variantType='default'
              testId={`${testGroupName}${proposalTestIds.financeDownPayment}`}
              label={t('quotations.lineGroups.finance.downPayment')}
              defaultValue={financeFormConfig?.data?.downPayment}
              name={CreateQuotationFormNames.DOWN_PAYMENT}
              required
            />
          </Grid>
          <Grid item lg={4} sm={12}>
            <DutchNumberInputField
              testId={`${testGroupName}${proposalTestIds.financeAnnualInterestRate}`}
              control={control}
              variantType='percentage'
              label={t('quotations.lineGroups.finance.annualInterestRate')}
              defaultValue={financeFormConfig?.data?.annualInterestRate}
              name={CreateQuotationFormNames.INTEREST_PERCENTAGE}
              required
            />
          </Grid>
          <Grid item lg={4} sm={3}>
            <DutchNumberInputField
              control={control}
              testId={`${testGroupName}${proposalTestIds.financeFinalTerm}`}
              variantType='currency'
              label={t('common.finalTerm')}
              defaultValue={financeFormConfig?.data?.finalTerm}
              name={CreateQuotationFormNames.FINAL_TERM}
              required
            />
          </Grid>

          <Grid item lg={4} sm={3}>
            <ReadOnlyTextField
              variantType='currency'
              testId={`${testGroupName}${proposalTestIds.financeMonthlyExclVat}`}
              label={t('common.monthlyVAT')}
              value={monthlyExclVATWatcher || 0}
              name={CreateQuotationFormNames.MONTHLY_EXCLUDING_VAT}
              required
            />
          </Grid>
        </Grid>
        <div className='flex w-full justify-end'>
          <div className='flex gap-5 pb-9 pl-6 pt-5'>
            <Button
              onClick={onCancel}
              sx={{ textTransform: 'none' }}
              data-testid={`${proposalTestIds.addFinanceSubmitBtn}-cancel-btn`}
            >
              <Typography variant='titleSmallBold' className='capitalize'>
                {t('actions.cancel')}
              </Typography>
            </Button>
            <Button
              type='submit'
              onClick={onSubmit}
              variant='outlined'
              className='border-secondary text-secondary'
              sx={{ textTransform: 'none', height: '40px' }}
              data-testid={`${proposalTestIds.addFinanceSubmitBtn}-save-btn`}
            >
              <Typography variant='titleSmallBold' className='capitalize'>
                {t('actions.done')}
              </Typography>
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default AddFinance;
