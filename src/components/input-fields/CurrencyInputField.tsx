import { InputAdornment } from '@mui/material';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { ChangeEvent } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { BsCurrencyEuro } from 'react-icons/bs';
import { twMerge } from 'tailwind-merge';

import { formatAmount } from '@/utils/currency';

const CurrencyInputField = <T extends FieldValues>({
  control,
  name,
  label,
  disabled = false,
  onClick = () => null,
  onChange = () => null,
  ...rest
}: TextFieldProps & {
  control: Control<T>;
  name: Path<T>;
  label: string;
  disabled?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClick?: () => void;
}) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState: { error } }) => (
      <TextField
        {...rest}
        {...field}
        label={label}
        inputProps={{
          style: { textAlign: 'right' },
          readOnly: disabled,
        }}
        error={!!error}
        helperText={error?.message ?? ''}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <BsCurrencyEuro className='text-secondary' />
            </InputAdornment>
          ),
          className: twMerge(disabled ? '!bg-grey-8' : ''),
        }}
        onChange={(e) => {
          if (
            e.target.value === '0' ||
            e.target.value.endsWith(',') ||
            e.target.value.endsWith('.')
          )
            field.onChange(e.target.value);
          else {
            const value = formatAmount(
              parseFloat(
                e.target.value.replace(/[^0-9,]/g, '').replace(/,/, '.')
              )
            );
            field.onChange(value);
          }
          if (onChange) {
            onChange(e);
          }
        }}
        onClick={onClick}
        disabled={disabled}
      />
    )}
  />
);

export default CurrencyInputField;
