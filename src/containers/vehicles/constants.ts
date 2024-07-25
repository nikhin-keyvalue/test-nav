import { definitions, paths } from '@generated/metafactory-service-types';
import dayjs, { Dayjs } from 'dayjs';

import { getTraceId } from '@/utils/common';

import {
  CreateQuotationFormSchema,
  LineGroupItemPurchase,
} from '../quotations/api/type';
import { Image, StockListItem } from './components/types';

const ParamOptionMap = {
  carStockDiscountOriginList: 'carStockDiscountOrigins',
  carStockOriginList: 'carStockOrigins',
  financialOwnerIdList: 'financialOwners',
  pipelineStatusList: 'pipelineStatuses',
  preferredDiscountSourceList: 'preferredDiscountSources',
  preferredPriceSourceList: 'preferredPriceSources',
  priceStatusList: 'priceStatuses',
  publishSourceList: 'publishSources',
  sellerIdList: 'sellers',
  sellingStatusList: 'sellingStatuses',
  stockStatusList: 'stockStatuses',
  typeList: 'types',
  vehicleBodyTypeList: 'vehicleBodyTypes',
  vehicleBrandIdList: 'vehicleBrands',
  vehicleColorList: 'vehicleColors',
  vehicleFuelTypeList: 'fuelTypes',
  vehicleTransmissionList: 'vehicleTransmissions',
} as const;

const SORT_OPTIONS = [
  'publishDate',
  'vehicle.licensePlate',
  'vehicle.chassis',
  'effectiveSellingPrice',
  'seller',
  'estimatedDeliveryDate',
  'sellingStatus',
] as const;

type SortOptions = (typeof SORT_OPTIONS)[number];

type SortFilter = `${SortOptions},${'asc' | 'desc'}`;

type RawFiltersData =
  paths['/api/carstock/filters']['get']['responses']['200']['schema'];

type PaginationFields = 'size' | 'page';

type SingleSelectionFields = 'searchTerm' | 'sort' | 'publish';

type GroupedFiltersKeys = 'locationIdList' | 'vehicleModelIdList';

type FiltersDataKeys = keyof typeof ParamOptionMap | GroupedFiltersKeys;

type SearchParamKeys =
  | FiltersDataKeys
  | SingleSelectionFields
  | PaginationFields
  | GroupedFiltersKeys;

type SearchParams = Record<SearchParamKeys, string> & {
  sort: SortFilter;
};

type MultiSelectFiltersState = Record<FiltersDataKeys, Array<string>>;

const ALLOWED_PARAMS = [
  'size',
  'page',
  'searchTerm',
  'sort',
  'publish',
  'carStockDiscountOriginList',
  'carStockOriginList',
  'financialOwnerIdList',
  'locationIdList',
  'pipelineStatusList',
  'preferredDiscountSourceList',
  'preferredPriceSourceList',
  'priceStatusList',
  'publishSourceList',
  'sellerIdList',
  'sellingStatusList',
  'stockStatusList',
  'typeList',
  'vehicleBodyTypeList',
  'vehicleBrandIdList',
  'vehicleColorList',
  'vehicleFuelTypeList',
  'vehicleModelIdList',
  'vehicleTransmissionList',
] as const;

export enum PARAM_VALUES {
  ALL = 'ALL',
}

const DEFAULT_LIST_QUERY_PARAMS = {
  page: 0,
  size: 10,
  sort: `${SORT_OPTIONS[0]},desc` as const,
};

type SelectableDto = definitions['SelectableDto'];
export interface GroupedData extends SelectableDto {
  list?: Array<SelectableDto> | undefined;
}

type ElementType<T> = T extends Array<infer U> ? U : never;

interface FilterWithLabel<T> {
  displayValue: string;
  id: ElementType<T>;
}

export interface FiltersData
  extends Omit<
    RawFiltersData,
    'sellers' | 'vehicleBrands' | 'vehicleBodyTypes'
  > {
  sellers?: Array<GroupedData>;
  vehicleBrands?: Array<GroupedData>;
  vehicleBodyTypes: Array<FilterWithLabel<RawFiltersData['vehicleBodyTypes']>>;
}

export type GroupListItem = {
  id?: string;
  displayValue?: string;
  parentId?: string;
  parentDisplayValue?: string;
};

