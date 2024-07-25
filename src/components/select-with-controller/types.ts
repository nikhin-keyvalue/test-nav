import { Control, FieldValues, Path } from 'react-hook-form';

interface ISelectWithControllerProps<
  T,
  TFieldValues extends FieldValues = FieldValues,
> {
  name: Path<TFieldValues>;
  label: string;
  className?: string;
  options: Array<T>;
  renderOption: (option: T) => React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, any>;
  disabled?: boolean;
  isBulk?: boolean;
  error?: boolean;
  helperText?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue?: any;
  testId: string;
  required?: boolean;
}

export type { ISelectWithControllerProps };
