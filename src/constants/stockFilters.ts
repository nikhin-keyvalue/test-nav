import { definitions, paths } from '@generated/metafactory-service-types';

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
  'createdOn',
] as const;

type SortOptions = (typeof SORT_OPTIONS)[number];

type SortFilter = `${SortOptions},${'asc' | 'desc'}`;

type RawFiltersData =
  paths['/api/carstock/filters']['get']['responses']['200']['schema'];

type PaginationFields = 'size' | 'page';

export type DateFilters = {
  publishDateFrom?: string;
  publishDateTo?: string;
  depublishDateFrom?: string;
  depublishDateTo?: string;
};

export type DateFiltersKeys = keyof DateFilters;

export const singleSelectionFields = [
  'searchTerm',
  'sort',
  'page',
  'size',
  'publish',
  'publishDateFrom',
  'publishDateTo',
  'depublishDateFrom',
  'depublishDateTo',
] as const;

type SingleSelectionFields = (typeof singleSelectionFields)[number];

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
  'publishDateFrom',
  'publishDateTo',
  'depublishDateFrom',
  'depublishDateTo',
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
  carStockDiscountOriginList: '',
  carStockOriginList: '',
  pipelineStatusList: 'stockDetails.status',
  preferredDiscountSourceList: '',
  preferredPriceSourceList: '',
  priceStatusList: '',
  publishSourceList: 'stockDetails.status',
  sellingStatusList: 'stockDetails.status',
  stockStatusList: 'stockDetails.status',
  typeList: 'stockDetails.status',
  vehicleBodyTypeList: '',
  vehicleColorList: 'colors',
  vehicleFuelTypeList: 'stockDetails.specifications',
  vehicleTransmissionList: 'stockDetails.specifications',
  // IdLists does not need translations. Added to satisfy types
  locationIdList: '',
  financialOwnerIdList: '',
  sellerIdList: '',
  vehicleBrandIdList: '',
  vehicleModelIdList: '',
};

export const searchCriteriaQueryKey = ['searchCriteria'];

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
