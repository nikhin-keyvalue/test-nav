import { InputAdornment } from '@mui/material';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { ChangeEvent, useEffect, useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { BsCurrencyEuro, BsPercent } from 'react-icons/bs';

import { formatAmount, formatPlainStringToCurrency } from '@/utils/currency';

import { ReadOnlyTextFieldVariantType } from './ReadOnlyTextField';

const DutchNumberInputField = <T extends FieldValues>({
  control,
  name,
  testId,
  label,
  disabled = false,
  onClick = () => null,
  onChange = () => null,
  variantType = 'default',
  defaultValue,
  onBlur,
  isDecimalAllowed = true,
  required,
  ...rest
}: TextFieldProps & {
  control: Control<T>;
  testId?: string;
  name: Path<T>;
  label: string;
  disabled?: boolean;
  defaultValue?: number;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClick?: () => void;
  isDecimalAllowed?: boolean;
  variantType?: ReadOnlyTextFieldVariantType;
  required?: boolean;
}) => {
  const [inputValue, setInputValue] = useState<string | undefined>('');
  useEffect(() => {
    setInputValue(formatAmount(defaultValue));
  }, [defaultValue]);
  const variantProps: Record<
    ReadOnlyTextFieldVariantType | 'percentage',
    unknown
  > = {
    currency: {
      inputProps: {
        'data-testid': `${testId}-input`,
        style: { textAlign: 'right' },
      },
      InputProps: {
        startAdornment: (
          <InputAdornment position='start'>
            <BsCurrencyEuro className='text-secondary' />
          </InputAdornment>
        ),
      },
    },
    percentage: {
      inputProps: {
        'data-testid': `${testId}-input`,
        style: { textAlign: 'left' },
      },
      InputProps: {
        endAdornment: (
          <InputAdornment position='start'>
            <BsPercent className='text-secondary' />
          </InputAdornment>
        ),
      },
    },
    percentageEnd: {
      inputProps: {
        style: { textAlign: 'left' },
        readOnly: true,
      },
      InputProps: {
        endAdornment: (
          <InputAdornment position='start'>
            <BsPercent className='text-secondary' />
          </InputAdornment>
        ),
        className: '!bg-grey-8',
      },
    },
    default: {
      inputProps: {
        'data-testid': `${testId}-input`,
      },
      InputProps: {
        endAdornment: <InputAdornment position='start' />,
      },
    },
  };

  const getVariantProps = (
    variant: ReadOnlyTextFieldVariantType | 'percentage'
  ) => variantProps[variant] || {};

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...rest}
          {...field}
          id={testId}
          {...(testId ? { 'data-testid': testId } : {})}
          onBlur={onBlur}
          label={label}
          value={inputValue}
          {...getVariantProps(variantType)}
          error={!!error}
          helperText={error?.message ?? ''}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => {
            const regex = /.*,\d{3}$/;
            const noDecimalRegex = /,/;
            if (
              regex.test(e.target.value) ||
              (!isDecimalAllowed && noDecimalRegex.test(e.target.value))
            ) {
              return;
            }
            if (
              e.target.value === '0' ||
              e.target.value.endsWith(',') ||
              e.target.value.endsWith(',0') ||
              e.target.value.endsWith('.')
            ) {
              setInputValue(e.target.value);
              field.onChange(formatPlainStringToCurrency(e.target.value));
            } else {
              const value = formatAmount(
                parseFloat(
                  e.target.value.replace(/[^0-9,]/g, '').replace(/,/, '.')
                )
              );
              setInputValue(value);
              field.onChange(formatPlainStringToCurrency(value));
            }
            if (onChange) {
              onChange(e);
            }
          }}
          onClick={onClick}
          disabled={disabled}
          required={required}
        />
      )}
    />
  );
};

export default DutchNumberInputField;
