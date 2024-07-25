import { FormHelperText } from '@mui/material';
import { TimePicker, TimePickerProps } from '@mui/x-date-pickers/TimePicker';
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Path,
} from 'react-hook-form';

const TimePickerWithController = <T extends FieldValues>({
  testId,
  name,
  control,
  label,
  customError,
  required,
  ...rest
}: TimePickerProps<T> & {
  control: Control<T>;
  testId: string;
  name: Path<T>;
  customError?: FieldError;
  required?: boolean;
}) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { onChange, value }, fieldState: { error } }) => (
      <div className='w-full' data-testid={testId}>
        <TimePicker
          {...rest}
          onChange={onChange}
          value={value}
          label={label}
          slotProps={{
            textField: {
              required,
            },
          }}
        />
        {error?.message && (
          <>
            <hr className='-mt-0.5 h-[5px] rounded-md bg-primary' />
            <FormHelperText className='text-primary'>
              {error.message}
            </FormHelperText>
          </>
        )}
      </div>
    )}
  />
);

export default TimePickerWithController;
