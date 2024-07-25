'use client';

import {
  Button,
  ButtonGroup,
  TablePagination,
  TextField,
  Tooltip,
} from '@mui/material';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/navigation';
import React, {
  ChangeEventHandler,
  useCallback,
  useMemo,
  useRef,
  useTransition,
} from 'react';
import { MdClose, MdOutlineDelete, MdSearch } from 'react-icons/md';

import Combobox from '@/components/Combobox';
import SimpleDropdown from '@/components/SimpleDropdown';
import SpinnerScreen from '@/components/SpinnerScreen';
import { useGetOptionLabel } from '@/hooks/filters';
import { useTranslations } from '@/hooks/translation';

import {
  DEFAULT_LIST_QUERY_PARAMS,
  FiltersData,
  FiltersDataKeys,
  MultiSelectFiltersState,
  SearchParamKeys,
  SearchParams,
} from '../constants';
import FilterSheet from './FilterSheet';
import Pill from './Pill';
import SortDialog from './SortDialog';
import { StockListData } from './types';

const singleOptionFields = [
  'searchTerm',
  'sort',
  'page',
  'size',
  'publish',
] as const;

const StockListFilters = ({
  filters: filterOptions,
  params,
  listData,
}: {
  filters: FiltersData;
  params: SearchParams;
  listData?: StockListData;
}) => {
  const t = useTranslations();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const getOptionLabel = useGetOptionLabel({ filterOptions });

  const buildParams = (
    urlParams: URLSearchParams,
    key: string,
    value: string[] | string
  ) => {
    if (!value?.length) {
      urlParams.delete(key);
    } else {
      urlParams.set(key, value.toString());
    }
    if (key !== 'page') urlParams.set('page', '0');

    if (urlParams.size === 0) {
      urlParams.set('empty', 'true');
    }
  };

  const setQueryParam = useCallback(
    (key: string, value: string[] | string, replace = true) => {
      const urlParams = new URLSearchParams(params);
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
    [params, router]
  );

  const removeQueryParam = (key: string, value?: string) => {
    const urlParams = new URLSearchParams(params);
    const currentValues = urlParams.get(key)?.split(',');
    if (currentValues?.length) {
      const newValues = value?.length
        ? currentValues.filter((item) => item !== value)
        : '';
      buildParams(urlParams, key, newValues);
      const query = urlParams.toString() || '';
      startTransition(() => router.replace(`/vehicles?${query}`));
    }
  };
  const setSearchKey: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const { name, value } = event.target;
      setQueryParam(name, typeof value === 'string' ? value.trim() : value);
    },
    [setQueryParam]
  );

  const debouncedSetSearchKey = useMemo(
    () => debounce(setSearchKey, 550),
    [setSearchKey]
  );

  const updateSearchTerm = (value: string = '') => {
    if (inputRef.current?.value) {
      inputRef.current.value = value;
    }
    setQueryParam('searchTerm', value);
  };

  const clearFilters = () => {
    if (inputRef.current?.value) {
      inputRef.current.value = '';
    }
    if (Object.keys(params).length) {
      startTransition(() => router.replace(`/vehicles?empty`));
    }
  };

  const multiSelectionFilters = useMemo(() => {
    const muliSelectionOptions = Object.keys(params).filter((param) => {
      const key = param as SearchParamKeys;
      return !singleOptionFields.find((option) => option === key);
    }) as SearchParamKeys[];
    return Object.fromEntries(
      muliSelectionOptions.map((key) => {
        const value = params[key];

        return [key, value.split(',')];
      })
    );
  }, [params]) as Record<FiltersDataKeys, string[]>;

  const applyFiltersFromSheet = (
    multiSelectStateFilters: MultiSelectFiltersState,
    published: string
  ) => {
    const urlParams = new URLSearchParams();
    Object.keys(multiSelectStateFilters).forEach((key) => {
      const value = multiSelectStateFilters[key as FiltersDataKeys];
      buildParams(urlParams, key, value);
    });
    buildParams(urlParams, 'publish', published);
    const query = urlParams.toString() || '';
    startTransition(() => router.replace(`/vehicles?${query}`));
  };
  const selectedFiltersCount = Object.keys(multiSelectionFilters).length;

  const paginationProps = {
    count: listData?.totalElements || 0,
    page: Number(params?.page) || DEFAULT_LIST_QUERY_PARAMS.page,
    rowsPerPage: Number(params?.size) || DEFAULT_LIST_QUERY_PARAMS.size,
    labelRowsPerPage: `${t('stock.filters.rows')}: `,
    selectProps: { classes: { icon: 'top-1' }, className: 'pt-[3px]' },
  };

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

  const carListItems =
    listData?.items && listData?.items?.length > 0 ? listData?.items : [];

  return (
    <>
      {isPending && (
        <SpinnerScreen
          spinnerProps={{ 'data-testid': 'stockListPageSpinner' }}
        />
      )}
      <div className='flex flex-col gap-4'>
        <div className='flex flex-initial gap-4'>
          <div className='relative w-full lg:max-w-sm'>
            <TextField
              label={t('stock.filters.search')}
              fullWidth
              defaultValue={params.searchTerm}
              onChange={debouncedSetSearchKey}
              inputRef={inputRef}
              name='searchTerm'
              InputProps={{
                endAdornment: !params.searchTerm ? (
                  <MdSearch className='h-5 w-5' />
                ) : (
                  <button
                    type='button'
                    className='border-none bg-transparent p-0 hover:cursor-pointer'
                    onClick={() => updateSearchTerm('')}
                  >
                    <MdClose className='h-5 w-5' />
                  </button>
                ),
                autoComplete: 'off',
              }}
            />
          </div>

          <div className='relative hidden w-full lg:block lg:max-w-sm'>
            <SimpleDropdown
              dataTestId='stock-filters-stock-dropdown'
              label={t('stock.filters.stock')}
              options={
                filterOptions?.stockStatuses?.map((status) => ({
                  id: status,
                  displayValue: t(`stockDetails.status.${status}`),
                })) || []
              }
              name='stockStatusList'
              tName='stockStatusList'
              value={multiSelectionFilters.stockStatusList || []}
              onChange={setSearchKey}
            />
          </div>
          <div className='relative hidden w-full lg:block lg:max-w-sm'>
            <SimpleDropdown
              dataTestId='stock-filters-type-dropdown'
              label={t('stock.filters.type')}
              options={
                filterOptions?.types?.map((type) => ({
                  id: type,
                  displayValue: t(`stockDetails.status.${type}`),
                })) || []
              }
              name='typeList'
              tName='typeList'
              value={multiSelectionFilters.typeList || []}
              onChange={setSearchKey}
            />
          </div>

          <div className='relative hidden w-full lg:block lg:max-w-sm'>
            <Combobox
              label={t('stock.filters.seller')}
              dataTestId='stock-filters-seller-dropdown'
              options={
                filterOptions.sellers?.map((v) => ({
                  id: v.id!.toString(),
                  displayValue: v.displayValue!,
                })) || []
              }
              values={multiSelectionFilters.sellerIdList || []}
              onValChange={(newValue) =>
                setQueryParam(
                  'sellerIdList',
                  newValue.map((v) => v.id)
                )
              }
            />
          </div>
          <div className='relative hidden w-full lg:block lg:max-w-sm'>
            <SimpleDropdown
              dataTestId='stock-filters-sale-status-dropdown'
              label={t('stock.filters.saleStatus')}
              options={
                filterOptions.sellingStatuses?.map((sellingStatus) => ({
                  id: sellingStatus,
                  displayValue: t(`stockDetails.status.${sellingStatus}`),
                })) || []
              }
              name='sellingStatusList'
              tName='sellingStatusList'
              value={multiSelectionFilters.sellingStatusList || []}
              onChange={setSearchKey}
            />
          </div>
          <div className='shrink-0 lg:hidden'>
            <FilterSheet
              filterOptions={filterOptions}
              currentMultiSelectFilters={multiSelectionFilters}
              currentPublished={params?.publish}
              applyFilters={applyFiltersFromSheet}
              triggerLabel={`${t('stock.filters.sheetTitle')}${
                selectedFiltersCount !== 0 ? ` (${selectedFiltersCount})` : ''
              }`}
              params={params}
            />
          </div>
        </div>

        <div className='w-full justify-between lg:flex'>
          <div className='hidden flex-wrap items-center gap-2 lg:flex'>
            <ButtonGroup color='secondary'>
              <FilterSheet
                filterOptions={filterOptions}
                currentMultiSelectFilters={multiSelectionFilters}
                currentPublished={params?.publish}
                applyFilters={applyFiltersFromSheet}
                triggerLabel={t('stock.filters.addFilter')}
                params={params}
              />
              <Tooltip title={t('stock.clearFiltersTooltip')}>
                <Button size='small' onClick={clearFilters}>
                  <MdOutlineDelete className='h-5 w-5' />
                </Button>
              </Tooltip>
            </ButtonGroup>
            {Object.keys(multiSelectionFilters).map((key) =>
              multiSelectionFilters[key as FiltersDataKeys].map((value) => (
                <Pill
                  variant='medium'
                  key={`${key}_${value}`}
                  onClick={() => removeQueryParam(key, value)}
                >
                  {getOptionLabel(key as FiltersDataKeys, value)}
                </Pill>
              ))
            )}
            {params.publish?.length ? (
              <Pill
                variant='medium'
                onClick={() => removeQueryParam('published')}
              >
                {t(
                  `stock.filterOptions.published.${
                    params?.publish as 'true' | 'false'
                  }`
                )}
              </Pill>
            ) : null}
          </div>
          <div className='flex flex-row items-center justify-end gap-2'>
            <div className='hidden md:block'>
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
            </div>
            <SortDialog
              currentSortOption={params?.sort || DEFAULT_LIST_QUERY_PARAMS.sort}
              onApplySort={(newSort) => setQueryParam('sort', newSort)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default StockListFilters;

export const StockListFiltersLoadingFallback = () => (
  <>
    <div className='hidden lg:block'>
      <div className='mb-4 flex w-full gap-4'>
        {Array.from({ length: 5 }, (_, i) => i + 1).map((x) => (
          <div key={x} className='skeleton-loader h-[58px] flex-1 rounded' />
        ))}
      </div>
      <div className='flex w-full justify-between gap-4'>
        <div className='skeleton-loader h-[38.5px] w-[200px] rounded' />
        <div className='flex items-center gap-4'>
          <div className='skeleton-loader h-6 w-[306px] rounded' />
          <div className='skeleton-loader h-10 w-[116px] rounded' />
        </div>
      </div>
    </div>
    <div className='lg:hidden'>
      <div className='mb-4 flex w-full gap-4'>
        <div className='skeleton-loader h-[58px] flex-1 rounded' />
        <div className='skeleton-loader h-[58px] w-[112px] shrink-0 rounded' />
      </div>
      <div className='flex items-center justify-end gap-4'>
        <div className='skeleton-loader h-6 w-[306px] rounded' />
        <div className='skeleton-loader h-10 w-[44px] rounded' />
      </div>
    </div>
  </>
);
