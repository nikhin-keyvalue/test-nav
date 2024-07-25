import { getTranslations } from 'next-intl/server';

import { metaFactoryFetcher } from '@/utils/api';
import { sortString } from '@/utils/sort';

import { FiltersData, RawFiltersData, SearchParams } from '../constants';
import StockListFiltersUI from './StockListFilters.client';
import { StockListData } from './types';

const StockListFilters = async ({
  searchParams,
  data,
}: {
  searchParams: SearchParams;
  data: Promise<StockListData>;
}) => {
  const listData = await data;

  const filterData: RawFiltersData =
    await metaFactoryFetcher(`api/carstock/filters`);

  const t = await getTranslations('stock.filterOptions.vehicleBodyTypeList');

  const formatFiltersData = (filters: RawFiltersData): FiltersData => {
    const { sellers, vehicleBrands, vehicleBodyTypes } = filters;

    const optionsWithLabel = vehicleBodyTypes?.length
      ? vehicleBodyTypes?.map((option) => ({
          displayValue: t(`${option}`),
          id: option,
        }))
      : [];

    const sortedVehicleBodyTypes = optionsWithLabel?.sort((a, b) =>
      sortString(a.displayValue, b.displayValue)
    );

    return {
      ...filterData,
      sellers: sellers?.map(({ id, displayValue, locations }) => ({
        id,
        displayValue,
        list: locations,
      })),
      vehicleBrands: vehicleBrands?.map(
        ({ id, displayValue, vehicleModels }) => ({
          id,
          displayValue,
          list: vehicleModels,
        })
      ),
      vehicleBodyTypes: sortedVehicleBodyTypes,
    };
  };

  const filters = formatFiltersData(filterData);

  return (
    <StockListFiltersUI
      filters={filters}
      params={searchParams}
      listData={listData}
    />
  );
};

export default StockListFilters;
