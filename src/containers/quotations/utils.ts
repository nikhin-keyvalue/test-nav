import { UseFormWatch } from 'react-hook-form';

import { PersonTypeStrict } from '@/types/api';
import { PersonTypeEnum } from '@/types/common';

import { TransformedVehicleData } from '../vehicles/api/types';
import {
  CreateQuotationFormSchema,
  FinanceType,
  LineGroupItemProduct,
  LineGroupItemPurchase,
  LineGroupItemRequest,
  LineGroupItemsQuotationUpdateRequest,
  LineGroupItemTradeIn,
  TradeInMarginType,
  TradeInMarginValues,
} from './api/type';
import {
  fifthLineGroupItemNameDefault,
  firstLineGroupItemNameDefault,
  fourthLineGroupItemNameDefault,
  ILineGroupItemDesc,
  secondLineGroupItemNameDefault,
  tenantGroupIdMap,
  thirdLineGroupItemNameDefault,
  VAT_PERCENTAGE,
} from './constants';
import { GetReverseCalculatedDiscountPercentageArgs } from './types';

type CalcProductPriceArgs = {
  quantity: number;
  unitPrice: number;
};

export const calcProductTotal = ({
  quantity,
  unitPrice,
}: CalcProductPriceArgs): number => {
  if (quantity && unitPrice) {
    const total = quantity * unitPrice;
    return total;
  }
  return 0;
};

export const calcTradeInTotal = ({
  tradeInValue,
  vatPercentage = VAT_PERCENTAGE,
  residualBpm = 0,
  margin,
}: {
  tradeInValue: number;
  vatPercentage?: number;
  margin: TradeInMarginType;
  residualBpm?: number;
}): number => {
  if (margin === TradeInMarginValues.VATVehicle) {
    const residualBpmSubtractedValue = tradeInValue - residualBpm;
    const vatAmount = (vatPercentage * residualBpmSubtractedValue) / 100;
    const netTradeInValue = tradeInValue + vatAmount;
    return netTradeInValue;
  }
  return tradeInValue;
};

export const getFinanceValue = ({
  watch,
}: {
  watch: UseFormWatch<CreateQuotationFormSchema>;
}) => {
  const firstLineGroup = watch('firstLineGroupItem');
  const secondLineGroup = watch('secondLineGroupItem');
  const thirdLineGroup = watch('thirdLineGroupItem');
  const fourthLineGroup = watch('fourthLineGroupItem');
  const fifthLineGroup = watch('fifthLineGroupItem');

  let returnValue: {
    financeItem?: FinanceType;
    groupIndex: number;
  } = { groupIndex: 0 };
  if (firstLineGroup?.finances?.length) {
    returnValue = { groupIndex: 0, financeItem: firstLineGroup.finances[0] };
  } else if (secondLineGroup?.finances?.length) {
    returnValue = { groupIndex: 1, financeItem: secondLineGroup.finances[0] };
  } else if (thirdLineGroup?.finances?.length) {
    returnValue = { groupIndex: 2, financeItem: thirdLineGroup.finances[0] };
  } else if (fourthLineGroup?.finances?.length) {
    returnValue = { groupIndex: 3, financeItem: fourthLineGroup.finances[0] };
  } else if (fifthLineGroup?.finances?.length) {
    returnValue = { groupIndex: 4, financeItem: fifthLineGroup.finances[0] };
  }
  return returnValue;
};

export type QuotationAmounts = {
  totalInclVat: number;
  totalExclVat: number;
  totalAfterDiscountInclVat: number;
  totalAfterDiscountExclVat: number;
  vatAmount: number;
  totalDiscountValue: number;
};

export type CalculateQuotationAmountsArgs = {
  vatPercentage?: number;
  lineGroupItemList: LineGroupItemRequest[];
  totalDiscount: number;
};

export const calculateTotalFromLineItemList = ({
  lineItemList,
}: {
  lineItemList:
    | LineGroupItemProduct[]
    | LineGroupItemPurchase[]
    | LineGroupItemTradeIn[];
}): { sumOfLineItemTypeTotals: number; sumOfDiscounts: number } => {
  const { sumOfLineItemTypeTotals, sumOfDiscounts } = lineItemList.reduce(
    (totals, item) => {
      totals.sumOfLineItemTypeTotals += item.totalExclVat;
      if ('discount' in item) {
        totals.sumOfDiscounts += item.discount?.totalDiscount || 0;
      }
      return totals;
    },
    { sumOfLineItemTypeTotals: 0, sumOfDiscounts: 0 }
  );
  return { sumOfLineItemTypeTotals, sumOfDiscounts };
};

