import {
  AutocompleteInputChangeReason,
  FilterOptionsState,
  SxProps,
  Theme,
} from '@mui/material';
import React from 'react';
import { Control, FieldError, FieldValues, Path } from 'react-hook-form';

interface IAutocompleteWithControllerProps<T, U extends FieldValues> {
  name: Path<U>;
  label: string;
  options: Array<T>;
  disabled?: boolean;
  control: Control<U>;
  helperText?: string;
  isMultiple?: boolean;
  defaultValue?: T[] | undefined;
  getOptionLabel: (option: T) => string;
  isOptionEqualToValue?: (option: T, value: T) => boolean;
  customError?: FieldError;
  renderOption?: (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: T
  ) => React.ReactNode;
  onInputChange?: (
    event: React.SyntheticEvent<Element, Event>,
    value: string,
    reason: AutocompleteInputChangeReason
  ) => void;
  loading?: boolean;
  loadingText?: string;
  noOptionsText?: React.ReactNode;
  onOpen?: ((event: React.SyntheticEvent<Element, Event>) => void) | undefined;
  filterOptions?: (options: T[], state: FilterOptionsState<T>) => T[];
  testId: string;
  required?: boolean;
}

export type { IAutocompleteWithControllerProps };

export interface ExtendedListboxProps
  extends React.HTMLAttributes<HTMLUListElement> {
  sx?: SxProps<Theme> | undefined;
  ref?: React.Ref<Element> | undefined;
  'data-testid'?: string;
}
