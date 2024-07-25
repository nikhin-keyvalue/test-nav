'use client';

import { Grid, TextField } from '@mui/material';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/navigation';
import {
  ChangeEventHandler,
  useCallback,
  useMemo,
  useRef,
  useTransition,
} from 'react';
import { MdClose, MdSearch } from 'react-icons/md';

import SimpleDropdown from '@/components/SimpleDropdown';
import {
  PERSON_TYPES,
  personTypesList,
  phaseList,
  singleOptionFields,
  statusList,
} from '@/constants/filter';
import { useTranslations } from '@/hooks/translation';
import {
  MultiSelectionFields,
  SearchParamKeys,
  SearchParams,
} from '@/types/common';

const PersonsFilter = ({ params }: { params: SearchParams }) => {
  const t = useTranslations('filters');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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

    // if (urlParams.size === 0) {
    //   urlParams.set('empty', 'true');
    // }
  };

  const setQueryParam = useCallback(
    (key: string, value: string[] | string) => {
      const urlParams = new URLSearchParams(params);
      buildParams(urlParams, key, value);
      const query = urlParams.toString() || '';
      startTransition(() => router.replace(`?${query}`));
    },
    [params, router]
  );

  const updateSearchTerm = (value: string = '') => {
    if (inputRef.current?.value) {
      inputRef.current.value = value;
    }
    setQueryParam('name', value);
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
  }, [params]) as Record<MultiSelectionFields, string[]>;

  return (
    <Grid
      container
      columnSpacing={2}
      data-testid='person-listing-filter-container'
    >
      <Grid item sm={3}>
        <TextField
          label={t('search')}
          fullWidth
          defaultValue={params.name}
          onChange={debouncedSetSearchKey}
          inputRef={inputRef}
          name='name'
          InputProps={{
            endAdornment: !params.name ? (
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
          id='search-name-filter'
        />
      </Grid>
      <Grid item sm={3}>
        <SimpleDropdown
          dataTestId='persons-filter-type-dropdown'
          label={t('type')}
          options={personTypesList.map((type) => ({
            id: type,
            displayValue: t(type as PERSON_TYPES),
          }))}
          name='type'
          value={multiSelectionFilters?.type || []}
          onChange={setSearchKey}
          className='hidden lg:block'
        />
      </Grid>
      <Grid item sm={3}>
        <SimpleDropdown
          dataTestId='persons-filter-phase-dropdown'
          label={t('phase')}
          options={phaseList.map((phase) => ({
            id: phase,
            displayValue: t(phase),
          }))}
          name='phase'
          value={multiSelectionFilters?.phase || []}
          onChange={setSearchKey}
          className='hidden lg:block'
        />
      </Grid>
      <Grid item sm={3}>
        <SimpleDropdown
          dataTestId='persons-filter-status-dropdown'
          label={t('status')}
          options={statusList.map((status) => ({
            id: status === 'Active' ? 'true' : 'false',
            displayValue: t(status),
          }))}
          name='isActive'
          value={multiSelectionFilters?.isActive || []}
          onChange={setSearchKey}
          className='hidden lg:block'
        />
      </Grid>
    </Grid>
  );
};

export default PersonsFilter;
