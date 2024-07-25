'use client';

import { createFilterOptions } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { deliveryTestIds } from '@test/constants/testIds';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/navigation';
import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import { MdClose, MdSearch } from 'react-icons/md';

import { RenderPersonOption } from '@/components';
import Combobox from '@/components/Combobox';
import SimpleDropdown from '@/components/SimpleDropdown';
import { singleOptionFields } from '@/constants/filter';
import {
  getDealers,
  getSalesPersons,
} from '@/containers/opportunities/api/api';
import { useOptions } from '@/hooks/options';
import { useTranslations } from '@/hooks/translation';
import {
  MultiSelectionFields,
  SearchParamKeys,
  SearchParams,
} from '@/types/common';
import { DealersResponse, SalespersonListResponse } from '@/types/metafactory';
import { getPersonFilterOptions } from '@/utils/common';

import { DeliveryStatusList } from '../constants';

const DeliveryFilter = ({ searchParams }: { searchParams: SearchParams }) => {
  const { name: searchValueParam = '' } = searchParams;
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);

  const [dealerListData, setDealerListData] = useState<DealersResponse>([]);
  const [salespersonListData, setSalespersonListData] =
    useState<SalespersonListResponse>([]);

  const router = useRouter();

  const fetchDealers = async () => {
    const response = await getDealers();
    setDealerListData(response);
  };

  const fetchSalespersons = async () => {
    const response = await getSalesPersons();
    setSalespersonListData(response);
  };

  useEffect(() => {
    fetchDealers();
    fetchSalespersons();
  }, []);

  const [, startTransition] = useTransition();

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
    urlParams.set('offset', '0');
  };

  const setQueryParam = useCallback(
    (key: string, value: string[] | string) => {
      const urlParams = new URLSearchParams(searchParams);
      buildParams(urlParams, key, value);
      const query = urlParams.toString() || '';
      startTransition(() => router.replace(`?${query}`));
    },
    [searchParams, router]
  );

  const updateSearchTerm = (value: string = '') => {
    if (inputRef.current?.value) {
      inputRef.current.value = value;
    }
    setQueryParam('name', value);
  };

  const setSearchParamKey: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const { name, value } = event.target;
      setQueryParam(name, typeof value === 'string' ? value.trim() : value);
    },
    [setQueryParam]
  );

  const debouncedSetSearchKey = useMemo(
    () => debounce(setSearchParamKey, 550),
    [setSearchParamKey]
  );

  const multiSelectionFilters = useMemo(() => {
    const multiSelectionOptions = Object.keys(searchParams).filter(
      (searchParam) => {
        const key = searchParam as SearchParamKeys;
        return !singleOptionFields.find((option) => option === key);
      }
    ) as SearchParamKeys[];

    return Object.fromEntries(
      multiSelectionOptions.map((key) => {
        const value = searchParams[key];
        return [key, value.split(',')];
      })
    );
  }, [searchParams]) as Record<MultiSelectionFields, string[]>;

  const dealerListFilterOptions =
    dealerListData.map((dealer) => ({
      id: dealer.id.toString(),
      displayValue: dealer.name,
    })) ?? [];

  const salespersonListFilterOptions =
    getPersonFilterOptions(salespersonListData);

  const {
    options: personOptions,
    loading: personLoading,
    onInputChange: onPersonInputChange,
    onOpen: onPersonOpen,
  } = useOptions({
    url: '/api/getPersons',
    customSearchParamKeys: ['name', 'email'],
  });

  const selectedCustomers = useMemo(
    () =>
      multiSelectionFilters.customerId?.map((item) => {
        const [id, displayValue] = item.split('|');
        return { id, displayValue };
      }) || [],
    [multiSelectionFilters.customerId]
  );

  return (
    <Grid
      container
      columnSpacing={2}
      rowSpacing={1}
      data-testid={deliveryTestIds.deliveriesListingFilterContainer}
    >
      <Grid item sm={2.4} xs={6}>
        <TextField
          label={t('filters.search')}
          fullWidth
          defaultValue={searchValueParam}
          onChange={debouncedSetSearchKey}
          inputRef={inputRef}
          name='name'
          InputProps={{
            endAdornment: !searchValueParam ? (
              <MdSearch className='size-5' />
            ) : (
              <button
                type='button'
                className='border-none bg-transparent p-0 hover:cursor-pointer'
                onClick={() => updateSearchTerm('')}
              >
                <MdClose className='size-5' />
              </button>
            ),
            autoComplete: 'off',
          }}
          data-testid={deliveryTestIds.deliverySearchTextField}
        />
      </Grid>
      <Grid item sm={2.4} xs={6}>
        <SimpleDropdown
          dataTestId={deliveryTestIds.simpleDropdownSelectDeliveryStatus}
          label={t('filters.status')}
          options={DeliveryStatusList.map((key) => ({
            id: key,
            displayValue: t(`deliveries.deliveryStatus.${key}`) ?? '',
          }))}
          name='status'
          value={multiSelectionFilters?.status || []}
          onChange={setSearchParamKey}
          className='block'
        />
      </Grid>
      <Grid item sm={2.4} xs={6}>
        <Combobox
          dataTestId='delivery-filters-salesperson-dropdown'
          label={t('common.salesperson')}
          options={salespersonListFilterOptions}
          values={multiSelectionFilters.salespersonId || []}
          onValChange={(newValue) =>
            setQueryParam(
              'salespersonId',
              newValue.map((v) => v.id)
            )
          }
          renderOption={RenderPersonOption}
          className='block'
          filterOptions={createFilterOptions({
            stringify: ({ displayValue, email }) => `${displayValue} ${email}`,
          })}
        />
      </Grid>
      <Grid item sm={2.4} xs={6}>
        <Combobox
          dataTestId='delivery-filters-dealer-dropdown'
          label={t('common.dealer')}
          options={dealerListFilterOptions}
          values={multiSelectionFilters.dealerId || []}
          onValChange={(newValue) =>
            setQueryParam(
              'dealerId',
              newValue.map((v) => v.id)
            )
          }
          className='block'
        />
      </Grid>
      <Grid item sm={2.4} xs={6}>
        <Combobox
          dataTestId='delivery-filters-customer-dropdown'
          fetchOptionsOnSearch
          label={t('common.customer')}
          options={getPersonFilterOptions(personOptions)}
          values={selectedCustomers}
          onValChange={(newValue) =>
            setQueryParam(
              'customerId',
              newValue.map(({ id, displayValue }) => `${id}|${displayValue}`)
            )
          }
          renderOption={RenderPersonOption}
          className='block'
          onInputChange={onPersonInputChange}
          loading={personLoading}
          onOpen={onPersonOpen}
          noOptionsText={t('common.startTyping')}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          // Note: this disables the built-in filtering of the Autocomplete component
          filterOptions={(x) => x}
        />
      </Grid>
    </Grid>
  );
};

export default DeliveryFilter;
