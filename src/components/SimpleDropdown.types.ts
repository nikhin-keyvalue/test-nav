import { ChangeEventHandler } from 'react';

import { FiltersDataKeys } from '@/containers/vehicles/constants';

interface Option {
  id: string;
  displayValue: string;
}

interface ISimpleDropdownProps {
  options?: Option[];
  label: string;
  value: string[] | string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  name?: string;
  multiple?: boolean;
  className?: string;
  tName?: FiltersDataKeys;
  dataTestId: string;
}

export type { ISimpleDropdownProps };
