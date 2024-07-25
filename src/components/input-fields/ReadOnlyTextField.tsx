import { InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { FC } from 'react';
import { BsCurrencyEuro, BsPercent } from 'react-icons/bs';

import { formatAmountAfterRounding } from '@/utils/currency';

export type ReadOnlyTextFieldVariantType =
  | 'currency'
  | 'default'
  | 'percentage'
  | 'percentageEnd';

type ReadOnlyTextFieldProps = {
  variantType: ReadOnlyTextFieldVariantType;
  value: number | string;
  label: string;
  testId?: string;
} & TextFieldProps;

const variantProps: Record<ReadOnlyTextFieldVariantType, unknown> = {
  currency: {
    inputProps: {
      style: { textAlign: 'right' },
      readOnly: true,
    },
    InputProps: {
      startAdornment: (
        <InputAdornment position='start'>
          <BsCurrencyEuro className='text-secondary' />
        </InputAdornment>
      ),
      className: '!bg-grey-8',
    },
  },
  percentage: {
    inputProps: {
      style: { textAlign: 'right' },
      readOnly: true,
    },
    InputProps: {
      startAdornment: (
        <InputAdornment position='start'>
          <BsPercent className='text-secondary' />
        </InputAdornment>
      ),
      className: '!bg-grey-8',
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
  default: {},
};

const getVariantProps = (variant: ReadOnlyTextFieldVariantType) =>
  variantProps[variant] || {};

const ReadOnlyTextField: FC<ReadOnlyTextFieldProps> = ({
  label,
  value,
  testId = '',
  variantType = 'default',
  ...rest
}) => (
  <TextField
    data-testid={testId}
    {...rest}
    value={
      ['currency', 'percentage'].includes(variantType)
        ? formatAmountAfterRounding({ value: value as number })
        : value
    }
    disabled
    defaultValue={value}
    {...getVariantProps(variantType)}
    inputProps={{ 'data-testid': `${testId}-input` }}
    label={label}
  />
);

export default ReadOnlyTextField;
