import { TextField, TextFieldProps } from '@mui/material';
import { useState } from 'react';
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Path,
} from 'react-hook-form';

import { InputBaseComponentPropsWithTest } from '@/types/common';

const TextFieldWithController = <T extends FieldValues>({
  name,
  control,
  label,
  customError,
  charLimit,
  testId,
  required,
  ...rest
}: TextFieldProps & {
  name: Path<T>;
  control: Control<T>;
  customError?: FieldError;
  charLimit?: number;
  testId?: string;
  required?: boolean;
}) => {
  const textFieldInputProps: InputBaseComponentPropsWithTest = {
    'data-testid': `${testId}-input`,
  };
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({
        formState,
        fieldState: { error },
        field: { onChange, value },
      }) => {
        const requiredError = customError || error;
        return (
          <TextField
            {...rest}
            id={testId}
            data-testid={testId}
            fullWidth
            label={label}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={(event) => {
              if (rest.onBlur) rest.onBlur(event);
              setIsFocused(false);
            }}
            InputLabelProps={{
              shrink: !!value || !!rest.defaultValue || isFocused,
            }}
            inputProps={textFieldInputProps}
            error={!!requiredError}
            helperText={
              <div className='flex justify-between'>
                <div>
                  {rest.helperText ||
                    (requiredError ? requiredError.message : null)}
                </div>
                {charLimit && (
                  <div>
                    {String(value || '').length} / {charLimit}
                  </div>
                )}
              </div>
            }
            required={required}
          />
        );
      }}
    />
  );
};

export default TextFieldWithController;
