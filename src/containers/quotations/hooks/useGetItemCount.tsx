import { UseFormWatch } from 'react-hook-form';

import { CreateQuotationFormSchema } from '../api/type';

const useGetItemCount = (watch: UseFormWatch<CreateQuotationFormSchema>) => {
  const firstLineGroup = watch('firstLineGroupItem');
  const secondLineGroup = watch('secondLineGroupItem');
  const thirdLineGroup = watch('thirdLineGroupItem');
  const fourthLineGroup = watch('fourthLineGroupItem');
  const fifthLineGroup = watch('fifthLineGroupItem');

  return {
    purchaseVehicleCount:
      (firstLineGroup?.purchases || []).length +
      (secondLineGroup?.purchases || []).length +
      (thirdLineGroup?.purchases || []).length +
      (fourthLineGroup?.purchases || []).length +
      (fifthLineGroup?.purchases || []).length,
    financeCount:
      (firstLineGroup?.finances || []).length +
      (secondLineGroup?.finances || []).length +
      (thirdLineGroup?.finances || []).length +
      (fourthLineGroup?.finances || []).length +
      (fifthLineGroup?.finances || []).length,
    tradeInCount:
      (firstLineGroup?.tradeIns || []).length +
      (secondLineGroup?.tradeIns || []).length +
      (thirdLineGroup?.tradeIns || []).length +
      (fourthLineGroup?.tradeIns || []).length +
      (fifthLineGroup?.tradeIns || []).length,
  };
};

export default useGetItemCount;
