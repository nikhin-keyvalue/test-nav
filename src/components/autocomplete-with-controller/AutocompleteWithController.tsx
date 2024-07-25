'use client';

import { Autocomplete, autocompleteClasses, TextField } from '@mui/material';
import React from 'react';
import { Controller, FieldValues } from 'react-hook-form';
import { MdManageSearch } from 'react-icons/md';

import {
  ExtendedListboxProps,
  IAutocompleteWithControllerProps,
} from './types';

const AutocompleteWithController = <T, U extends FieldValues>(
  props: IAutocompleteWithControllerProps<T, U>
) => {
  const {
    testId,
    name,
    label,
    options,
    control,
    isMultiple,
    helperText,
    defaultValue,
    getOptionLabel,
    disabled = false,
    isOptionEqualToValue,
    customError,
    renderOption,
    onInputChange,
    loading,
    loadingText,
    noOptionsText,
    onOpen,
    filterOptions,
    required,
  } = props;

  const autoCompleteListboxProps: ExtendedListboxProps = {
    'data-testid': `${testId}-listbox`,
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const requiredError = customError || error;
        const { value } = field;

        return (
          <Autocomplete
            ListboxProps={autoCompleteListboxProps}
            multiple={isMultiple}
            options={options}
            popupIcon={<MdManageSearch size={24} />}
            getOptionLabel={getOptionLabel}
            sx={{
              [`& .${autocompleteClasses.popupIndicator}`]: {
                transform: 'none',
              },
            }}
            disabled={disabled}
            defaultValue={defaultValue}
            renderInput={(params) => (
              <TextField
                {...params}
                id={testId}
                data-testid={testId}
                label={label}
                helperText={
                  helperText || (requiredError ? requiredError.message : null)
                }
                error={!!requiredError}
                required={required}
              />
            )}
            {...field}
            value={value || null}
            onChange={(event, newValue) => {
              field.onChange(newValue);
            }}
            renderOption={renderOption}
            isOptionEqualToValue={isOptionEqualToValue}
            onInputChange={onInputChange}
            loading={loading}
            loadingText={loadingText}
            noOptionsText={noOptionsText}
            onOpen={onOpen}
            filterOptions={filterOptions}
          />
        );
      }}
    />
  );
};

export default AutocompleteWithController;
