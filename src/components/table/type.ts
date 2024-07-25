import { SORT_ORDER_VALUES } from '@/constants/common';

import { Item } from '../menus/types';

export type DisplayValueType = string | number | boolean | React.ReactElement;

export interface IColumn<
  TData,
  TType extends DisplayValueType = React.ReactElement | string,
> {
  field: string;
  header: string;
  cellClassName?: string;
  headerClassName?: string;
  onClick?: (row: TData, col: IColumn<TData, TType>) => void;
  renderValue?: (row: TData, col: IColumn<TData, TType>) => React.ReactNode;
  enableSort?: boolean;
  sortByKey?: string;
}

export interface TableRowData {
  [key: string]: string | number | boolean;
}

export interface ITableProps<T> {
  columns: IColumn<T, DisplayValueType>[];
  onClick?: (row: T) => void;
  rows: T[];
  hasMenu: boolean;
  menuItems: Item[];
  onSort: (sortByValue: string, sortOrderValue: SORT_ORDER_VALUES | '') => void;
  sortOrder: string;
  sortBy: string;
  testId?: string;
}
