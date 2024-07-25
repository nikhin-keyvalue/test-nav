import { expect, Locator, Page } from '@playwright/test';
import dayjs from 'dayjs';

import { routeRegex, routes } from '@/constants/routes';
import {
  financeTypes,
  LineGroupItemFinance,
  LineGroupItemProduct,
  LineGroupItemTradeIn,
  QuotationCreateRequest,
  QuotationVATTypeEnum,
} from '@/containers/quotations/api/type';
import {
  FinanceLineGroupItemTypes,
  MarginOptionsList,
  tenantGroupIdMap,
  TradeInToOptionsList,
} from '@/containers/quotations/constants';
import { calculateMonthlyExclVat } from '@/containers/quotations/utils';
import { PersonTypeEnum } from '@/types/common';
import { removeSpaceFromString } from '@/utils/common';
import {
  formatAmount,
  formatAmountAfterRounding,
  formatPlainStringToCurrency,
} from '@/utils/currency';
import { convertDateFormatToDDMMYYYY } from '@/utils/date';

import en from '../../../../messages/en.json';
import {
  financeTypeMapper,
  lineGroupMenuItems,
} from '../../constants/quotationData';
import {
  carStockListTestIds,
  datePickerComponentTestIds,
  ellipsisMenuTestIds,
  generalTestIds,
  opportunityTestIds,
  proposalTestIds,
} from '../../constants/testIds';
import {
  FinanceEditDataType,
  ProductEditDataType,
  PurchaseVehicleEditDataType,
  TradeInVehicleEditDataType,
} from '../../types';
import { OpportunityInputDataProps } from '../opportunities/opportunitiesFormHelpers';

export const formatDateToDayJs = (date?: string) =>
  dayjs(date || new Date()).format('YYYY-MM-DD');

export const checkFieldExistWithLabel = async ({
  parentElement,
  inputElement,
  label,
  expectFieldToBeDisabled,
  expectFieldToBeMandatory,
}: {
  parentElement: Locator;
  inputElement: Locator;
  label: string;
  expectFieldToBeDisabled: boolean;
  expectFieldToBeMandatory: boolean;
}) => {
  await expect(parentElement).toBeTruthy();
  if (expectFieldToBeDisabled) {
    await expect(inputElement).toBeDisabled();
  } else {
    await expect(inputElement).not.toBeDisabled();
  }
  await expect(parentElement.locator('label').first()).toHaveText(
    `${label}${expectFieldToBeMandatory ? ' *' : ''}`
  );
};

export const getQuotationTypeUsingFinanceType = (financeType: financeTypes) =>
  financeType === FinanceLineGroupItemTypes.PRIVATE_FINANCE ||
  financeType === FinanceLineGroupItemTypes.PRIVATE_LEASE
    ? PersonTypeEnum.Private
    : PersonTypeEnum.Business;

export const addFinance = async ({
  page,
  financeData,
  groupName = tenantGroupIdMap[0],
}: {
  page: Page;
  financeData: LineGroupItemFinance;
  groupName?: string;
}) => {
  let financeType = FinanceLineGroupItemTypes.PRIVATE_FINANCE;
  const quotationType = getQuotationTypeUsingFinanceType(financeData.type);

  switch (financeData.type) {
    case FinanceLineGroupItemTypes.FINANCIAL_LEASE:
      financeType = FinanceLineGroupItemTypes.FINANCIAL_LEASE;
      break;
    case FinanceLineGroupItemTypes.PRIVATE_LEASE:
      financeType = FinanceLineGroupItemTypes.PRIVATE_LEASE;
      break;
    case FinanceLineGroupItemTypes.PRIVATE_FINANCE:
      financeType = FinanceLineGroupItemTypes.PRIVATE_FINANCE;
      break;
    default:
      financeType = FinanceLineGroupItemTypes.FULL_OPERATIONAL_LEASE;
      break;
  }
  const tenantGroupAdd = await page.getByTestId(
    `${groupName}${proposalTestIds.addLineItem}`
  );

  await expect(tenantGroupAdd).toBeTruthy();
  await tenantGroupAdd.click();
  for (let i = 0; i < lineGroupMenuItems.length; i += 1) {
    const lineGroupItem = lineGroupMenuItems[i];
    expect(page.getByTestId(lineGroupItem)).toBeTruthy();
  }
  await expect(
    page.getByTestId(`${proposalTestIds.addFinance}`)
  ).not.toBeDisabled();

  await page.getByTestId(proposalTestIds.addFinance).click();
  await page
    .getByTestId(proposalTestIds.selectControllerFinanceType)
    .first()
    .click();

  await page
    .getByRole('option', { name: en.quotations.financeTypes[financeType] })
    .click();
  const durationInMonths = await page.getByTestId(
    `${groupName}${proposalTestIds.financeDurationMonths}`
  );
  await expect(durationInMonths).toBeTruthy();
  const inputOfDurationInMonths = await durationInMonths
    .locator('input')
    .first();
  await inputOfDurationInMonths.fill(
    `${formatAmount(financeData.durationInMonths)}`
  );

  const downPayment = await page.getByTestId(
    `${groupName}${proposalTestIds.financeDownPayment}`
  );
  await expect(downPayment).toBeTruthy();
  const inputOfDownPayment = await downPayment.locator('input').first();
  await inputOfDownPayment.fill(`${formatAmount(financeData.downPayment)}`);

  const annualInterestRate = await page.getByTestId(
    `${groupName}${proposalTestIds.financeAnnualInterestRate}`
  );
  await expect(annualInterestRate).toBeTruthy();
  const inputOfAnnualInterestRate = await annualInterestRate
    .locator('input')
    .first();
  await inputOfAnnualInterestRate.fill(
    `${formatAmount(financeData.annualInterestRate)}`
  );

  const finalTerm = await page.getByTestId(
    `${groupName}${proposalTestIds.financeFinalTerm}`
  );
  await expect(finalTerm).toBeTruthy();
  const inputOfFinalTerm = await finalTerm.locator('input').first();
  await inputOfFinalTerm.fill(`${formatAmount(financeData.finalTerm)}`);
  const totalExclVat = await page.getByTestId(
    `${proposalTestIds.financialSummaryInDetails}${proposalTestIds.quotationTotalExclVatValue}`
  );
  const totalExclVatText = await totalExclVat.innerText();
  const totalExclVatTextValue = totalExclVatText.split('€')[1];
  // Converting dutch format to normal format
  const totalExclVatToNumber = formatPlainStringToCurrency(
    totalExclVatTextValue
  );

  const totalInclVat = await page.getByTestId(
    `${proposalTestIds.financialSummaryInDetails}${proposalTestIds.quotationTotalInclVatValue}`
  );
  const totalInclVatText = await totalInclVat.innerText();
  const totalInclVatValue = `${totalInclVatText}`.split('€')[1];
  const totalInclVatToNumber = formatPlainStringToCurrency(totalInclVatValue);

  const financeCalculatedValue = calculateMonthlyExclVat({
    duration: financeData.durationInMonths,
    downPayment: financeData.downPayment,
    interest: financeData.annualInterestRate,
    finalTerm: financeData.finalTerm,
    totalExcludingVat: totalExclVatToNumber,
    totalIncludingVat: totalInclVatToNumber,
    quotationType,
  });
  const FinanceCalculatedRoundedValue = formatAmountAfterRounding({
    value: financeCalculatedValue,
  });

  const monthlyExclVATValue = await page.getByTestId(
    `${groupName}${proposalTestIds.financeMonthlyExclVat}-input`
  );

  await expect(monthlyExclVATValue).toBeTruthy();
  await expect(monthlyExclVATValue).toHaveValue(FinanceCalculatedRoundedValue);
  const submitButton = await page.getByTestId(
    `${proposalTestIds.addFinanceSubmitBtn}-save-btn`
  );
  await expect(submitButton).toBeTruthy();
  await submitButton.click();

  const newFinance = await page.getByTestId(
    `${groupName}-${removeSpaceFromString(en.quotations.financeTypes[financeData.type])}-name`
  );
  await expect(newFinance).toBeTruthy();
  await expect(newFinance).toHaveText(
    en.quotations.financeTypes[financeData.type]
  );
};

export const addProductLineGroup = async ({
  page,
  productData,
  groupName = tenantGroupIdMap[0],
}: {
  page: Page;
  productData: LineGroupItemProduct;
  groupName?: string;
}) => {
  const tenantGroup = await page.getByTestId(
    `${removeSpaceFromString(groupName)}${proposalTestIds.addLineItem}`
  );

  await expect(tenantGroup).toBeTruthy();
  await tenantGroup.click();
  for (let i = 0; i < lineGroupMenuItems.length; i += 1) {
    const lineGroupItem = lineGroupMenuItems[i];
    expect(page.getByTestId(lineGroupItem)).toBeTruthy();
  }
  await page.getByTestId(proposalTestIds.addProduct).click();

  const productFormName = await page.getByTestId(
    `${removeSpaceFromString(groupName)}${proposalTestIds.productName}-input`
  );

  const productQuantity = await page.getByTestId(
    `${removeSpaceFromString(groupName)}${proposalTestIds.productQuantity}`
  );
  const inputOfProductQuantity = productQuantity.locator('input').first();

  const productFormAmount = await page.getByTestId(
    `${removeSpaceFromString(groupName)}${proposalTestIds.productUnitPriceExclVat}`
  );
  const inputOfProductFormAmount = productFormAmount.locator('input').first();

  const addProductBtn = await page.getByTestId(
    `${proposalTestIds.addProductSubmitBtn}-save-btn`
  );

  await expect(productFormName).toBeTruthy();
  await expect(productQuantity).toBeTruthy();
  await expect(inputOfProductQuantity).toBeTruthy();
  await expect(productFormAmount).toBeTruthy();
  await expect(productFormAmount).toBeTruthy();
  await expect(addProductBtn).toBeTruthy();

  await productFormName.click();
  await productFormName.fill(productData.name);
  await productQuantity.click();
  await inputOfProductQuantity.fill(productData.quantity.toString());
  await inputOfProductFormAmount.click();
  await inputOfProductFormAmount.fill(formatAmount(productData.unitPrice));
  await await addProductBtn.click();

  const newProductAdded = await page.getByTestId(
    `${groupName}-${removeSpaceFromString(productData.name)}-name`
  );
  await expect(newProductAdded).toBeTruthy();
  await expect(newProductAdded).toHaveText(productData.name);
};

