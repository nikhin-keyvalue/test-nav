import {
  Checkbox,
  checkboxClasses,
  MenuItem,
  menuItemClasses,
  TextField,
} from '@mui/material';
import React from 'react';

import { tNamespaceMap } from '@/containers/vehicles/constants';
import { useDynamicTranslations } from '@/hooks/translation';

import { ISimpleDropdownProps } from './SimpleDropdown.types';

interface SelectDisplayPropsWithTestId
  extends React.HTMLAttributes<HTMLDivElement> {
  'data-testid'?: string;
}

const SimpleDropdown = ({
  options,
  label,
  value,
  onChange,
  name,
  multiple = true,
  className,
  tName,
  dataTestId,
}: ISimpleDropdownProps) => {
  const selectDisplayProps: SelectDisplayPropsWithTestId = {
    'data-testid': dataTestId,
  };
  const hasNamespace = tName ? !!tNamespaceMap[tName].length : false;
  const t = useDynamicTranslations(
    hasNamespace && tName ? tNamespaceMap[tName] : 'filters'
  );
  const getLabel = (item: string) => t(`${item}`);

  return (
    <TextField
      label={label}
      variant='filled'
      select
      fullWidth
      SelectProps={{
        MenuProps: { disablePortal: true },
        ...(selectDisplayProps?.['data-testid']
          ? { SelectDisplayProps: selectDisplayProps }
          : {}),
        multiple,
        renderValue: (selected) => {
          if (name === 'isActive')
            return (selected as string[])
              .map((item) => (item === 'true' ? 'Active' : 'Inactive'))
              .join(', ');
          return (selected as string[]).map(getLabel).join(', ');
        },
      }}
      value={value}
      onChange={onChange}
      name={name}
      className={className}
    >
      {options?.length &&
        options.map((item) => (
          <MenuItem
            sx={{
              [`&.${menuItemClasses.selected}`]: {
                backgroundColor: '#EFEFF0 !important',
                color: '#323C49 !important',
              },
            }}
            data-testid={`${dataTestId}-${item?.displayValue?.replace(/\s+/g, '').toLowerCase()}`}
            value={item.id}
            key={item.id}
          >
            {multiple && (
              <Checkbox
                sx={{
                  [`&.${checkboxClasses.checked}`]: {
                    color: '#323C49',
                  },
                }}
                checked={value.indexOf(item.id) > -1}
              />
            )}
            {item.displayValue}
          </MenuItem>
        ))}
    </TextField>
  );
};

export default SimpleDropdown;
