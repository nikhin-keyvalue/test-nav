import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

import { getDateinDayjs } from '@/utils/date';

import { datePickerComponentTestIds } from '../../tests/e2e/constants/testIds';

const DatePickerWithController = <T extends FieldValues, S>({
  testId = '',
  name,
  control,
  label,
  required,
  ...rest
}: DatePickerProps<S> & {
  testId?: string;
  control: Control<T>;
  name: Path<T>;
  required?: boolean;
}) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { onChange, value }, fieldState: { error } }) => (
      <div className='w-full' data-testid={testId}>
        <DatePicker
          {...rest}
          onChange={onChange}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value={getDateinDayjs(value) as any}
          label={label}
          slotProps={{
            textField: {
              helperText: error?.message,
              error: Boolean(error?.message),
              required,
              inputProps: {
                'data-testid': `${testId}${datePickerComponentTestIds.datePickerInput}`,
              },
            },
          }}
        />
      </div>
    )}
  />
);

export default DatePickerWithController;