export const addTradeInVehicle = async ({
  page,
  tradeInData,
  groupName = tenantGroupIdMap[0],
}: {
  page: Page;
  tradeInData: LineGroupItemTradeIn;
  groupName?: string;
}) => {
  const firstTenantGroupAddBtn = await page.getByTestId(
    `${groupName}${proposalTestIds.addLineItem}`
  );
  await firstTenantGroupAddBtn.click();
  await page.getByTestId(proposalTestIds.addTradeInVehicle).click();

  const tradeInVehicleDescriptionInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInBrandModelDescription}-input`
  );

  await tradeInVehicleDescriptionInput.fill(tradeInData.description);

  const tradeInVehicleLicensePlateInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInLicensePlate}-input`
  );

  if (tradeInData?.licensePlate) {
    await tradeInVehicleLicensePlateInput.fill(tradeInData?.licensePlate);
  }

  const tradeInVehicleMileageInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInMileage}-input`
  );

  await tradeInVehicleMileageInput.click();

  const fetchVehicleDetailsUsingLicensePlateResponsePromise =
    page.waitForResponse(
      (response) => {
        if (
          response.url().includes('/quotations/') &&
          response.status() !== 200
        ) {
          console.log(
            'fetch vehicle details using license plate api call failed'
          );
          console.log(response.url());
          console.log(response.status());
          throw new Error('API FAILURE');
        }

        return (
          response.url().includes('/quotations') &&
          response.request().method() === 'POST' &&
          response.status() === 200
        );
      },
      { timeout: 20000 }
    );

  await fetchVehicleDetailsUsingLicensePlateResponsePromise;
  const response = await fetchVehicleDetailsUsingLicensePlateResponsePromise;
  const resStatus = response.status();
  const responseData = await response.text();
  if (resStatus === 200 && responseData.includes('rdwColor')) {
    // TODO: Here not confirming the values in fields  bpm, date of registration, color, residual bpm are filled by api response data
    //  if api returns vehicle details for given license plate number since that api is server action call and response is in text/x-component parse it later

    //  check the values in fields  bpm, date of registration, color, residual bpm are
    //   filled by api response data if api returns vehicle details for given license plate number
    // this depends on fields send from BE
    const tradeRegistrationDatePickerInput = await page.getByTestId(
      `${groupName}${proposalTestIds.tradeRegistrationDate}${datePickerComponentTestIds.datePickerInput}`
    );
    const tradeInOriginalBPMInput = await page.getByTestId(
      `${groupName}${proposalTestIds.tradeInOriginalBPM}-input`
    );
    const tradeInResidualBPMInput = await page.getByTestId(
      `${groupName}${proposalTestIds.tradeInResidualBPM}-input`
    );
    const tradeInColorInput = await page.getByTestId(
      `${groupName}${proposalTestIds.tradeInColor}-input`
    );
    await expect(tradeRegistrationDatePickerInput).not.toBeEmpty();

    await expect(tradeInOriginalBPMInput).not.toBeEmpty();

    await expect(tradeInResidualBPMInput).not.toBeEmpty();

    await expect(tradeInColorInput).not.toBeEmpty();
  } else {
    // fill all fields since api response data is not available

    const tradeRegistrationDatePickerInput = await page.getByTestId(
      `${groupName}${proposalTestIds.tradeRegistrationDate}${datePickerComponentTestIds.datePickerInput}`
    );

    await tradeRegistrationDatePickerInput.fill(
      convertDateFormatToDDMMYYYY(tradeInData.registrationDate)
    );

    const tradeInOriginalBPMInput = await page.getByTestId(
      `${groupName}${proposalTestIds.tradeInOriginalBPM}-input`
    );

    if (tradeInData.originalBPM) {
      const formattedOriginalBpm = formatAmountAfterRounding({
        value: tradeInData.originalBPM,
      });
      await tradeInOriginalBPMInput.fill(formattedOriginalBpm);
    }

    const tradeInResidualBPMInput = await page.getByTestId(
      `${groupName}${proposalTestIds.tradeInResidualBPM}-input`
    );

    if (tradeInData.residualBPM) {
      await tradeInResidualBPMInput.fill(
        formatAmountAfterRounding({ value: tradeInData.residualBPM })
      );
    }
    const tradeInColorInput = await page.getByTestId(
      `${groupName}${proposalTestIds.tradeInColor}-input`
    );

    await tradeInColorInput.fill(tradeInData.colour);
  }
  if (tradeInData.mileage) {
    const formattedMileage = formatAmountAfterRounding({
      value: tradeInData.mileage,
    });
    await tradeInVehicleMileageInput.fill(formattedMileage);
  }

  const tradeInVinInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInVin}-input`
  );

  if (tradeInData.vin) {
    await tradeInVinInput.fill(`${tradeInData.vin}`);
  }

  const tradeInOrderIdInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInOrderId}-input`
  );

  if (tradeInData.orderId) {
    await tradeInOrderIdInput.fill(tradeInData.orderId);
  }

  const tradeInValueInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInValue}-input`
  );

  await tradeInValueInput.fill(
    formatAmountAfterRounding({ value: tradeInData.tradeInValue })
  );

  const tradeInValuationInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInValuation}-input`
  );

  if (tradeInData.valuation) {
    await tradeInValuationInput.fill(
      formatAmountAfterRounding({ value: tradeInData.valuation })
    );
  }

  const tradeInDatePickerInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInDate}${datePickerComponentTestIds.datePickerInput}`
  );
  if (tradeInData.tradeInDate)
    await tradeInDatePickerInput.fill(
      convertDateFormatToDDMMYYYY(tradeInData.tradeInDate)
    );

  const tradeInInto = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInInto}`
  );

  await tradeInInto.first().click();

  const tradeInMarginOrVat = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInMargin}`
  );
  const tradeInMarginOrVatInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInMargin}-input`
  );

  const tradeIntoValue = page.getByTestId(
    `${groupName}${proposalTestIds.tradeInInto}-${tradeInData.tradeInTo}`
  );

  await expect(tradeIntoValue).toBeTruthy();
  await tradeIntoValue.first().click();

  await expect(tradeInMarginOrVat).toBeTruthy();
  await expect(tradeInMarginOrVatInput).toBeTruthy();
  await tradeInMarginOrVat.first().click();

  const marginOrVatValue = page.getByTestId(
    `${groupName}${proposalTestIds.tradeInMargin}-${tradeInData.margin}`
  );

  await expect(marginOrVatValue).toBeTruthy();
  await marginOrVatValue.first().click();

  const createTradeInBtn = await page.getByTestId(
    `${proposalTestIds.addTradeInSubmitBtn}-save-btn`
  );
  await expect(createTradeInBtn).toBeTruthy();

  await createTradeInBtn.click();
  const createdNewItem = page.getByTestId(
    `${groupName}-${removeSpaceFromString(tradeInData.description)}-name`
  );
  await expect(createdNewItem).toBeTruthy();
  await expect(createdNewItem).toHaveText(tradeInData.description);
};

export const editFinance = async ({
  page,
  financeData,
  groupName = tenantGroupIdMap[0],
}: {
  page: Page;
  groupName?: string;
  financeData: FinanceEditDataType;
}) => {
  const financeType = financeData.type;

  await page
    .getByTestId(`${groupName}-${financeTypeMapper[financeType]}`)
    .getByTestId(`${ellipsisMenuTestIds.ellipsisMenuButton}-icon`)
    .click();

  await page
    .getByTestId(`${proposalTestIds.orderLineItemActionMenuEdit}`)
    .click();

  const quotationType = getQuotationTypeUsingFinanceType(financeData.type);

  const updatedFinanceData = {
    durationInMonths: financeData.durationInMonths || 0,
    downPayment: financeData.downPayment || 0,
    annualInterestRate: financeData.annualInterestRate || 0,
    finalTerm: financeData.finalTerm || 0,
  };

  const durationInMonths = await page.getByTestId(
    `${groupName}${proposalTestIds.financeDurationMonths}`
  );
  if (financeData.durationInMonths) {
    await expect(durationInMonths).toBeTruthy();
    const inputOfDurationInMonths = await durationInMonths
      .locator('input')
      .first();
    await inputOfDurationInMonths.fill(
      `${formatAmount(financeData.durationInMonths)}`
    );
  } else {
    const durationValue = await durationInMonths
      .locator('input')
      .first()
      .getAttribute('value');
    if (durationValue) {
      updatedFinanceData.durationInMonths = parseInt(durationValue, 10);
    }
  }

  const downPayment = await page.getByTestId(
    `${groupName}${proposalTestIds.financeDownPayment}`
  );
  if (financeData.downPayment) {
    await expect(downPayment).toBeTruthy();
    const inputOfDownPayment = await downPayment.locator('input').first();
    await inputOfDownPayment.fill(`${formatAmount(financeData.downPayment)}`);
  } else {
    const downPaymentValue = await downPayment
      .locator('input')
      .first()
      .getAttribute('value');
    if (downPaymentValue) {
      updatedFinanceData.downPayment = parseInt(downPaymentValue, 10);
    }
  }

  const annualInterestRate = await page.getByTestId(
    `${groupName}${proposalTestIds.financeAnnualInterestRate}`
  );
  if (financeData.annualInterestRate) {
    await expect(annualInterestRate).toBeTruthy();
    const inputOfAnnualInterestRate = await annualInterestRate
      .locator('input')
      .first();
    await inputOfAnnualInterestRate.fill(
      `${formatAmount(financeData.annualInterestRate)}`
    );
  } else {
    const annualInterestRateValue = await annualInterestRate
      .locator('input')
      .first()
      .getAttribute('value');
    if (annualInterestRateValue) {
      updatedFinanceData.annualInterestRate = parseFloat(
        annualInterestRateValue
      );
    }
  }

  const finalTerm = await page.getByTestId(
    `${groupName}${proposalTestIds.financeFinalTerm}`
  );
  if (financeData.finalTerm) {
    await expect(finalTerm).toBeTruthy();
    const inputOfFinalTerm = await finalTerm.locator('input').first();
    await inputOfFinalTerm.fill(`${formatAmount(financeData.finalTerm)}`);
  } else {
    const finalTermValue = await finalTerm
      .locator('input')
      .first()
      .getAttribute('value');
    if (finalTermValue) {
      updatedFinanceData.finalTerm = parseInt(finalTermValue, 10);
    }
  }

  const totalExclVat = await page.getByTestId(
    `${proposalTestIds.financialSummaryInDetails}${proposalTestIds.quotationTotalExclVatValue}`
  );
  const totalExclVatText = await totalExclVat.innerText();
  const totalExclVatTextValue = totalExclVatText.split('€')[1];
  // Converting dutch format to normal format
  const totalExclVatToNumber = formatPlainStringToCurrency(
    totalExclVatTextValue
  );

  const totalInclVat = await page.getByTestId(
    `${proposalTestIds.financialSummaryInDetails}${proposalTestIds.quotationTotalInclVatValue}`
  );
  const totalInclVatText = await totalInclVat.innerText();
  const totalInclVatValue = `${totalInclVatText}`.split('€')[1];
  const totalInclVatToNumber = formatPlainStringToCurrency(totalInclVatValue);

  const financeCalculatedValue = calculateMonthlyExclVat({
    duration: updatedFinanceData.durationInMonths,
    downPayment: updatedFinanceData.downPayment,
    interest: updatedFinanceData.annualInterestRate,
    finalTerm: updatedFinanceData.finalTerm,
    totalExcludingVat: totalExclVatToNumber,
    totalIncludingVat: totalInclVatToNumber,
    quotationType,
  });
  const FinanceCalculatedRoundedValue = formatAmountAfterRounding({
    value: financeCalculatedValue,
  });

  const monthlyExclVATValue = await page.getByTestId(
    `${groupName}${proposalTestIds.financeMonthlyExclVat}-input`
  );

  await expect(monthlyExclVATValue).toBeTruthy();
  await expect(monthlyExclVATValue).toHaveValue(FinanceCalculatedRoundedValue);
  const submitButton = await page.getByTestId(
    `${proposalTestIds.addFinanceSubmitBtn}-save-btn`
  );
  await expect(submitButton).toBeTruthy();
  await submitButton.click();

  const newFinance = await page.getByTestId(
    `${groupName}-${removeSpaceFromString(en.quotations.financeTypes[financeData.type])}-name`
  );
  await expect(newFinance).toBeTruthy();
  await expect(newFinance).toHaveText(
    en.quotations.financeTypes[financeData.type]
  );
};

export const editProduct = async ({
  page,
  productName,
  newProductData,
  groupName = tenantGroupIdMap[0],
}: {
  page: Page;
  groupName?: string;
  productName: string;
  newProductData: ProductEditDataType;
}) => {
  const productNameWithoutSpace = removeSpaceFromString(productName);
  await page
    .getByTestId(`${groupName}-${productNameWithoutSpace}`)
    .getByTestId(`${ellipsisMenuTestIds.ellipsisMenuButton}-icon`)
    .click();

  await page
    .getByTestId(`${proposalTestIds.orderLineItemActionMenuEdit}`)
    .click();

  if (newProductData.name) {
    const productFormName = await page.getByTestId(
      `${groupName}${removeSpaceFromString(proposalTestIds.productName)}-input`
    );
    await productFormName.fill(newProductData.name);
  }

  if (newProductData.quantity) {
    const productQuantity = await page.getByTestId(
      `${groupName}${proposalTestIds.productQuantity}`
    );
    const inputOfProductQuantity = productQuantity.locator('input').first();
    await inputOfProductQuantity.fill(newProductData.quantity.toString());
  }

  if (newProductData.unitPrice) {
    const productFormAmount = await page.getByTestId(
      `${groupName}${proposalTestIds.productUnitPriceExclVat}`
    );
    const inputOfProductFormAmount = productFormAmount.locator('input').first();
    await inputOfProductFormAmount.fill(newProductData.unitPrice.toString());
  }

  await page
    .getByTestId(`${proposalTestIds.addProductSubmitBtn}-save-btn`)
    .click();

  if (newProductData.name) {
    const newProductAdded = await page.getByTestId(
      `${groupName}-${removeSpaceFromString(newProductData.name)}-name`
    );
    await expect(newProductAdded).toBeTruthy();

    await expect(newProductAdded).toHaveText(newProductData.name);
  } else {
    const newProductAdded = await page.getByTestId(
      `${groupName}-${productNameWithoutSpace}-name`
    );
    await expect(newProductAdded).toBeTruthy();

    await expect(newProductAdded).toHaveText(productName);
  }
};

export const editPurchaseVehicle = async ({
  page,
  purchaseVehicleData,
  purchaseVehicleName,
  groupName = tenantGroupIdMap[0],
}: {
  page: Page;
  groupName?: string;
  purchaseVehicleName: string;
  purchaseVehicleData: PurchaseVehicleEditDataType;
}) => {
  const nameWithoutSpace = removeSpaceFromString(purchaseVehicleName);
  await page
    .getByTestId(`${groupName}-${nameWithoutSpace}`)
    .getByTestId(`${ellipsisMenuTestIds.ellipsisMenuButton}-icon`)
    .click();
  await page
    .getByTestId(`${proposalTestIds.orderLineItemActionMenuEdit}`)
    .click();

  const vehicleDescriptionField = await page.getByTestId(
    `${groupName}${proposalTestIds.purchaseVehicleDescription}-input`
  );

  const vehiclePriceExclVatField = await page.getByTestId(
    `${groupName}${proposalTestIds.purchaseVehicleVehiclePriceExclVat}-input`
  );

  const vehicleBpmField = await page.getByTestId(
    `${groupName}${proposalTestIds.purchaseVehicleBpm}-input`
  );

  const vehicleDriverNameField = await page.getByTestId(
    `${groupName}${proposalTestIds.purchaseVehicleDriverName}-input`
  );

  const vehicleLicenseDateField = await page.getByTestId(
    `${groupName}${proposalTestIds.purchaseVehicleLicenseDate}${datePickerComponentTestIds.datePickerInput}`
  );

  const vehicleDeliveryDateField = await page.getByTestId(
    `${groupName}${proposalTestIds.purchaseVehicleDeliveryDate}${datePickerComponentTestIds.datePickerInput}`
  );

  const deleteProductBtn = await page.getByTestId(
    proposalTestIds.deletePurchaseVehicleImageBtn
  );
  await expect(vehicleDescriptionField).not.toBeEmpty();
  await expect(vehiclePriceExclVatField).not.toBeEmpty();
  await expect(vehicleBpmField).not.toBeEmpty();

  await deleteProductBtn.click();

  await expect(vehicleDescriptionField).toBeEmpty();
  await expect(vehicleDriverNameField).toBeEmpty();
  await expect(vehicleLicenseDateField).toBeEmpty();
  await expect(vehicleDeliveryDateField).toBeEmpty();

  const findVehicleField = await page.getByTestId(
    `${groupName}${proposalTestIds.findVehicleField}`
  );

  await expect(findVehicleField).toBeTruthy();
  await findVehicleField.click();

  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(routeRegex.vehicles.vehicles);

  const vehicleListItem = await page.getByTestId(
    carStockListTestIds.carStockListItem
  );
  await expect(vehicleListItem).not.toHaveCount(0);

  const thirdVehicle = vehicleListItem.nth(2);
  const vehicleName = await thirdVehicle
    .getByTestId(carStockListTestIds.vehicleDescription)
    .allInnerTexts();

  const vehicleSelectButton = await thirdVehicle.getByTestId(
    carStockListTestIds.selectVehicleButton
  );

  await expect(vehicleSelectButton).toBeTruthy();

  await vehicleSelectButton.click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(routeRegex.quotation.anyQuotation);

  const purchaseVehicle = await page.getByTestId(
    `${groupName}-${removeSpaceFromString(vehicleName[0])}-name`
  );
  await expect(purchaseVehicle).toBeTruthy();
  await expect(purchaseVehicle).toHaveText(vehicleName[0]);

  await page.waitForLoadState('networkidle');

  await page
    .getByTestId(`${groupName}-${removeSpaceFromString(vehicleName[0])}`)
    .getByTestId(`${ellipsisMenuTestIds.ellipsisMenuButton}-icon`)
    .click();
  await page
    .getByTestId(`${proposalTestIds.orderLineItemActionMenuEdit}`)
    .click();

  if (purchaseVehicleData.vehicleDescription) {
    await vehicleDescriptionField.fill(purchaseVehicleData.vehicleDescription);
  }

  if (purchaseVehicleData.driverName) {
    await vehicleDriverNameField.fill(purchaseVehicleData.driverName);
  }

  if (purchaseVehicleData.licenseDate) {
    await vehicleLicenseDateField.fill(
      convertDateFormatToDDMMYYYY(purchaseVehicleData.licenseDate)
    );
  }

  if (purchaseVehicleData.deliveryDate) {
    await vehicleDeliveryDateField.fill(
      convertDateFormatToDDMMYYYY(purchaseVehicleData.deliveryDate)
    );
  }
  const saveButton = await page.getByTestId(
    `${proposalTestIds.addPurchaseVehicleSubmitBtn}-save-btn`
  );

  await saveButton.click();
};

export const editTradeInVehicle = async ({
  page,
  tradeInVehicleData,
  tradeInVehicleName,
  groupName = tenantGroupIdMap[0],
}: {
  page: Page;
  tradeInVehicleData: TradeInVehicleEditDataType;
  tradeInVehicleName: string;
  groupName?: string;
}) => {
  await page
    .getByTestId(`${groupName}-${tradeInVehicleName}`)
    .getByTestId(`${ellipsisMenuTestIds.ellipsisMenuButton}-icon`)
    .click();
  await page
    .getByTestId(`${proposalTestIds.orderLineItemActionMenuEdit}`)
    .click();

  const tradeInVehicleDescriptionInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInBrandModelDescription}-input`
  );
  const tradeInVehicleLicensePlateInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInLicensePlate}-input`
  );
  const tradeInVehicleMileageInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInMileage}-input`
  );
  const tradeInVinInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInVin}-input`
  );
  const tradeInOrderIdInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInOrderId}-input`
  );
  const tradeInColorInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInColor}-input`
  );
  const tradeRegistrationDatePickerInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeRegistrationDate}${datePickerComponentTestIds.datePickerInput}`
  );
  const tradeInValueInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInValue}-input`
  );
  const tradeInValuationInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInValuation}-input`
  );
  const tradeInOriginalBPMInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInOriginalBPM}-input`
  );
  const tradeInResidualBPMInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInResidualBPM}-input`
  );
  const tradeInDatePickerInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInDate}${datePickerComponentTestIds.datePickerInput}`
  );
  const tradeInInto = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInInto}`
  );
  const tradeInMarginOrVat = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInMargin}`
  );

  if (tradeInVehicleData.description) {
    await tradeInVehicleDescriptionInput.fill(tradeInVehicleData.description);
  }

  if (tradeInVehicleData.licensePlate) {
    const fetchVehicleDetailsUsingLicensePlateResponsePromise =
      page.waitForResponse(
        (response) => {
          if (
            response.url().includes('/quotations/') &&
            response.status() !== 200
          ) {
            console.log(
              'fetch vehicle details using license plate api call failed'
            );
            console.log(response.url());
            console.log(response.status());
            throw new Error('API FAILURE');
          }

          return (
            response.url().includes('/quotations') &&
            response.request().method() === 'POST' &&
            response.status() === 200
          );
        },
        { timeout: 20000 }
      );
    await tradeInVehicleLicensePlateInput.fill(tradeInVehicleData.licensePlate);
    await tradeInVehicleMileageInput.click();

    await fetchVehicleDetailsUsingLicensePlateResponsePromise;
    const response = await fetchVehicleDetailsUsingLicensePlateResponsePromise;
    const resStatus = response.status();
    const responseData = await response.text();
    if (resStatus === 200 && responseData.includes('rdwColor')) {
      // TODO: Here not confirming the values in fields  bpm, date of registration, color, residual bpm are filled by api response data
      //  if api returns vehicle details for given license plate number since that api is server action call and response is in text/x-component parse it later

      //  check the values in fields  bpm, date of registration, color, residual bpm are
      //   filled by api response data if api returns vehicle details for given license plate number
      // this depends on fields send from BE

      await expect(tradeRegistrationDatePickerInput).not.toBeEmpty();

      await expect(tradeInOriginalBPMInput).not.toBeEmpty();

      await expect(tradeInResidualBPMInput).not.toBeEmpty();

      await expect(tradeInColorInput).not.toBeEmpty();
    }
  }

  if (tradeInVehicleData.mileage) {
    await tradeInVehicleMileageInput.fill(
      formatAmountAfterRounding({ value: tradeInVehicleData.mileage })
    );
  }
  if (tradeInVehicleData.vin) {
    await tradeInVinInput.fill(tradeInVehicleData.vin);
  }
  if (tradeInVehicleData.orderId) {
    await tradeInOrderIdInput.fill(tradeInVehicleData.orderId);
  }
  if (tradeInVehicleData.color) {
    await tradeInColorInput.fill(tradeInVehicleData.color);
  }
  if (tradeInVehicleData.registrationDate) {
    await tradeRegistrationDatePickerInput.fill(
      convertDateFormatToDDMMYYYY(tradeInVehicleData.registrationDate)
    );
  }
  if (tradeInVehicleData.tradeInValue) {
    await tradeInValueInput.fill(
      formatAmountAfterRounding({ value: tradeInVehicleData.tradeInValue })
    );
  }
  if (tradeInVehicleData.valuation) {
    await tradeInValuationInput.fill(
      formatAmountAfterRounding({ value: tradeInVehicleData.valuation })
    );
  }
  if (tradeInVehicleData.originalBPM) {
    const formattedOriginalBpm = formatAmountAfterRounding({
      value: tradeInVehicleData.originalBPM,
    });
    await tradeInOriginalBPMInput.fill(formattedOriginalBpm);
  }
  if (tradeInVehicleData.residualBPM) {
    await tradeInResidualBPMInput.fill(
      formatAmountAfterRounding({ value: tradeInVehicleData.residualBPM })
    );
  }
  if (tradeInVehicleData.tradeInDate) {
    await tradeInDatePickerInput.fill(
      convertDateFormatToDDMMYYYY(tradeInVehicleData.tradeInDate)
    );
  }
  if (tradeInVehicleData.tradeInTo) {
    await tradeInInto.click();
    const tradeIntoValue = page.getByTestId(
      `${groupName}${proposalTestIds.tradeInInto}-${tradeInVehicleData.tradeInTo}`
    );
    await tradeIntoValue.click();
  }
  if (tradeInVehicleData.margin) {
    await tradeInMarginOrVat.click();
    await page
      .getByTestId(
        `${groupName}${proposalTestIds.tradeInMargin}-${tradeInVehicleData.margin}`
      )
      .click();
  }

  const createTradeInBtn = await page.getByTestId(
    `${proposalTestIds.addTradeInSubmitBtn}-save-btn`
  );
  await expect(createTradeInBtn).toBeTruthy();

  await createTradeInBtn.click();
};

export const checkQuotationFormRenderedCorrectly = async (
  page: Page,
  newOpportunityTestInputData: OpportunityInputDataProps
) => {
  const vatType = Object.values(QuotationVATTypeEnum);
  const firstGroupName = tenantGroupIdMap[0];
  const secondGroupName = tenantGroupIdMap[1];
  const thirdGroupName = tenantGroupIdMap[2];
  const fourthGroupName = tenantGroupIdMap[3];
  const fifthGroupName = tenantGroupIdMap[4];

  await page
    .getByRole('textbox', { name: 'Search' })
    .fill(newOpportunityTestInputData.name);
  await expect(
    page.locator('[data-testid="table-column-0"]', {
      hasText: newOpportunityTestInputData.name,
    })
  ).not.toHaveCount(0);
  await page.getByTestId('table-row-0').first().click();

  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(routeRegex.opportunity.opportunitiesDetails);

  const addQuotationBtn = await page.getByTestId(
    opportunityTestIds.addQuotationButton
  );

  await expect(addQuotationBtn).toBeTruthy();
  await addQuotationBtn.click();

  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(routeRegex.quotation.quotationsNew);

  const vatTypeDropDown = await page.getByTestId(
    `${proposalTestIds.financialSummaryInDetails}${proposalTestIds.quotationVATType}`
  );
  await expect(vatTypeDropDown).toBeTruthy();
  await vatTypeDropDown.click();

  vatType.forEach(async (vatTypeItem: string) => {
    await expect(
      page.getByTestId(
        `${proposalTestIds.financialSummaryInDetails}-${vatTypeItem}`
      )
    ).toBeTruthy();
  });

  await page
    .getByTestId(`${proposalTestIds.financialSummaryInDetails}-${vatType[1]}`)
    .click();

  const firstTenantGroupAddBtn = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.addLineItem}`
  );
  const secondTenantGroupAddBtn = await page.getByTestId(
    `${secondGroupName}${proposalTestIds.addLineItem}`
  );
  const thirdTenantGroupAddBtn = await page.getByTestId(
    `${thirdGroupName}${proposalTestIds.addLineItem}`
  );
  const fourthTenantGroupAddBtn = await page.getByTestId(
    `${fourthGroupName}${proposalTestIds.addLineItem}`
  );
  const fifthTenantGroupAddBtn = await page.getByTestId(
    `${fifthGroupName}${proposalTestIds.addLineItem}`
  );

  await expect(firstTenantGroupAddBtn).toBeTruthy();
  await expect(secondTenantGroupAddBtn).toBeTruthy();
  await expect(thirdTenantGroupAddBtn).toBeTruthy();
  await expect(fourthTenantGroupAddBtn).toBeTruthy();
  await expect(fifthTenantGroupAddBtn).toBeTruthy();

  await firstTenantGroupAddBtn.click();
  for (let i = 0; i < lineGroupMenuItems.length; i += 1) {
    const lineGroupItem = lineGroupMenuItems[i];
    expect(page.getByTestId(lineGroupItem)).toBeTruthy();
  }
  await expect(
    page.getByTestId(proposalTestIds.addPurchaseVehicle)
  ).toBeTruthy();
  await expect(page.getByTestId(proposalTestIds.addProduct)).toBeTruthy();
  await expect(
    page.getByTestId(proposalTestIds.addTradeInVehicle)
  ).toBeTruthy();
  await page.getByTestId(proposalTestIds.addFinance).isDisabled();

  await page.getByTestId(proposalTestIds.addPurchaseVehicle).click();

  // Checking all fields are rendered properly for purchase form

  const findVehicleField = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.findVehicleField}`
  );
  const vehicleDescriptionField = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.purchaseVehicleDescription}`
  );
  const vehiclePriceExclVatField = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.purchaseVehicleVehiclePriceExclVat}`
  );
  const driverNameField = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.purchaseVehicleDriverName}`
  );
  const vehicleBpmField = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.purchaseVehicleBpm}`
  );
  const findVehicleVatTypeField = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.purchaseVehicleVatTye}`
  );
  const licenseExpiryDateField = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.purchaseVehicleLicenseDate}`
  );
  const licenseExpiryDateFieldInput = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.purchaseVehicleLicenseDate}${datePickerComponentTestIds.datePickerInput}`
  );
  const vehicleDeliveryDateField = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.purchaseVehicleDeliveryDate}`
  );

  const vehicleDeliveryDateFieldInput = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.purchaseVehicleDeliveryDate}${datePickerComponentTestIds.datePickerInput}`
  );
  const cancelButton = await page.getByTestId(
    `${proposalTestIds.purchaseVehicleSubmitLine}-cancel-btn`
  );

  await expect(findVehicleField).toBeTruthy();
  await expect(findVehicleField).toHaveText(en.quotations.findVehicle);

  // await expect(vehicleImageField).toBeTruthy();
  // await expect(vehicleImageField).not.toBeDisabled();

  await expect(vehicleDescriptionField).toBeTruthy();
  await expect(
    vehicleDescriptionField.locator('textarea').first()
  ).toBeDisabled();
  await expect(vehicleDescriptionField).toHaveText(
    `${en.common['brand-description']} *`
  );

  await expect(vehiclePriceExclVatField).toBeTruthy();
  await expect(
    vehiclePriceExclVatField.locator('input').first()
  ).toBeDisabled();
  await expect(vehiclePriceExclVatField.locator('label')).toHaveText(
    `${en.common.vehiclePriceExclVat} *`
  );

  await expect(driverNameField).toBeTruthy();
  await expect(driverNameField.locator('input').first()).toBeDisabled();
  await expect(driverNameField.locator('label')).toHaveText(
    en.common.driverName
  );

  await expect(vehicleBpmField).toBeTruthy();
  await expect(vehicleBpmField.locator('input').first()).toBeDisabled();
  await expect(vehicleBpmField.locator('label')).toHaveText(en.common.BPM);

  await expect(findVehicleVatTypeField).toBeTruthy();
  await expect(findVehicleVatTypeField.locator('input').first()).toBeDisabled();
  await expect(findVehicleVatTypeField.locator('label')).toHaveText(
    en.common.vatType
  );

  await expect(licenseExpiryDateField).toBeTruthy();
  await expect(vehicleDeliveryDateFieldInput).toBeDisabled();
  await expect(licenseExpiryDateField.locator('label')).toHaveText(
    en.common.licenseDate
  );

  await expect(vehicleDeliveryDateField).toBeTruthy();
  await expect(licenseExpiryDateFieldInput).toBeDisabled();
  await expect(vehicleDeliveryDateField.locator('label')).toHaveText(
    en.common.deliveryDate
  );

  await expect(
    page.getByTestId(`${proposalTestIds.purchaseVehicleSubmitLine}-cancel-btn`)
  ).toBeTruthy();
  await expect(
    page.getByTestId(`${proposalTestIds.purchaseVehicleSubmitLine}-save-btn`)
  ).toBeTruthy();

  await cancelButton.click();

  // Checking all fields are rendered properly for product form

  await firstTenantGroupAddBtn.click();
  await page.getByTestId(proposalTestIds.addProduct).click();

  const productNameField = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.productName}`
  );
  const productQuantityField = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.productQuantity}`
  );
  const productUnitPriceField = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.productUnitPriceExclVat}`
  );
  const productVatTypeField = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.productVatType}`
  );
  const productCancelBtn = await page.getByTestId(
    `${proposalTestIds.addProductSubmitBtn}-cancel-btn`
  );

  await expect(productNameField).toBeTruthy();
  await expect(productNameField.locator('label')).toHaveText(
    `${en.common.product} *`
  );
  await expect(productNameField.locator('input')).not.toBeDisabled();

  await expect(productQuantityField).toBeTruthy();
  await expect(productQuantityField.locator('label')).toHaveText(
    `${en.common.quantity} *`
  );
  await expect(productQuantityField.locator('input')).not.toBeDisabled();

  await expect(productUnitPriceField).toBeTruthy();
  await expect(productUnitPriceField.locator('label')).toHaveText(
    `${en.common.unitPriceExclVat} *`
  );
  await expect(productUnitPriceField.locator('input')).not.toBeDisabled();
  await expect(productVatTypeField).toBeTruthy();
  await expect(productVatTypeField.locator('label')).toHaveText(
    en.common.vatType
  );
  await expect(productVatTypeField.locator('input')).toBeDisabled();
  await productCancelBtn.click();

  // Checking all fields are rendered properly for trade-in form
  await firstTenantGroupAddBtn.click();
  await page.getByTestId(proposalTestIds.addTradeInVehicle).click();

  const tradeInFindVehicle = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeInImageUploadBtn}`
  );

  const tradeInVehicleDescription = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeInBrandModelDescription}`
  );
  const tradeInVehicleDescriptionInput = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeInBrandModelDescription}-input`
  );

  const tradeInVehicleLicensePlate = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeInLicensePlate}`
  );
  const tradeInVehicleLicensePlateInput = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeInLicensePlate}-input`
  );

  const tradeInVehicleMileage = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeInMileage}`
  );
  const tradeInVehicleMileageInput = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeInMileage}-input`
  );

  const tradeInVin = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeInVin}`
  );
  const tradeInVinInput = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeInVin}-input`
  );

  const tradeInOrderId = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeInOrderId}`
  );
  const tradeInOrderIdInput = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeInOrderId}-input`
  );

  const tradeInColor = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeInColor}`
  );
  const tradeInColorInput = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeInColor}-input`
  );

  const tradeRegistrationDate = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeRegistrationDate}`
  );
  const tradeRegistrationDatePickerInput = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeRegistrationDate}${datePickerComponentTestIds.datePickerInput}`
  );

  const tradeInValue = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeInValue}`
  );
  const tradeInValueInput = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeInValue}-input`
  );

  const tradeInValuation = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeInValuation}`
  );
  const tradeInValuationInput = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeInValuation}-input`
  );

  const tradeInOriginalBPM = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeInOriginalBPM}`
  );
  const tradeInOriginalBPMInput = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeInOriginalBPM}-input`
  );

  const tradeInResidualBPM = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeInResidualBPM}`
  );
  const tradeInResidualBPMInput = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeInResidualBPM}-input`
  );

  const tradeInDate = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeInDate}`
  );
  const tradeInDatePickerInput = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeInDate}${datePickerComponentTestIds.datePickerInput}`
  );

  const tradeInInto = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeInInto}`
  );
  const tradeInIntoInput = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeInInto}-input`
  );

  const tradeInMarginOrVat = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeInMargin}`
  );
  const tradeInMarginOrVatInput = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeInMargin}-input`
  );

  const tradeInCancelBtn = await page.getByTestId(
    `${firstGroupName}${proposalTestIds.tradeInSaveBtn}-cancel-btn`
  );

  await expect(tradeInFindVehicle).toBeTruthy();
  await expect(tradeInFindVehicle).not.toBeDisabled();
  await expect(tradeInFindVehicle).toHaveText(
    en.quotations.lineGroups.tradeIn.uploadPhotos
  );

  checkFieldExistWithLabel({
    parentElement: tradeInVehicleDescription,
    inputElement: tradeInVehicleDescriptionInput,
    label: en.quotations.lineGroups.tradeIn.brandModelDescription,
    expectFieldToBeDisabled: false,
    expectFieldToBeMandatory: true,
  });

  checkFieldExistWithLabel({
    parentElement: tradeInVehicleLicensePlate,
    inputElement: tradeInVehicleLicensePlateInput,
    label: en.quotations.lineGroups.tradeIn.licensePlate,
    expectFieldToBeDisabled: false,
    expectFieldToBeMandatory: false,
  });

  checkFieldExistWithLabel({
    parentElement: tradeInVehicleMileage,
    inputElement: tradeInVehicleMileageInput,
    label: en.quotations.lineGroups.tradeIn.mileage,
    expectFieldToBeDisabled: false,
    expectFieldToBeMandatory: true,
  });

  checkFieldExistWithLabel({
    parentElement: tradeInVin,
    inputElement: tradeInVinInput,
    label: en.quotations.lineGroups.tradeIn.vin,
    expectFieldToBeDisabled: false,
    expectFieldToBeMandatory: false,
  });

  checkFieldExistWithLabel({
    parentElement: tradeInOrderId,
    inputElement: tradeInOrderIdInput,
    label: en.quotations.lineGroups.tradeIn.orderId,
    expectFieldToBeDisabled: false,
    expectFieldToBeMandatory: false,
  });

  checkFieldExistWithLabel({
    parentElement: tradeInColor,
    inputElement: tradeInColorInput,
    label: en.quotations.lineGroups.tradeIn.orderId,
    expectFieldToBeDisabled: false,
    expectFieldToBeMandatory: true,
  });

  checkFieldExistWithLabel({
    parentElement: tradeRegistrationDate,
    inputElement: tradeRegistrationDatePickerInput,
    label: en.quotations.lineGroups.tradeIn.registrationDate,
    expectFieldToBeDisabled: false,
    expectFieldToBeMandatory: true,
  });

  checkFieldExistWithLabel({
    parentElement: tradeInValue,
    inputElement: tradeInValueInput,
    label: en.quotations.lineGroups.tradeIn.tradeInValue,
    expectFieldToBeDisabled: false,
    expectFieldToBeMandatory: true,
  });

  checkFieldExistWithLabel({
    parentElement: tradeInValuation,
    inputElement: tradeInValuationInput,
    label: en.quotations.lineGroups.tradeIn.valuation,
    expectFieldToBeDisabled: false,
    expectFieldToBeMandatory: false,
  });

  checkFieldExistWithLabel({
    parentElement: tradeInOriginalBPM,
    inputElement: tradeInOriginalBPMInput,
    label: en.quotations.lineGroups.tradeIn.originalBPM,
    expectFieldToBeDisabled: false,
    expectFieldToBeMandatory: false,
  });

  checkFieldExistWithLabel({
    parentElement: tradeInResidualBPM,
    inputElement: tradeInResidualBPMInput,
    label: en.quotations.lineGroups.tradeIn.residualBPM,
    expectFieldToBeDisabled: false,
    expectFieldToBeMandatory: false,
  });

  checkFieldExistWithLabel({
    parentElement: tradeInDate,
    inputElement: tradeInDatePickerInput,
    label: en.quotations.lineGroups.tradeIn.tradeInDate,
    expectFieldToBeDisabled: false,
    expectFieldToBeMandatory: false,
  });

  await expect(tradeInInto).toBeTruthy();
  await tradeInInto.click();
  TradeInToOptionsList.forEach(async (vatTypeItem: string) => {
    await expect(
      page.getByTestId(
        `${firstGroupName}${proposalTestIds.tradeInInto}-${vatTypeItem}`
      )
    ).toBeTruthy();
  });
  await expect(tradeInIntoInput).not.toBeDisabled();

  const menuButton = await page.$('#menu-');
  await expect(menuButton).toBeTruthy();
  if (menuButton !== null) {
    await menuButton.click();
  }
  await expect(tradeInMarginOrVat).toBeTruthy();
  await tradeInMarginOrVat.click();
  MarginOptionsList.forEach(async (vatTypeItem: string) => {
    await expect(
      page.getByTestId(
        `${firstGroupName}${proposalTestIds.tradeInInto}-${vatTypeItem}`
      )
    ).toBeTruthy();
  });
  await expect(tradeInMarginOrVatInput).not.toBeDisabled();
  const menuButtonOfMargin = await page.$('#menu-');
  await expect(menuButton).toBeTruthy();
  if (menuButtonOfMargin && menuButtonOfMargin !== null) {
    await menuButtonOfMargin.click();
  }
  await tradeInCancelBtn.click();

  // TODO: Checking all fields are rendered properly for finance form

  // Checking all fields are rendered properly for discount form
  const totalExclVatField = await page.getByTestId(
    proposalTestIds.totalAfterDiscountExclVat
  );
  const totalExclVatFieldInput = await page.getByTestId(
    `${proposalTestIds.totalAfterDiscountExclVat}-input`
  );

  const totalInclVatField = await page.getByTestId(
    proposalTestIds.totalAfterDiscountInclVat
  );
  const totalInclVatFieldInput = await page.getByTestId(
    `${proposalTestIds.totalAfterDiscountInclVat}-input`
  );

  const noDiscountTotalExclVatField = await page.getByTestId(
    proposalTestIds.noDiscountTotalExclVat
  );
  const noDiscountTotalExclVatFieldInput = await page.getByTestId(
    `${proposalTestIds.noDiscountTotalExclVat}-input`
  );

  const noDiscountTotalInclVatField = await page.getByTestId(
    proposalTestIds.noDiscountTotalInclVat
  );
  const noDiscountTotalInclVatFieldInput = await page.getByTestId(
    `${proposalTestIds.noDiscountTotalInclVat}-input`
  );

  checkFieldExistWithLabel({
    expectFieldToBeDisabled: false,
    expectFieldToBeMandatory: false,
    parentElement: totalExclVatField,
    label: en.quotations.totalExclVAT,
    inputElement: totalExclVatFieldInput,
  });

  checkFieldExistWithLabel({
    expectFieldToBeDisabled: false,
    expectFieldToBeMandatory: false,
    parentElement: totalInclVatField,
    label: en.quotations.totalInclVAT,
    inputElement: totalInclVatFieldInput,
  });

  checkFieldExistWithLabel({
    expectFieldToBeDisabled: false,
    expectFieldToBeMandatory: false,
    label: en.quotations.noDiscountExclVAT,
    parentElement: noDiscountTotalExclVatField,
    inputElement: noDiscountTotalExclVatFieldInput,
  });

  checkFieldExistWithLabel({
    expectFieldToBeDisabled: false,
    expectFieldToBeMandatory: false,
    label: en.quotations.noDiscountInclVAT,
    parentElement: noDiscountTotalInclVatField,
    inputElement: noDiscountTotalInclVatFieldInput,
  });

  // Financial summary section
  const allPriceDropDown = await page.getByTestId(
    `${proposalTestIds.financialSummary}${proposalTestIds.quotationVATType}`
  );
  const finSummaryTotalExclVat = await page.getByTestId(
    `${proposalTestIds.financialSummary}${proposalTestIds.quotationTotalExclVatText}`
  );
  const finSummaryTotalExclVatValue = await page.getByTestId(
    `${proposalTestIds.financialSummary}${proposalTestIds.quotationTotalExclVatValue}`
  );

  const finSummaryTotalInclVat = await page.getByTestId(
    `${proposalTestIds.financialSummary}${proposalTestIds.quotationTotalInclVatText}`
  );
  const finSummaryTotalInclVatValue = await page.getByTestId(
    `${proposalTestIds.financialSummary}${proposalTestIds.quotationTotalInclVatValue}`
  );

  const finSummaryVatPercentage = await page.getByTestId(
    `${proposalTestIds.financialSummary}${proposalTestIds.quotationVatPercentageText}`
  );
  const finSummaryVatPercentageValue = await page.getByTestId(
    `${proposalTestIds.financialSummary}${proposalTestIds.quotationVatPercentageValue}`
  );

  await expect(allPriceDropDown).toBeTruthy();
  await allPriceDropDown.click();
  vatType.forEach(async (vatTypeItem: string) => {
    await expect(
      page.getByTestId(`${proposalTestIds.financialSummary}-${vatTypeItem}`)
    ).toBeTruthy();
  });

  await page
    .getByTestId(`${proposalTestIds.financialSummary}-${vatType[1]}`)
    .click();

  await expect(finSummaryTotalExclVat).toBeTruthy();
  await expect(finSummaryTotalExclVat).toHaveText(en.quotations.totalExclVAT);
  await expect(finSummaryTotalExclVatValue).toHaveText('€ 0,00');

  await expect(finSummaryTotalInclVat).toBeTruthy();
  await expect(finSummaryTotalInclVat).toHaveText(en.quotations.totalInclVAT);
  await expect(finSummaryTotalInclVatValue).toHaveText('€ 0,00');

  await expect(finSummaryVatPercentage).toBeTruthy();
  await expect(finSummaryVatPercentage).toHaveText('21% VAT');
  await expect(finSummaryVatPercentageValue).toHaveText('€ 0,00');

  await expect(`${proposalTestIds.createQuotationBtn}-save-btn`).toBeTruthy();
};

export const navigateToOpportunityDetails = async (
  page: Page,
  newOpportunityTestInputData: OpportunityInputDataProps
) => {
  await page.goto(
    `${routes.opportunity.opportunities}?name=${newOpportunityTestInputData.name.replaceAll(' ', '+')}&offset=0`
  );
  expect(page.getByTestId('table-column-0')).not.toHaveCount(0);

  const opportunityItem = await page
    .getByText(newOpportunityTestInputData.name)
    .first();

  await opportunityItem.waitFor({ state: 'attached' });
  await opportunityItem.click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(routeRegex.opportunity.opportunitiesDetails);
};

export const navigateToQuotationEdit = async ({
  page,
  quotationId,
  opportunityId,
  newQuotationName,
}: {
  page: Page;
  quotationId?: string;
  opportunityId?: string;
  newQuotationName: string;
}) => {
  if (quotationId !== '' && opportunityId !== '') {
    await expect(async () => {
      await page.goto(
        `quotations/${quotationId}/edit?opportunityId=${opportunityId}`
      );
    }).toPass();
  } else {
    const quotationEllipsisMenuIcon = await page.getByTestId(
      `${newQuotationName}${proposalTestIds.ellipsisMenuIcon}`
    );
    await expect(async () => {
      expect(quotationEllipsisMenuIcon).toBeVisible();
      await quotationEllipsisMenuIcon.click();
    }).toPass();

    const editQuotationMenuItem = await page.getByTestId(
      proposalTestIds.ellipsisMenuItemEditQuotation
    );

    await editQuotationMenuItem.click();
  }
};

export const setupBasicsForEmptyQuoteCreation = async (
  page: Page,
  newQuotationTestInputData: QuotationCreateRequest,
  vatType: QuotationVATTypeEnum[]
) => {
  await page.waitForLoadState('networkidle');

  const addQuotationBtn = await page.getByTestId(
    opportunityTestIds.addQuotationButton
  );

  await expect(addQuotationBtn).toBeTruthy();
  await addQuotationBtn.click();

  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(routeRegex.quotation.quotationsNew);
  const formattedQuotationDate = formatDateToDayJs(
    newQuotationTestInputData.quotationDate
  );
  const formattedQuotationValidUntil = formatDateToDayJs(
    newQuotationTestInputData.quotationValidUntil
  );

  await page
    .getByTestId(proposalTestIds.quotationDatePickerInput)
    .fill(formattedQuotationDate);
  await page
    .getByTestId(proposalTestIds.quotationValidUntilPickerInput)
    .fill(formattedQuotationValidUntil);

  const vatTypeDropDown = await page.getByTestId(
    `${proposalTestIds.financialSummaryInDetails}${proposalTestIds.quotationVATType}`
  );

  await vatTypeDropDown.click();

  vatType.forEach(async (vatTypeItem: string) => {
    await expect(
      page.getByTestId(
        `${proposalTestIds.financialSummaryInDetails}-${vatTypeItem}`
      )
    ).toBeTruthy();
  });

  await page
    .getByTestId(`${proposalTestIds.financialSummaryInDetails}-${vatType[0]}`)
    .click();
};

export const createNewEmptyQuotation = async (
  page: Page,
  newOpportunityTestInputData: OpportunityInputDataProps,
  newQuotationTestInputData: QuotationCreateRequest,
  needNavToOpportunityDetailsPage: boolean = true
) => {
  const vatType = Object.values(QuotationVATTypeEnum);
  if (needNavToOpportunityDetailsPage)
    await navigateToOpportunityDetails(page, newOpportunityTestInputData);

  await setupBasicsForEmptyQuoteCreation(
    page,
    newQuotationTestInputData,
    vatType
  );

  const createQuotationBtn = await page.getByTestId(
    `${proposalTestIds.createQuotationBtn}-save-btn`
  );

  await createQuotationBtn.click();
  const createdProposalId = await page
    .getByTestId(proposalTestIds.proposalSuccessToast)
    .getAttribute('id');

  return createdProposalId || '';
};

export const addPurchaseVehicle = async ({
  page,
  groupName = tenantGroupIdMap[0],
}: {
  page: Page;
  groupName?: string;
}) => {
  const tenantGroup = await page.getByTestId(
    `${groupName}${proposalTestIds.addLineItem}`
  );
  await expect(tenantGroup).toBeTruthy();
  await tenantGroup.click();
  for (let i = 0; i < lineGroupMenuItems.length; i += 1) {
    const lineGroupItem = lineGroupMenuItems[i];
    expect(page.getByTestId(lineGroupItem)).toBeTruthy();
  }
  await page.getByTestId(proposalTestIds.addPurchaseVehicle).click();
  const findVehicleField = await page.getByTestId(
    `${groupName}${proposalTestIds.findVehicleField}`
  );

  await expect(findVehicleField).toBeVisible();
  await expect(findVehicleField).toBeTruthy();
  await findVehicleField.click();
  await page.waitForLoadState('networkidle');
  await page.waitForURL(routeRegex.vehicles.vehicles);
  await expect(page).toHaveURL(routeRegex.vehicles.vehicles);
  const vehicleListItem = await page.getByTestId(
    carStockListTestIds.carStockListItem
  );
  await expect(vehicleListItem).not.toHaveCount(0);
  const firstVehicle = vehicleListItem.first();
  const vehicleName = await firstVehicle
    .getByTestId(carStockListTestIds.vehicleDescription)
    .allInnerTexts();
  const vehicleSelectButton = firstVehicle.getByTestId(
    carStockListTestIds.selectVehicleButton
  );
  await expect(vehicleSelectButton).toBeTruthy();
  await vehicleSelectButton.click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(routeRegex.quotation.anyQuotation);
  const purchaseVehicle = await page.getByTestId(
    `${groupName}-${removeSpaceFromString(vehicleName[0])}-name`
  );
  await expect(purchaseVehicle).toBeTruthy();
  await expect(purchaseVehicle).toHaveText(vehicleName[0]);
  return vehicleName[0];
};

export const createNewQuotationWithPurchaseVehicle = async (
  page: Page,
  newQuotationTestInputData: QuotationCreateRequest
) => {
  const vatType = Object.values(QuotationVATTypeEnum);
  await setupBasicsForEmptyQuoteCreation(
    page,
    newQuotationTestInputData,
    vatType
  );
  await addPurchaseVehicle({ page });

  const createQuotationBtn = await page.getByTestId(
    `${proposalTestIds.createQuotationBtn}-save-btn`
  );
  await expect(createQuotationBtn).toBeTruthy();

  await createQuotationBtn.click();
  const createdProposalId = await page
    .getByTestId(proposalTestIds.proposalSuccessToast)
    .getAttribute('id');

  return createdProposalId || '';
};

export const deleteLineItemGroup = async ({
  page,
  groupName = tenantGroupIdMap[0],
  itemName,
}: {
  page: Page;
  groupName?: string;
  itemName: string;
}) => {
  const deleteElement = await page.getByTestId(
    `${groupName}-${removeSpaceFromString(itemName)}`
  );
  await expect(deleteElement).toBeTruthy();
  await expect(async () => {
    await deleteElement
      .getByTestId(`${ellipsisMenuTestIds.ellipsisMenuButton}-icon`)
      .click();
    await page
      .getByTestId(`${proposalTestIds.orderLineItemActionMenuDelete}`)
      .click();
  }).toPass();
};

export const checkProductFormFilledCorrectly = async ({
  page,
  productName,
  productValues,
  groupName = tenantGroupIdMap[0],
}: {
  page: Page;
  groupName?: string;
  productName: string;
  productValues: ProductEditDataType;
}) => {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('load');
  await page.waitForLoadState('domcontentloaded');

  const productNameWithoutSpace = removeSpaceFromString(productName);
  await page
    .getByTestId(`${groupName}-${productNameWithoutSpace}`)
    .getByTestId(`${ellipsisMenuTestIds.ellipsisMenuButton}-icon`)
    .click();

  await page
    .getByTestId(`${proposalTestIds.orderLineItemActionMenuEdit}`)
    .click();

  if (productValues.name) {
    const productFormName = await page.getByTestId(
      `${groupName}${removeSpaceFromString(proposalTestIds.productName)}-input`
    );
    await expect(productFormName).toHaveAttribute('value', productValues.name);
  }

  if (productValues.quantity) {
    const productQuantity = await page.getByTestId(
      `${groupName}${proposalTestIds.productQuantity}`
    );
    const inputOfProductQuantity = productQuantity.locator('input').first();
    await expect(inputOfProductQuantity).toHaveAttribute(
      'value',
      productValues.quantity.toString()
    );
  }

  if (productValues.unitPrice) {
    const productFormAmount = await page.getByTestId(
      `${groupName}${proposalTestIds.productUnitPriceExclVat}`
    );
    const inputOfProductFormAmount = productFormAmount.locator('input').first();
    await expect(inputOfProductFormAmount).toHaveAttribute(
      'value',
      formatAmount(productValues.unitPrice)
    );
  }
  await page
    .getByTestId(`${proposalTestIds.addProductSubmitBtn}-cancel-btn`)
    .click();
};

export const checkFinanceFormFilledCorrectly = async ({
  page,
  financeData,
  groupName = tenantGroupIdMap[0],
}: {
  page: Page;
  groupName?: string;
  financeData: FinanceEditDataType;
}) => {
  const financeType = financeData.type;

  await page
    .getByTestId(`${groupName}-${financeTypeMapper[financeType]}`)
    .getByTestId(`${ellipsisMenuTestIds.ellipsisMenuButton}-icon`)
    .click();

  await page
    .getByTestId(`${proposalTestIds.orderLineItemActionMenuEdit}`)
    .click();

  if (financeData.durationInMonths) {
    const durationInMonths = await page.getByTestId(
      `${groupName}${proposalTestIds.financeDurationMonths}`
    );
    await expect(durationInMonths).toBeTruthy();
    const inputOfDurationInMonths = await durationInMonths
      .locator('input')
      .first();
    await expect(inputOfDurationInMonths).toHaveAttribute(
      'value',
      `${formatAmount(financeData.durationInMonths)}`
    );
  }

  if (financeData.downPayment) {
    const downPayment = await page.getByTestId(
      `${groupName}${proposalTestIds.financeDownPayment}`
    );
    await expect(downPayment).toBeTruthy();
    const inputOfDownPayment = await downPayment.locator('input').first();
    await expect(inputOfDownPayment).toHaveAttribute(
      'value',
      `${formatAmount(financeData.downPayment)}`
    );
  }

  if (financeData.annualInterestRate) {
    const annualInterestRate = await page.getByTestId(
      `${groupName}${proposalTestIds.financeAnnualInterestRate}`
    );
    await expect(annualInterestRate).toBeTruthy();
    const inputOfAnnualInterestRate = await annualInterestRate
      .locator('input')
      .first();
    await expect(inputOfAnnualInterestRate).toHaveAttribute(
      'value',
      `${formatAmount(financeData.annualInterestRate)}`
    );
  }

  const finalTerm = await page.getByTestId(
    `${groupName}${proposalTestIds.financeFinalTerm}`
  );
  if (financeData.finalTerm) {
    await expect(finalTerm).toBeTruthy();
    const inputOfFinalTerm = await finalTerm.locator('input').first();
    await expect(inputOfFinalTerm).toHaveAttribute(
      'value',
      `${formatAmount(financeData.finalTerm)}`
    );
  }
  page.getByTestId(`${proposalTestIds.addFinanceSubmitBtn}-cancel-btn`).click();
};

export const checkPurchaseFormFilledCorrectly = async ({
  page,
  purchaseVehicleName,
  purchaseVehicleData,
  groupName = tenantGroupIdMap[0],
}: {
  page: Page;
  groupName?: string;
  purchaseVehicleName: string;
  purchaseVehicleData: PurchaseVehicleEditDataType;
}) => {
  const nameWithoutSpace = removeSpaceFromString(purchaseVehicleName);
  await page
    .getByTestId(`${groupName}-${nameWithoutSpace}`)
    .getByTestId(`${ellipsisMenuTestIds.ellipsisMenuButton}-icon`)
    .click();
  await page
    .getByTestId(`${proposalTestIds.orderLineItemActionMenuEdit}`)
    .click();

  const vehicleDescriptionField = await page.getByTestId(
    `${groupName}${proposalTestIds.purchaseVehicleDescription}-input`
  );

  const vehiclePriceExclVatField = await page.getByTestId(
    `${groupName}${proposalTestIds.purchaseVehicleVehiclePriceExclVat}-input`
  );

  const vehicleBpmField = await page.getByTestId(
    `${groupName}${proposalTestIds.purchaseVehicleBpm}-input`
  );

  const vehicleDriverNameField = await page.getByTestId(
    `${groupName}${proposalTestIds.purchaseVehicleDriverName}-input`
  );

  const vehicleLicenseDateField = await page.getByTestId(
    `${groupName}${proposalTestIds.purchaseVehicleLicenseDate}${datePickerComponentTestIds.datePickerInput}`
  );

  const vehicleDeliveryDateField = await page.getByTestId(
    `${groupName}${proposalTestIds.purchaseVehicleDeliveryDate}${datePickerComponentTestIds.datePickerInput}`
  );

  await expect(vehicleDescriptionField).not.toBeEmpty();
  await expect(vehiclePriceExclVatField).not.toBeEmpty();
  await expect(vehicleBpmField).not.toBeEmpty();

  if (purchaseVehicleData.vehicleDescription) {
    await expect(vehicleDescriptionField).toHaveValue(
      purchaseVehicleData.vehicleDescription
    );
  }

  if (purchaseVehicleData.driverName) {
    await expect(vehicleDriverNameField).toHaveValue(
      purchaseVehicleData.driverName
    );
  }

  if (purchaseVehicleData.licenseDate) {
    await expect(vehicleLicenseDateField).toHaveAttribute(
      'value',
      convertDateFormatToDDMMYYYY(purchaseVehicleData.licenseDate)
    );
  }

  if (purchaseVehicleData.deliveryDate) {
    await expect(vehicleDeliveryDateField).toHaveAttribute(
      'value',
      convertDateFormatToDDMMYYYY(purchaseVehicleData.deliveryDate)
    );
  }

  await page
    .getByTestId(`${proposalTestIds.addPurchaseVehicleSubmitBtn}-cancel-btn`)
    .click();
};

export const checkTradeInFormFilledCorrectly = async ({
  page,
  tradeInVehicleData,
  tradeInVehicleName,
  groupName = tenantGroupIdMap[0],
}: {
  page: Page;
  tradeInVehicleData: TradeInVehicleEditDataType;
  tradeInVehicleName: string;
  groupName?: string;
}) => {
  await page
    .getByTestId(`${groupName}-${tradeInVehicleName}`)
    .getByTestId(`${ellipsisMenuTestIds.ellipsisMenuButton}-icon`)
    .click();
  await page
    .getByTestId(`${proposalTestIds.orderLineItemActionMenuEdit}`)
    .click();

  const tradeInVehicleDescriptionInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInBrandModelDescription}-input`
  );
  const tradeInVehicleLicensePlateInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInLicensePlate}-input`
  );
  const tradeInVehicleMileageInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInMileage}-input`
  );
  const tradeInVinInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInVin}-input`
  );
  const tradeInOrderIdInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInOrderId}-input`
  );
  const tradeInColorInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInColor}-input`
  );
  const registrationDatePickerInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeRegistrationDate}${datePickerComponentTestIds.datePickerInput}`
  );
  const tradeInValueInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInValue}-input`
  );
  const tradeInValuationInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInValuation}-input`
  );
  const tradeInOriginalBPMInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInOriginalBPM}-input`
  );
  const tradeInResidualBPMInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInResidualBPM}-input`
  );
  const tradeInDatePickerInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInDate}${datePickerComponentTestIds.datePickerInput}`
  );

  const tradeInIntoInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInInto}-input`
  );
  const tradeInMarginOrVatInput = await page.getByTestId(
    `${groupName}${proposalTestIds.tradeInMargin}-input`
  );

  if (tradeInVehicleData.description) {
    await expect(tradeInVehicleDescriptionInput).toHaveValue(
      tradeInVehicleData.description
    );
  }

  if (tradeInVehicleData.licensePlate) {
    await expect(tradeInVehicleLicensePlateInput).toHaveValue(
      tradeInVehicleData.licensePlate
    );
  }

  if (tradeInVehicleData.mileage) {
    await expect(tradeInVehicleMileageInput).toHaveValue(
      formatAmountAfterRounding({ value: tradeInVehicleData.mileage })
    );
  }

  if (tradeInVehicleData.vin) {
    await expect(tradeInVinInput).toHaveValue(tradeInVehicleData.vin);
  }

  if (tradeInVehicleData.orderId) {
    await expect(tradeInOrderIdInput).toHaveValue(tradeInVehicleData.orderId);
  }

  if (tradeInVehicleData.color) {
    await expect(tradeInColorInput).toHaveValue(tradeInVehicleData.color);
  }

  if (tradeInVehicleData.registrationDate) {
    await expect(registrationDatePickerInput).toHaveValue(
      convertDateFormatToDDMMYYYY(tradeInVehicleData.registrationDate)
    );
  }

  if (tradeInVehicleData.tradeInValue) {
    await expect(tradeInValueInput).toHaveValue(
      formatAmountAfterRounding({ value: tradeInVehicleData.tradeInValue })
    );
  }

  if (tradeInVehicleData.valuation) {
    await expect(tradeInValuationInput).toHaveValue(
      formatAmountAfterRounding({ value: tradeInVehicleData.valuation })
    );
  }

  if (tradeInVehicleData.originalBPM) {
    const formattedOriginalBpm = formatAmountAfterRounding({
      value: tradeInVehicleData.originalBPM,
    });
    await expect(tradeInOriginalBPMInput).toHaveValue(formattedOriginalBpm);
  }

  if (tradeInVehicleData.residualBPM) {
    await expect(tradeInResidualBPMInput).toHaveValue(
      formatAmountAfterRounding({ value: tradeInVehicleData.residualBPM })
    );
  }

  if (tradeInVehicleData.tradeInDate) {
    await expect(tradeInDatePickerInput).toHaveValue(
      convertDateFormatToDDMMYYYY(tradeInVehicleData.tradeInDate)
    );
  }

  if (tradeInVehicleData.tradeInTo) {
    await expect(tradeInIntoInput).toHaveValue(tradeInVehicleData.tradeInTo);
  }

  if (tradeInVehicleData.margin) {
    await expect(tradeInMarginOrVatInput).toHaveValue(
      tradeInVehicleData.margin
    );
  }
  const cancelBtn = await page.getByTestId(
    `${proposalTestIds.addTradeInSubmitBtn}-cancel-btn`
  );
  await cancelBtn.click();
};

export const deleteQuotation = async ({
  page,
  quotationName,
}: {
  page: Page;
  quotationName: string;
}) => {
  await page
    .getByTestId(opportunityTestIds.addQuotationButton)
    .waitFor({ state: 'attached' });

  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(routeRegex.opportunity.opportunitiesDetails);

  const quotation = await page.getByTestId(quotationName);

  const quotationEllipsisMenuIcon = await quotation.getByTestId(
    `${quotationName}${proposalTestIds.ellipsisMenuIcon}`
  );

  await expect(quotationEllipsisMenuIcon).toBeTruthy();

  await expect(async () => {
    await quotationEllipsisMenuIcon.first().click();
  }).toPass();

  const quotationEllipsisMenu = await page.getByTestId(
    ellipsisMenuTestIds.ellipsisMenu
  );

  const menuItems = await quotationEllipsisMenu.locator('li');
  const menuItemCount = await menuItems.count();
  if (menuItemCount === 0) {
    await quotationEllipsisMenuIcon.first().click();
  }

  await expect(async () => {
    await page
      .getByTestId(proposalTestIds.ellipsisMenuItemDeleteQuotation)
      .click();
  }).toPass();

  await page.getByTestId(generalTestIds.customModalSubmit).click();
};
