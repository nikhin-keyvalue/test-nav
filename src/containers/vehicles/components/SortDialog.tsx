import { Typography } from '@AM-i-B-V/ui-kit';
import { Button, Radio } from '@mui/material';
import { useTranslations } from 'next-intl';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { MdSwapVert } from 'react-icons/md';

import CustomDialog from '@/components/Dialog';

import { SORT_OPTIONS, SortFilter, SortOptions } from '../constants';

const Option = ({
  value,
  label,
  checked,
  onChange,
}: {
  value: string;
  label: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className='flex items-center'>
    <Radio
      id={value}
      color='secondary'
      checked={checked}
      value={value}
      onChange={onChange}
      size='small'
      className='py-0 pl-0 pr-1.5'
      disableRipple
    />
    <label className='cursor-pointer text-[15px]' htmlFor={value}>
      {label}
    </label>
  </div>
);

const getOptionFromString = (value: SortFilter) => {
  const option = value;
  const splittedOption = option.split(',');
  return {
    option: splittedOption[0] as SortOptions,
    isAscending: splittedOption[1] === 'asc',
  };
};

const SortDialog = ({
  currentSortOption,
  onApplySort,
}: {
  currentSortOption: SortFilter;
  onApplySort: (newFilter: SortFilter) => void;
}) => {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  // Keeping this ref to distinguish between cancel and apply while closing dialog to reset selection while cancelling
  const isApply = useRef(false);
  const currentSortOptions = getOptionFromString(currentSortOption);
  const [selectedSortOption, setSelectedSortOption] = useState<SortOptions>(
    currentSortOptions.option
  );
  const [isAscending, setIsAscending] = useState(
    currentSortOptions.isAscending
  );

  // This will ensure that even if the current sort option is changed by external components,
  // the internal state will be in sync with the option in search params
  useEffect(() => {
    setSelectedSortOption(currentSortOptions.option);
    setIsAscending(currentSortOptions.isAscending);
  }, [currentSortOptions.isAscending, currentSortOptions.option]);

  const applyFilter = () => {
    isApply.current = true;
    onApplySort(`${selectedSortOption},${isAscending ? 'asc' : 'desc'}`);
    setOpen(false);
  };

  return (
    <div>
      <Button
        color='secondary'
        variant='outlined'
        className='box-border min-w-0 p-2 px-2.5 normal-case lg:py-1.5'
        data-testid='sortDialogTrigger'
        onClick={() => setOpen(true)}
      >
        <MdSwapVert size={20} />
        <Typography variant='titleSmallBold' className='ml-1.5 hidden lg:block'>
          {t('stock.filters.sorting')}
        </Typography>
      </Button>

      <CustomDialog
        headerElement={t('stock.filters.sorting')}
        submitText={t('stock.filters.sorting')}
        onSubmit={applyFilter}
        isOpen={open}
        onClose={() => setOpen(false)}
      >
        <div data-testid='sortDialogContent'>
          <div className='grid grid-cols-2 gap-x-1 gap-y-4'>
            {SORT_OPTIONS.map((option) => (
              <Option
                key={option}
                value={option}
                label={t(`stock.filterOptions.sortBy.${option}`)}
                checked={option === selectedSortOption}
                onChange={(event) =>
                  setSelectedSortOption(event.target.value as SortOptions)
                }
              />
            ))}
          </div>
          <div className='my-4 h-[1px] w-full bg-secondary-300' />
          <div className='grid grid-cols-2'>
            <Option
              value='ascending'
              checked={isAscending}
              label={t('stock.filterOptions.sortBy.asc')}
              onChange={() => setIsAscending(true)}
            />
            <Option
              value='descending'
              checked={!isAscending}
              label={t('stock.filterOptions.sortBy.desc')}
              onChange={() => setIsAscending(false)}
            />
          </div>
        </div>
      </CustomDialog>
    </div>
  );
};

export default SortDialog;
