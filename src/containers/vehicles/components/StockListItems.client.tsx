'use client';

import { TablePagination } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useTransition } from 'react';

import SpinnerScreen from '@/components/SpinnerScreen';
import { useTranslations } from '@/hooks/translation';
import { buildParams } from '@/utils/urlParams';

import { DEFAULT_LIST_QUERY_PARAMS, SearchParams } from '../constants';
import ListedCar, { ListedCarLoadingFallback } from './ListedCar';
import { CarStockListData, StockListData } from './types';

const StockListItems = ({
  searchParams,
  listData,
  imagesPromise,
}: {
  searchParams: SearchParams;
  listData?: StockListData;
  imagesPromise: Promise<Array<CarStockListData>>;
}) => {
  const carListItems =
    listData?.items && listData?.items?.length > 0 ? listData?.items : [];
  const t = useTranslations();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const setQueryParam = useCallback(
    (key: string, value: string[] | string, replace = true) => {
      const urlParams = new URLSearchParams(searchParams);
      buildParams(urlParams, key, value);
      const query = urlParams.toString() || '';
      const path = `/vehicles?${query}`;
      startTransition(() => {
        if (replace) {
          router.replace(path);
        } else {
          router.push(path);
        }
      });
    },
    [searchParams, router]
  );

  useEffect(() => {
    // Using useEffect instead of capturing changes in every field onChange because URL changes made by user in URL bar cannot be captured that way
    const urlParams = new URLSearchParams(searchParams);
    sessionStorage.setItem('stockFilters', urlParams.toString());
  }, [searchParams]);

  const onPageChange = (
    _e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    page: number
  ) => {
    setQueryParam('page', page === 0 ? '' : page.toString(), true);
  };

  const onRowsPerPageChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) =>
    setQueryParam(
      'size',
      e.target.value.toString() === DEFAULT_LIST_QUERY_PARAMS.size.toString()
        ? ''
        : e.target.value.toString()
    );

  const paginationProps = {
    count: listData?.totalElements || 0,
    page: Number(searchParams?.page) || DEFAULT_LIST_QUERY_PARAMS.page,
    rowsPerPage: Number(searchParams?.size) || DEFAULT_LIST_QUERY_PARAMS.size,
    labelRowsPerPage: `${t('stock.filters.rows')}: `,
    selectProps: { classes: { icon: 'top-1' }, className: 'pt-[3px]' },
  };

  return (
    <>
      {isPending && <SpinnerScreen />}

      {/* Carstock List */}
      <div className='text- flex flex-col gap-6' data-testid='stockList'>
        {carListItems?.map((x) => (
          <ListedCar key={x.id} carDetails={x} imagesPromise={imagesPromise} />
        ))}
      </div>
      {carListItems.length > 0 && (
        <TablePagination
          component='div'
          count={paginationProps.count}
          page={paginationProps.page}
          onPageChange={onPageChange}
          rowsPerPage={paginationProps.rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          labelRowsPerPage={paginationProps.labelRowsPerPage}
          slotProps={{ select: paginationProps.selectProps }}
        />
      )}
    </>
  );
};

export default StockListItems;

export const StockListItemsLoadingFallback = () => (
  <div className='text- flex flex-col gap-6'>
    {Array.from({ length: 10 }, (_, i) => i + 1).map((x) => (
      <ListedCarLoadingFallback key={x} />
    ))}
  </div>
);
