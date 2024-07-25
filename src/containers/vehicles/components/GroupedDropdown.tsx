'use client';

import { Autocomplete, autocompleteClasses, TextField } from '@mui/material';
import { useMemo } from 'react';
import { MdManageSearch } from 'react-icons/md';

import { GroupListItem } from '../constants';

const GroupedDropdown = ({
  options,
  value,
  name,
  label,
  onChange,
}: {
  options: Array<GroupListItem>;
  value: string[];
  label: string;
  name: string;
  onChange: (name: string, value: Array<string>) => void;
}) => {
  const getLabel = (item: GroupListItem) => item?.displayValue || '';

  const formattedValue = useMemo(
    () => options.filter(({ id }) => id && value.includes(id)),
    [options, value]
  );

  return (
    <Autocomplete
      options={options}
      groupBy={(option) => option.parentDisplayValue!}
      disablePortal
      disableCloseOnSelect
      multiple
      fullWidth
      filterSelectedOptions
      getOptionLabel={getLabel}
      value={formattedValue}
      ListboxProps={{
        sx: {
          [`& .${autocompleteClasses.groupLabel}`]: {
            lineHeight: '30px',
          },
        },
      }}
      sx={{
        [`& .${autocompleteClasses.popupIndicator}`]: {
          transform: 'none',
        },
      }}
      popupIcon={<MdManageSearch size={24} />}
      renderInput={(params) => <TextField {...params} label={label} />}
      onChange={(_, newValue) =>
        onChange(
          name,
          newValue.map(({ id }) => String(id))
        )
      }
    />
  );
};

export default GroupedDropdown;
