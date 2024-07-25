'use client';

import {
  Paper,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  tableContainerClasses,
  TableHead,
  TableRow,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

import { NoData } from '..';
import EllipsisMenu from '../menus/EllipsisMenu';
import { SortableCell } from './components/SortableCell';
import { ITableProps, TableRowData } from './type';

const Table = <T extends TableRowData>({
  rows,
  sortBy,
  onSort,
  testId,
  columns,
  onClick,
  hasMenu,
  menuItems,
  sortOrder,
}: ITableProps<T>) => {
  const t = useTranslations();
  return (
    <TableContainer
      component={Paper}
      sx={{
        [`&.${tableContainerClasses.root}`]: {
          boxShadow: '0px 0px 16px 0px #323C4914',
        },
      }}
    >
      {rows?.length ? (
        <MuiTable
          sx={{
            minWidth: 640,
          }}
          aria-label='simple table'
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <SortableCell
                  sortBy={sortBy}
                  onSort={onSort}
                  column={column}
                  key={column.field}
                  sortOrder={sortOrder}
                />
              ))}
              {hasMenu && (
                <TableCell className='sticky right-0 border-l border-l-grey-8 bg-white sm:border-l-0'>
                  {' '}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody {...(testId ? { 'data-testid': `${testId}-body` } : {})}>
            {rows?.map((row, rowIndex) => (
              <TableRow
                key={row.id as string}
                sx={{
                  verticalAlign: 'top !important',
                  '&:last-child td, &:last-child th': { border: 0 },
                  cursor: 'pointer',
                }}
                onClick={() => onClick && onClick(row)}
                data-testid={`table-row-${rowIndex}`}
              >
                {columns.map((column, index) => (
                  <TableCell
                    key={column.field}
                    className={twMerge(
                      'border-l border-l-grey-8 sm:border-l-0',
                      column.cellClassName
                    )}
                    onClick={() =>
                      column.onClick && column.onClick(row, column)
                    }
                    data-testid={`table-column-${index}`}
                  >
                    {column.renderValue
                      ? column.renderValue(row, column)
                      : row[column.field] || '-'}
                  </TableCell>
                ))}
                {hasMenu && (
                  <TableCell
                    className='sticky right-0 border-l border-l-grey-8 bg-white sm:border-l-0'
                    onClick={(e) => e.stopPropagation()}
                  >
                    <EllipsisMenu
                      index={rowIndex}
                      entityId={row.id}
                      menuItems={menuItems}
                      testId={`table-row-${rowIndex}-ellipsis-menu-button`}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      ) : (
        <div
          data-testid={`${testId}-no-data`}
          className='h-[65vh] w-full items-center justify-center'
        >
          <NoData secondaryText={t('common.noDataDefaultSecondaryText')} />
        </div>
      )}
    </TableContainer>
  );
};

export default Table;