const tNamespaceMap = {
  // Some values are empty because the primary translation sources for those are from stock.filterOptions itself
  carStockDiscountOriginList: 'stock.filterOptions.carStockDiscountOriginList',
  carStockOriginList: 'stock.filterOptions.carStockOriginList',
  pipelineStatusList: 'stockDetails.status',
  preferredDiscountSourceList:
    'stock.filterOptions.preferredDiscountSourceList',
  preferredPriceSourceList: 'stock.filterOptions.preferredPriceSourceList',
  priceStatusList: 'stock.filterOptions.priceStatusList',
  publishSourceList: 'stockDetails.status',
  sellingStatusList: 'stockDetails.status',
  stockStatusList: 'stockDetails.status',
  typeList: 'stockDetails.status',
  vehicleBodyTypeList: '',
  vehicleColorList: 'stock.filterOptions.vehicleColorList',
  vehicleFuelTypeList: 'stock.filters',
  vehicleTransmissionList: 'stock.filters',
  // IdLists does not need translations. Added to satisfy types
  locationIdList: '',
  financialOwnerIdList: '',
  sellerIdList: '',
  vehicleBrandIdList: '',
  vehicleModelIdList: '',
};

export type {
  SortFilter,
  SortOptions,
  RawFiltersData,
  PaginationFields,
  SingleSelectionFields,
  GroupedFiltersKeys,
  FiltersDataKeys,
  SearchParamKeys,
  SearchParams,
  MultiSelectFiltersState,
};

export {
  SORT_OPTIONS,
  ParamOptionMap,
  ALLOWED_PARAMS,
  DEFAULT_LIST_QUERY_PARAMS,
  tNamespaceMap,
};

const QUOTATION_DETAILS = 'QUOTATION_DETAILS';

interface ILocalQuotationDetails {
  formData: CreateQuotationFormSchema;
  redirectUrl: string;
  vehicleSelected?: boolean;
  setExpiry?: boolean;
  selectedVehicle?: StockListItem & { imageArray: Image[] };
}

export const getLocalQuotationDetails = () => {
  if (typeof window === 'undefined')
    return {} as ILocalQuotationDetails & { expiry: Dayjs };

  try {
    const quotationDetails: ILocalQuotationDetails & { expiry: Dayjs } =
      JSON.parse(localStorage?.getItem(QUOTATION_DETAILS) || '{}');
    return quotationDetails;
  } catch (err) {
    console.log(
      err,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('getLocalQuotationDetailsFunction')
    );
    return {} as ILocalQuotationDetails & { expiry: Dayjs };
  }
};

export const clearLocalQuotationDetails = () =>
  localStorage.removeItem(QUOTATION_DETAILS);

export const localToPayloadVehicleDetailsDTO = (
  localStorageData: StockListItem & {
    imageArray: Image[];
    vehiclePrice: number;
  }
): LineGroupItemPurchase => {
  const {
    id,
    licensePlate,
    imageArray,
    vehicleDescription,
    chassis,
    vehiclePrice,
    specifications,
  } = localStorageData;

  return {
    ...specifications,
    name: vehicleDescription as string,
    vin: chassis,
    licensePlate,
    imageUrls: (imageArray || []).map((item) => item.url),
    vehiclePrice,
    // TODO : Change the sellingPrice field after Metafactory API change IMP
    driver: '',
    BPM: 0,
    description: vehicleDescription,
    carstockId: `${id}`,
    id: `${id}`,
    bodyType: specifications?.fuelType,
    brandDescription: specifications?.brandDescription?.[0]?.value,
    co2: specifications?.co2,
    energyLabel: specifications?.energyLabel,
    engineName: specifications?.engineName?.[0]?.value,
    enginePerformance: specifications?.enginePerformance,
    exteriorColorCode: specifications?.exteriorColorCode,
    exteriorColorDescription: specifications?.exteriorColorDescription,
    fuelType: specifications?.fuelType,
    gradeName: specifications?.gradeName?.[0]?.value,
    interiorColorCode: specifications?.interiorColorCode,
    interiorColorDescription: specifications?.interiorColorDescription,
    powertrainName: specifications?.powertrainName?.[0]?.value,
    totalExclVat: 0, // This is overridden in later stage
    totalInclVat: 0,
    isGeneralDiscount: false,
    transmission: specifications?.transmission,
    modelDescription: specifications?.modelDescription?.[0]?.value,
  };
};

export const setQuotationDetailsInLocalStorage = ({
  formData,
  redirectUrl,
  vehicleSelected = false,
  setExpiry = false,
}: ILocalQuotationDetails) => {
  const expiry = dayjs().add(1, 'hour');

  localStorage.setItem(
    QUOTATION_DETAILS,
    JSON.stringify({
      formData,
      redirectUrl,
      vehicleSelected,
      expiry: setExpiry ? expiry : '',
    })
  );
};

export const markVehicleSelectionInLocalStorage = () => {
  const quotationDetails = getLocalQuotationDetails();
  quotationDetails.vehicleSelected = true;
  setQuotationDetailsInLocalStorage(quotationDetails);
};