export type TotalsFromLineGroupItem = {
  sumOfProductItemTotals: number;
  sumOfPurchaseItemTotals: number;
  sumOfTradeInItemTotals: number;
  sumOfProductItemDiscount: number;
  sumOfPurchaseItemDiscount: number;
};

export type TotalsFromAllLineGroups = {
  overallProductItemTotal: number;
  overallPurchaseItemTotal: number;
  overallTradeInItemTotal: number;
  overallProductItemDiscount: number;
  overallPurchaseItemDiscount: number;
};

export const calculateTotalsFromLineGroupItem = ({
  lineGroupItem,
}: {
  lineGroupItem: LineGroupItemRequest;
}): TotalsFromLineGroupItem => {
  let sumOfProductItemTotals = 0;
  let sumOfPurchaseItemTotals = 0;
  let sumOfTradeInItemTotals = 0;
  let sumOfProductItemDiscount = 0;
  let sumOfPurchaseItemDiscount = 0;

  if (lineGroupItem?.products && lineGroupItem?.products?.length > 0) {
    const { sumOfDiscounts, sumOfLineItemTypeTotals } =
      calculateTotalFromLineItemList({
        lineItemList: lineGroupItem?.products,
      });
    sumOfProductItemTotals = sumOfLineItemTypeTotals;
    sumOfProductItemDiscount = sumOfDiscounts;
  }
  if (lineGroupItem?.purchases && lineGroupItem?.purchases?.length > 0) {
    const { sumOfDiscounts, sumOfLineItemTypeTotals } =
      calculateTotalFromLineItemList({
        lineItemList: lineGroupItem?.purchases,
      });
    sumOfPurchaseItemTotals = sumOfLineItemTypeTotals;
    sumOfPurchaseItemDiscount = sumOfDiscounts;
  }
  if (lineGroupItem?.tradeIns && lineGroupItem?.tradeIns?.length > 0) {
    const { sumOfLineItemTypeTotals } = calculateTotalFromLineItemList({
      lineItemList: lineGroupItem?.tradeIns,
    });
    sumOfTradeInItemTotals = sumOfLineItemTypeTotals;
  }

  return {
    sumOfProductItemTotals,
    sumOfPurchaseItemTotals,
    sumOfTradeInItemTotals,
    sumOfProductItemDiscount,
    sumOfPurchaseItemDiscount,
  };
};

export const findPurchaseLineItem = ({
  lineGroupItemList,
}: {
  lineGroupItemList: LineGroupItemRequest[];
}): (LineGroupItemPurchase & { index: number }) | undefined => {
  const purchaseItems = [
    lineGroupItemList?.[0]?.purchases?.[0],
    lineGroupItemList?.[1]?.purchases?.[0],
    lineGroupItemList?.[2]?.purchases?.[0],
    lineGroupItemList?.[3]?.purchases?.[0],
    lineGroupItemList?.[4]?.purchases?.[0],
    lineGroupItemList?.[5]?.purchases?.[0],
  ];

  const filteredPurchasesArray: LineGroupItemPurchase[] = purchaseItems.filter(
    (purchase) => purchase !== undefined
  ) as LineGroupItemPurchase[];

  const index = purchaseItems.findIndex((purchase) => purchase !== undefined);

  return { ...filteredPurchasesArray?.[0], index };
};

