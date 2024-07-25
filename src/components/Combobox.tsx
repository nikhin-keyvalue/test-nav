'use client';

// This combobox component replaces the NestedDropdown component. Its completly the same except
// that this one is generic and therefore can accept multiple types. In the future it could be made
// even more customisible. For example single select.

import {
  Autocomplete,
  autocompleteClasses,
  AutocompleteInputChangeReason,
  FilterOptionsState,
  TextField,
} from '@mui/material';
import { MdManageSearch } from 'react-icons/md';

const Combobox = <T extends { id: string; displayValue: string }>(props: {
  label: string;
  values: (T | string)[];
  options: T[];
  onValChange: (val: T[]) => void;
  className?: string;
  renderOption?: (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: T
  ) => React.ReactNode;
  fetchOptionsOnSearch?: boolean;
  onInputChange?: (
    event: React.SyntheticEvent<Element, Event>,
    value: string,
    reason: AutocompleteInputChangeReason
  ) => void;
  loading?: boolean;
  loadingText?: string;
  noOptionsText?: React.ReactNode;
  onOpen?: ((event: React.SyntheticEvent<Element, Event>) => void) | undefined;
  isOptionEqualToValue?: (option: T, value: T) => boolean;
  filterOptions?: (options: T[], state: FilterOptionsState<T>) => T[];
  dataTestId: string;
}) => {
  const {
    label,
    values,
    onValChange,
    options,
    className,
    renderOption,
    onInputChange,
    loading,
    loadingText,
    noOptionsText,
    onOpen,
    isOptionEqualToValue,
    fetchOptionsOnSearch = false,
    filterOptions,
    dataTestId,
  } = props;

  return (
    <Autocomplete
      data-testid={dataTestId}
      disableCloseOnSelect
      multiple
      fullWidth
      filterSelectedOptions
      value={
        fetchOptionsOnSearch
          ? (values as T[])
          : options.filter((x) => values.some((v) => v === x.id))
      }
      popupIcon={<MdManageSearch size={24} />}
      sx={{
        [`& .${autocompleteClasses.popupIndicator}`]: {
          transform: 'none',
        },
      }}
      onChange={(_, newValue) => onValChange(newValue)}
      options={options}
      getOptionLabel={(opt) => opt.displayValue}
      renderInput={(params) => <TextField {...params} label={label} />}
      renderOption={renderOption}
      className={className}
      onInputChange={onInputChange}
      isOptionEqualToValue={isOptionEqualToValue}
      loading={loading}
      loadingText={loadingText}
      noOptionsText={noOptionsText}
      onOpen={onOpen}
      filterOptions={filterOptions}
    />
  );
};

export default Combobox;
