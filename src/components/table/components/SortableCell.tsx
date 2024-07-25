import { IconButton, TableCell } from '@mui/material';
import { MdArrowDownward, MdArrowUpward } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';

import If from '@/components/If';
import { SORT_ORDER_VALUES } from '@/constants/common';

import { DisplayValueType, IColumn, TableRowData } from '../type';

export interface SortableCellProps<T> {
  column: IColumn<T, DisplayValueType>;
  onSort: (sortByValue: string, sortOrderValue: SORT_ORDER_VALUES | '') => void;
  sortOrder: string;
  sortBy: string;
}

export const SortableCell = <T extends TableRowData>({
  column,
  sortBy,
  sortOrder,
  onSort,
}: SortableCellProps<T>) => {
  const { sortByKey, headerClassName, header, enableSort, field } = column;
  const columnSortKey = sortByKey ?? field;

  const handleSortClick = () => {
    const nextSortOrder =
      sortBy === columnSortKey && sortOrder === SORT_ORDER_VALUES.ASCENDING
        ? SORT_ORDER_VALUES.DESCENDING
        : SORT_ORDER_VALUES.ASCENDING;
    onSort(columnSortKey, nextSortOrder);
  };

  return (
    <TableCell
      className={twMerge(
        'border-l border-l-grey-8 sm:border-l-0 font-semibold',
        headerClassName
      )}
      key={field}
      data-testid={`${field}-column-header`}
    >
      <div className='flex items-center gap-1'>
        {header}
        <If condition={!!enableSort}>
          <IconButton
            size='small'
            className={`p-0 ${
              sortBy === columnSortKey ? 'text-secondary' : 'text-grey-56'
            }`}
            onClick={handleSortClick}
          >
            {sortBy === columnSortKey &&
            sortOrder === SORT_ORDER_VALUES.ASCENDING ? (
              <MdArrowDownward />
            ) : (
              <MdArrowUpward />
            )}
          </IconButton>
        </If>
      </div>
    </TableCell>
  );
};