export const calculateQuotationAmounts = ({
  vatPercentage = VAT_PERCENTAGE,
  lineGroupItemList,
  // totalDiscount stands for effective discount - metafactory api
  totalDiscount = 0,
}: CalculateQuotationAmountsArgs): QuotationAmounts => {
  const totalsInAllLineGroups = lineGroupItemList.reduce(
    (totalsFromAllLineGroups: TotalsFromAllLineGroups, lineGroupItem) => {
      const {
        sumOfProductItemTotals,
        sumOfTradeInItemTotals,
        sumOfPurchaseItemTotals,
        sumOfProductItemDiscount,
        sumOfPurchaseItemDiscount,
      } = calculateTotalsFromLineGroupItem({
        lineGroupItem,
      });

      return {
        overallProductItemTotal:
          totalsFromAllLineGroups.overallProductItemTotal +
          sumOfProductItemTotals,
        overallPurchaseItemTotal:
          totalsFromAllLineGroups.overallPurchaseItemTotal +
          sumOfPurchaseItemTotals,
        overallTradeInItemTotal:
          totalsFromAllLineGroups.overallTradeInItemTotal +
          sumOfTradeInItemTotals,

        overallProductItemDiscount:
          totalsFromAllLineGroups.overallProductItemDiscount +
          sumOfProductItemDiscount,
        overallPurchaseItemDiscount:
          totalsFromAllLineGroups.overallPurchaseItemDiscount +
          sumOfPurchaseItemDiscount,
      };
    },
    {
      overallProductItemTotal: 0,
      overallPurchaseItemTotal: 0,
      overallTradeInItemTotal: 0,
      overallProductItemDiscount: 0,
      overallPurchaseItemDiscount: 0,
    }
  );

  const productAndPurchaseTotals =
    totalsInAllLineGroups.overallProductItemTotal +
    totalsInAllLineGroups.overallPurchaseItemTotal;
  const vatOnProductAndPurchaseTotals =
    (vatPercentage * productAndPurchaseTotals) / 100;

  const totalInclVAT =
    productAndPurchaseTotals +
    vatOnProductAndPurchaseTotals -
    totalsInAllLineGroups.overallTradeInItemTotal;

  const totalDiscountValue =
    totalsInAllLineGroups.overallPurchaseItemDiscount +
    totalsInAllLineGroups.overallProductItemDiscount;

  const totalAfterDiscountInclVAT = totalInclVAT - totalDiscountValue;

  const totalExclVAT =
    productAndPurchaseTotals - totalsInAllLineGroups.overallTradeInItemTotal;

  const totalAfterDiscountExclVAT = totalExclVAT - totalDiscountValue;

  const quotationAmounts = {
    totalInclVat: totalInclVAT,
    totalExclVat: totalExclVAT,
    totalAfterDiscountInclVat: totalAfterDiscountInclVAT,
    totalAfterDiscountExclVat: totalAfterDiscountExclVAT,
    vatAmount: vatOnProductAndPurchaseTotals,
    totalDiscountValue,
  };
  return quotationAmounts;
};

export const calculateMonthlyExclVat = ({
  duration = 0,
  downPayment = 0,
  interest = 0,
  finalTerm = 0,
  totalExcludingVat = 0,
  totalIncludingVat = 0,
  quotationType = PersonTypeEnum.Private,
}: {
  duration: number;
  downPayment: number;
  interest: number;
  finalTerm: number;
  totalExcludingVat: number;
  totalIncludingVat: number;
  quotationType: PersonTypeStrict;
}) => {
  const monthlyInterestRate = interest / 1200;
  const inverseCalcValue = (1 + monthlyInterestRate) ** -duration;
  const monthlyRepaymentAmountDenominator = 1 - inverseCalcValue;
  const monthlyRepaymentAmount =
    monthlyInterestRate / monthlyRepaymentAmountDenominator;
  const totalAmount =
    quotationType === PersonTypeEnum.Private
      ? totalIncludingVat
      : totalExcludingVat;
  const loanAmount = totalAmount - (downPayment + finalTerm);
  const monthlyFeeForFinance =
    monthlyRepaymentAmount * loanAmount + monthlyInterestRate * finalTerm;
  return monthlyFeeForFinance;
};

export const checkIfLineItemsExist = (
  lineGroupItemList: LineGroupItemRequest[]
) =>
  lineGroupItemList.some((lineGroupItem) => {
    // One of products/purchases/tradeins is mandatory for changing quotation status to shared
    const totalLineItems =
      (lineGroupItem?.products || []).length +
      (lineGroupItem?.purchases || []).length +
      (lineGroupItem?.tradeIns || []).length;
    return totalLineItems > 0;
  });

export const appendPurchaseVehicleDataToForm = (
  formData: CreateQuotationFormSchema,
  purchaseVehicleFormData?: TransformedVehicleData
) => {
  if (!purchaseVehicleFormData) return formData;

  const newFormData = { ...formData };
  const tenantGroupIndex = Number(newFormData.purchaseTenantId ?? 0);
  const tenantGroup = tenantGroupIdMap[tenantGroupIndex];
  newFormData[tenantGroup].purchases![0] = purchaseVehicleFormData;
  return newFormData;
};

