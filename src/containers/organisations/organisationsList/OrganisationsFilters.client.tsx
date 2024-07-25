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
  ORGANISATION_TYPES,
  organisationTypesList,
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

const OrganisationsFilters = ({ params }: { params: SearchParams }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const t = useTranslations('filters');
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
    <Grid container columnSpacing={2} rowSpacing={1}
    data-testid='organisation-listing-filter-container'
    >
      <Grid item xs={6} sm={3}>
        <TextField
          fullWidth
          name='name'
          label={t('search')}
          inputRef={inputRef}
          id='search-name-filter'
          defaultValue={params.name}
          onChange={debouncedSetSearchKey}
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
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <SimpleDropdown
          dataTestId='organisations-filter-type-dropdown'
          label={t('type')}
          options={organisationTypesList.map((type) => ({
            id: type,
            displayValue: t(type as ORGANISATION_TYPES),
          }))}
          name='type'
          value={multiSelectionFilters?.type || []}
          onChange={setSearchKey}
          className='block'
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <SimpleDropdown
          dataTestId='organisations-filter-phase-dropdown'
          label={t('phase')}
          options={phaseList.map((phase) => ({
            id: phase,
            displayValue: t(phase),
          }))}
          name='phase'
          value={multiSelectionFilters?.phase || []}
          onChange={setSearchKey}
          className='block'
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <SimpleDropdown
          dataTestId='organisations-filter-status-dropdown'
          label={t('status')}
          options={statusList.map((status) => ({
            id: status === 'Active' ? 'true' : 'false',
            displayValue: t(status),
          }))}
          name='isActive'
          value={multiSelectionFilters?.isActive || []}
          onChange={setSearchKey}
          className='block'
        />
      </Grid>
    </Grid>
  );
};

export default OrganisationsFilters;
