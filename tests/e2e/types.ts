import { components } from '@generated/crm-service-types';

export type OrganisationInputDataProps = {
  name: string;
  type: string;
  // note: status is active by default in create organisation flow
  email: string;
  status: string;
  website: string;
  VATNumber: string;
  alternateEmail: string;
  address: {
    city: string;
    street: string;
    country: string;
    postalCode: string;
    countryCode: string;
    houseNumber: string;
  };
  kvkData: {
    name: string;
    website: string;
    KvKNumber: string;
    addressString: string;
    address: {
      city: string;
      street: string;
      country: string;
      postalCode: string;
      houseNumber: string;
    };
  };
  opportunitiesAndDeliveries: {
    deliveries: null;
    opportunities: null;
  };
  postCodetestAddress: {
    city: string;
    street: string;
    country: string;
    postalCode: string;
    houseNumber: string;
    postCodeAddressString: string;
  };
  phoneNumberList: {
    phone: string;
    alternatePhoneNumber1: string;
    alternatePhoneNumber2: string;
    alternatePhoneNumber2Text: string;
  };
};

export type FinanceEditDataType = {
  finalTerm?: number;
  downPayment?: number;
  durationInMonths?: number;
  annualInterestRate?: number;
  type: components['schemas']['FinanceType'];
};

export type ProductEditDataType = {
  name?: string;
  quantity?: number;
  unitPrice?: number;
};

export type PurchaseVehicleEditDataType = {
  vehicleDescription?: string;
  driverName?: string;
  licenseDate?: string;
  deliveryDate?: string;
};

export type TradeInVehicleEditDataType = {
  description?: string;
  licensePlate?: string;
  mileage?: number;
  vin?: string;
  orderId?: string;
  color?: string;
  registrationDate?: string;
  tradeInValue?: number;
  valuation?: number;
  originalBPM?: number;
  residualBPM?: number;
  tradeInDate?: string;
  tradeInTo?: components['schemas']['TradeInTo'];
  margin?: components['schemas']['Margin'];
};