// function to delete vehicleId, if present from route params
export const clearVehicleIdFromUrl = ({
  searchParams,
  currentPath,
}: {
  searchParams: URLSearchParams;
  currentPath: string;
}) => {
  if (searchParams.has('vehicleId')) {
    const urlParams = new URLSearchParams(searchParams);
    urlParams.delete('vehicleId');
    const query = urlParams.toString() || '';
    const path = `${currentPath}?${query}`;

    // Note: Using history.replaceState() to update the URL without scrolling to top of the page
    window.history.replaceState(null, '', path);
  }
};

export const composeUrlSegmentWithVehicleId = ({
  urlSegment,
  vehicleId,
}: {
  urlSegment: string;
  vehicleId?: number;
}) => {
  if (!vehicleId) return urlSegment;

  const [path, redirectSearchParams] = urlSegment.split('?');
  const vehicleIdSearchParams = `vehicleId=${vehicleId}`;
  const newSearchParams = redirectSearchParams
    ? `?${redirectSearchParams}&${vehicleIdSearchParams}`
    : `?${vehicleIdSearchParams}`;
  return `${path}${newSearchParams}`;
};

export const getCalculatedDiscountVal = (
  discountAmount: number,
  itemPrice: number,
  discountPercentage: number
) => {
  const computedPercentDiscount = (discountPercentage * itemPrice) / 100;
  return discountAmount + computedPercentDiscount;
};

const prepareLineGroupItemPayload = ({
  lineGroupItem,
  lineGroupItemDesc,
}: {
  lineGroupItem?: LineGroupItemRequest;
  lineGroupItemDesc: ILineGroupItemDesc;
}) => {
  if (lineGroupItem) {
    if (
      lineGroupItem?.finances?.length &&
      lineGroupItem?.finances?.length > 0
    ) {
      const updatedLineGroupItem = lineGroupItem?.finances.map(
        (financeItem) => {
          const financeWithoutMileage = { ...financeItem };
          delete financeWithoutMileage.yearlyMileage;
          return financeWithoutMileage;
        }
      );
      return {
        ...lineGroupItem,
        finances: updatedLineGroupItem,
      } as LineGroupItemRequest;
    }
    return lineGroupItem as LineGroupItemRequest;
  }
  return { groupName: lineGroupItemDesc.groupName };
};

export const getLineGroupItems = (quotationData: CreateQuotationFormSchema) => {
  const {
    firstLineGroupItem,
    secondLineGroupItem,
    thirdLineGroupItem,
    fourthLineGroupItem,
    fifthLineGroupItem,
  } = quotationData;
  const lineGroupItems: LineGroupItemsQuotationUpdateRequest = [
    prepareLineGroupItemPayload({
      lineGroupItemDesc: firstLineGroupItemNameDefault,
      lineGroupItem: firstLineGroupItem,
    }),
    prepareLineGroupItemPayload({
      lineGroupItemDesc: secondLineGroupItemNameDefault,
      lineGroupItem: secondLineGroupItem,
    }),
    prepareLineGroupItemPayload({
      lineGroupItemDesc: thirdLineGroupItemNameDefault,
      lineGroupItem: thirdLineGroupItem,
    }),
    prepareLineGroupItemPayload({
      lineGroupItemDesc: fourthLineGroupItemNameDefault,
      lineGroupItem: fourthLineGroupItem,
    }),
    prepareLineGroupItemPayload({
      lineGroupItemDesc: fifthLineGroupItemNameDefault,
      lineGroupItem: fifthLineGroupItem,
    }),
  ];

  return lineGroupItems;
};

export const getReverseCalculatedDiscountPercentage = ({
  totalDiscountAmount,
  itemPrice,
}: GetReverseCalculatedDiscountPercentageArgs) => {
  const totalDiscountPercentage = (totalDiscountAmount / itemPrice) * 100;
  return totalDiscountPercentage;
};

export type GetProductTotalDiscountsArgs = {
  totalPrice: number;
  discountAmount: number;
  discountPercentage: number;
};

export type GetProductTotalDiscountsReturn = {
  totalPercentage: number;
  totalValue: number;
};
