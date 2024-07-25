import { InputAdornment } from '@mui/material';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { ChangeEvent } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { BsPercent } from 'react-icons/bs';

import { nullFn } from '@/constants/common';
import { VoidFnType } from '@/types/common';

const PercentageInputField = <T extends FieldValues>({
  control,
  name,
  label,
  disabled = false,
  onClick = nullFn,
  onChange = nullFn,
  onBlur = nullFn,
  ...rest
}: TextFieldProps & {
  control: Control<T>;
  name: Path<T>;
  label: string;
  disabled?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClick?: VoidFnType;
}) => (
  <Controller
    disabled={disabled}
    name={name}
    control={control}
    render={({ field, fieldState: { error } }) => (
      <TextField
        {...rest}
        type='number'
        label={label}
        {...field}
        onBlur={onBlur}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          style: { textAlign: 'left' },
          max: 100,
          min: 0,
        }}
        error={!!error}
        helperText={error?.message ?? ''}
        InputProps={{
          endAdornment: (
            <InputAdornment position='start'>
              <BsPercent className='text-secondary' />
            </InputAdornment>
          ),
        }}
        onClick={onClick}
        // onChange={(e) => {
        //   field.onChange(e);
        //   setValue(
        //     '<co-related form field name>',
        //     formatAmount(
        //       (priceEditValues?.retailPrice || 0) -
        //         getDiscountPercentageAmount(Number(e.target.value)) -
        //         (priceEditValues?.discountAmount || 0)
        //     )
        //   );
        // }}
      />
    )}
  />
);

export default PercentageInputField;
