import { useEffect } from 'react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';

import { CreateQuotationFormSchema } from '../api/type';
import { CreateQuotationFormNames, tenantGroupIdMap } from '../constants';
import { useCreateQuotationContext } from '../CreateQuotationContextWrapper';
import { calculateMonthlyExclVat, getFinanceValue } from '../utils';

const useTriggerFinanceCalculation = (
  watch: UseFormWatch<CreateQuotationFormSchema>,
  setValue: UseFormSetValue<CreateQuotationFormSchema>
) => {
  const totalIncludingVat = watch(
    CreateQuotationFormNames.TOTAL_AFTER_DISCOUNT_INCL_VAT
  );
  const totalExcludingVat = watch(
    CreateQuotationFormNames.TOTAL_AFTER_DISCOUNT_EXCL_VAT
  );

  const { state } = useCreateQuotationContext();

  useEffect(() => {
    const finance = getFinanceValue({
      watch,
    });
    if (finance?.financeItem) {
      const duration = finance?.financeItem?.durationInMonths || 0;
      const downPayment = finance?.financeItem?.downPayment || 0;
      const interest = finance?.financeItem?.annualInterestRate || 0;
      const finalTerm = finance?.financeItem?.finalTerm || 0;

      const monthlyFeeForFinance = calculateMonthlyExclVat({
        duration,
        downPayment,
        interest,
        finalTerm,
        totalExcludingVat,
        totalIncludingVat,
        quotationType: state.opportunityType,
      });
      const tenantGroup = tenantGroupIdMap[finance?.groupIndex];

      if (finance?.financeItem)
        setValue(`${tenantGroup}.finances`, [
          {
            ...finance.financeItem,
            monthlyExclVAT: monthlyFeeForFinance,
          },
        ]);
    }
  }, [totalIncludingVat, totalExcludingVat, state.opportunityType]);
};

export default useTriggerFinanceCalculation;
