import React from 'react';

import TextFieldWithController from '../TextFieldWithController';
import { ISelectWithControllerProps } from './types';

const SelectWithController = <T,>(props: ISelectWithControllerProps<T>) => {
  const {
    name,
    control,
    label,
    className,
    options,
    renderOption,
    disabled = false,
    isBulk = false,
    error = false,
    helperText, // TODO: is this necessary?
    defaultValue = '',
    testId,
    required = false,
  } = props;

  // TODO: const t = useTranslations();
  const {
    _formState: { errors },
  } = control;

  return (
    <TextFieldWithController
      testId={testId}
      key={defaultValue}
      name={name}
      defaultValue={defaultValue}
      control={control}
      label={label}
      select
      fullWidth
      className={className}
      error={!!errors[name] || error}
      inputProps={{
        sx: {
          readOnly: disabled,
        },
      }}
      InputProps={{
        className: disabled ? 'Mui-disabled' : undefined,
        sx: { fontWeight: isBulk ? 600 : 400 },
      }}
      SelectProps={{
        MenuProps: {
          sx: { marginTop: '-3px' },
        },
      }}
      sx={{
        pointerEvents: disabled ? 'none' : 'all',
      }}
      disabled={isBulk}
      helperText={error ? helperText : ''}
      required={required}
    >
      {options?.map((option) => renderOption(option))}
    </TextFieldWithController>
  );
};

export default SelectWithController;
