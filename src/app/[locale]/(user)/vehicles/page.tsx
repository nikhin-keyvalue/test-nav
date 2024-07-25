import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { DetailBlockErrorFallback } from '@/components/blocks/DetailBlock';
import { StockListFiltersLoadingFallback } from '@/containers/vehicles/components/StockListFilters.client';
import StockListFilters from '@/containers/vehicles/components/StockListFilters.server';
import { StockListItemsLoadingFallback } from '@/containers/vehicles/components/StockListItems.client';
import StockListItems from '@/containers/vehicles/components/StockListItems.server';
import { StockListData } from '@/containers/vehicles/components/types';
import {
  ALLOWED_PARAMS,
  DEFAULT_LIST_QUERY_PARAMS,
  PARAM_VALUES,
  SearchParamKeys,
  SearchParams,
} from '@/containers/vehicles/constants';
import { metaFactoryFetcher } from '@/utils/api';

import Title from './_components/Title';

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const filteredParams = ALLOWED_PARAMS.reduce(
    (params, paramKey) => ({
      ...params,
      ...(searchParams[paramKey] ? { [paramKey]: searchParams[paramKey] } : {}),
    }),
    {} as SearchParams
  );

  const queryParamBuilder = () => {
    const filterParams = new URLSearchParams({
      ...DEFAULT_LIST_QUERY_PARAMS,
      ...filteredParams,
    });

    const params = Object.keys(filteredParams);

    params.forEach((key) => {
      if (filteredParams[key as SearchParamKeys] === PARAM_VALUES.ALL)
        filterParams.delete(key);
    });

    const multiValueParams = Object.keys(filteredParams).filter(
      (key) =>
        key !== 'sort' &&
        key !== 'searchTerm' &&
        filteredParams[key as SearchParamKeys]?.includes(',')
    ) as SearchParamKeys[];
    multiValueParams.forEach((key) => {
      filterParams.delete(key);

      if (filteredParams[key]) {
        filteredParams[key].split(',').forEach((value) => {
          filterParams.append(key, value);
        });
      }
    });
    return filterParams.toString();
  };

  const data: Promise<StockListData> = metaFactoryFetcher(
    `api/carstock?${queryParamBuilder()}`
  );

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-4 border-0 border-b border-solid border-[#DEE0E2] p-4 lg:gap-6 lg:border-none lg:p-0'>
        <Title data={data} />
        {/* Change to proper fallback component */}
        <ErrorBoundary FallbackComponent={DetailBlockErrorFallback}>
          <Suspense fallback={<StockListFiltersLoadingFallback />}>
            <StockListFilters searchParams={filteredParams} data={data} />
          </Suspense>
        </ErrorBoundary>
      </div>
      <ErrorBoundary FallbackComponent={DetailBlockErrorFallback}>
        <Suspense fallback={<StockListItemsLoadingFallback />}>
          <StockListItems searchParams={filteredParams} data={data} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default Page;
