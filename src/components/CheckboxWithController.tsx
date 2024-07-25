import {
  Checkbox,
  CheckboxProps,
  FormControlLabel,
  FormControlLabelProps,
} from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

const CheckboxWithController = <T extends FieldValues>({
  labelProps: { label, labelTestId, ...restLabelProps },
  checkboxProps: {
    name,
    control,
    checkboxTestId = 'checkhere',
    ...restCheckboxProps
  },
}: {
  labelProps: Omit<FormControlLabelProps, 'control'> & { labelTestId?: string };
  checkboxProps: CheckboxProps & {
    checkboxTestId?: string;
    control: Control<T>;
    name: Path<T>;
  };
}) => (
  <FormControlLabel
    control={
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Checkbox
            {...field}
            color='secondary'
            checked={field.value}
            data-testid={checkboxTestId}
            {...restCheckboxProps}
          />
        )}
      />
    }
    label={label}
    data-testid={labelTestId}
    {...restLabelProps}
  />
);

export default CheckboxWithController;
