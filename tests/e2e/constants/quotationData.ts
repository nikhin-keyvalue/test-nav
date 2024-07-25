import { QuotationCreateRequest } from '@/containers/quotations/api/type';
import {
  FinanceLineGroupItemTypes,
  MarginOptionsList,
} from '@/containers/quotations/constants';

import en from '../../../messages/en.json';
import { FinanceEditDataType, PurchaseVehicleEditDataType } from '../types';
import { OpportunityInputDataProps } from '../utils/opportunities/opportunitiesFormHelpers';
import { proposalTestIds } from './testIds';

export const lineGroupMenuItems = [
  proposalTestIds.addFinance,
  proposalTestIds.addProduct,
  proposalTestIds.addTradeInVehicle,
  proposalTestIds.addPurchaseVehicle,
];

export const editFinanceData: FinanceEditDataType = {
  finalTerm: 270,
  downPayment: 1500,
  durationInMonths: 12,
  type: 'PrivateFinance',
  annualInterestRate: 1.25,
};

export const editPurchaseData: PurchaseVehicleEditDataType = {
  driverName: 'Roy mathew',
  licenseDate: '2022-09-01',
  deliveryDate: '2021-10-12',
  vehicleDescription: 'Editted Volvo EX30 Ultra Single Motor Extended Range',
};

export const editProductData = {
  quantity: 10,
  unitPrice: 300,
  name: 'Maintenance and Service Gold Plan edited',
};

export const editTradeInData = {
  description: 'BMW m3 sport',
  licensePlate: 'T-KJII-SF',
  mileage: 11.52,
  vin: '987654321',
  orderId: '457781168',
  color: 'Black',
  registrationDate: '2024-04-01',
  tradeInValue: 1500.22,
  valuation: 2000.12,
  originalBpm: 5.87,
  residualBpm: 7.33,
  tradeInDate: '2024-06-01',
  tradeInTo: 'Trade',
  margin: MarginOptionsList[1],
};

export const createQuotationData: QuotationCreateRequest = {
  vatType: 'ExclVAT',
  opportunityId: 'string',
  quotationDate: '2024-05-29',
  quotationValidUntil: '2024-05-29',
  lineGroupItems: [
    {
      groupName: 'string',
      finances: [
        {
          finalTerm: 27,
          id: 'L12345a',
          yearlyMileage: 20,
          downPayment: 1000,
          monthlyExclVAT: 16,
          durationInMonths: 36,
          type: 'PrivateFinance',
          annualInterestRate: 10.25,
        },
      ],
      products: [
        {
          quantity: 1,
          id: 'L12345b',
          unitPrice: 289.75,
          totalExclVat: 289.75,
          totalInclVat: 289.75,
          name: 'Maintenance and Service Gold Plan',
          discount: {
            amount: 414.75,
            percentage: 10.25,
            totalDiscount: 1000.25,
            description: 'Valued customer discount',
          },
        },
      ],
      purchases: [
        {
          BPM: 6.567,
          co2: 289.75,
          range: '220',
          id: 'L12345c',
          carstockId: '56',
          driver: 'John Doe',
          fuelType: 'DIESEL',
          vehiclePrice: 45.375,
          gradeName: 'GS Line',
          totalExclVat: 289.75,
          totalInclVat: 289.75,
          bodyType: 'HATCHBACK',
          energyLabel: 'DIESEL',
          numberOfDoors: 'FOUR',
          powertrainName: '2WD',
          vin: 'YTREFGTFRDDFGRE',
          transmission: 'DIESEL',
          enginePerformance: 346,
          exteriorColorCode: 'RG',
          isGeneralDiscount: false,
          licenseDate: '2024-05-29',
          licensePlate: 'NL49H5586',
          interiorColorCode: 'Grey',
          deliveryDate: '2024-07-29',
          modelDescription: 'sample',
          brandDescription: 'Nissan',
          interiorColorDescription: 'Brown',
          engineName: 'Turbo Start/Stop 200',
          exteriorColorDescription: 'Pearl white',
          name: 'Volvo EX30 Ultra Single Motor Extended Range',
          description: 'Volvo EX30 Ultra Single Motor Extended Range',
          discount: {
            amount: 414.75,
            percentage: 10.25,
            totalDiscount: 1000.25,
            description: 'Valued customer discount',
          },
          imageUrls: [
            'https://www.am-i.nl/wp-content/uploads/am-i_logo-long.png',
          ],
        },
      ],
      tradeIns: [
        {
          imageUrls: [
            'https://images.am-i.nl/cic/images/3fa85f64-5717-4562-b3fc-2c963f66afa6',
          ],
          id: 'L12345d',
          colour: 'Black',
          mileage: 120.396,
          valuation: 18.85,
          tradeInTo: 'Sale',
          originalBPM: 6.971,
          residualBPM: 6.971,
          vin: '123456789012',
          tradeInValue: 16.25,
          totalExclVat: 2.853,
          totalInclVat: 2.853,
          orderId: '448956616',
          margin: 'VATVehicle',
          licensePlate: 'T-006-S',
          tradeInDate: '2024-05-29',
          productId: 'Vehicle2345d',
          // licensePlate: 'T-006-SF',
          registrationDate: '2020-08-29',
          description: 'Peugeot 5008 Allure Pack Business PureTech 130',
        },
      ],
    },
  ],
  vat: 100.5,
  totalExclVat: 900.75,
  totalInclVat: 1001.25,
  totalAfterDiscountExclVAT: 700.25,
  totalAfterDiscountInclVAT: 801.25,
};

export const tradeInVatOrMargin = {
  VATVehicle: 'VAT Vehicle',
  VATMarginVehicle: 'Margin Vehicle',
};

export const financeTypeMapper = {
  [FinanceLineGroupItemTypes.PRIVATE_LEASE]: 'Privatelease',
  [FinanceLineGroupItemTypes.PRIVATE_FINANCE]: 'Privatefinance',
  [FinanceLineGroupItemTypes.FINANCIAL_LEASE]: 'Businessfinance',
  [FinanceLineGroupItemTypes.FULL_OPERATIONAL_LEASE]: 'Businesslease',
};

export const lineGroupItemTypes = {
  product: 'product',
  finance: 'finance',
  tradeIn: 'tradeIn',
  purchase: 'purchase',
};

export const createOpportunityInputTestDataForQuotation: OpportunityInputDataProps =
  {
    name: 'DO NOT DELETE end to end test create opportunity for quotation',
    status: 'Interest',
    additionalComments:
      'additional comments: End to end test create opportunity for quotation',
  };

export const quotationDetailsAccordionEllipsisMenuItems = [
  en.common.edit,
  en.quotations.print,
  en.quotations.duplicate,
  en.common.delete,
];
