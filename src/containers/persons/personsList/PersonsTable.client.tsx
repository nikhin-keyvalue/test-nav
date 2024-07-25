'use client';

import { TablePagination } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { FC, useCallback, useTransition } from 'react';

import { Item } from '@/components/menus/types';
import Table from '@/components/table/Table';
import {
  DEFAULT_LIST_QUERY_PARAMS,
  SORT_ORDER_VALUES,
} from '@/constants/common';
import { Persons, Phase, Status } from '@/types/api';
import { PersonType, SearchParams } from '@/types/common';
import { deletePersonAction } from '@/utils/actions/formActions';
import { getAddressToDisplay } from '@/utils/common';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import { buildParams } from '@/utils/urlParams';

interface Props {
  persons: Persons;
  searchParams: SearchParams;
}

const PersonsTable: FC<Props> = ({ persons, searchParams }) => {
  const router = useRouter();
  const t = useTranslations();

  const [, startTransition] = useTransition();
  const columns = [
    {
      field: 'firstName',
      header: t('common.firstName'),
      cellClassName: '!text-primary !font-semibold',
      headerClassName: '!min-w-[120px]',
      enableSort: true,
    },
    {
      field: 'middleName',
      header: t('common.middleName'),
      cellClassName: '!text-primary !font-semibold',
    },
    {
      field: 'lastName',
      header: t('common.lastName'),
      cellClassName: '!text-primary !font-semibold',
      enableSort: true,
    },
    {
      field: 'type',
      header: t('filters.type'),
      cellClassName: 'sm:!break-all sm:!whitespace-pre-wrap',
      enableSort: true,
      renderValue: (row: { type?: PersonType }) =>
        row.type ? t(`filters.${row.type}`) : '',
    },
    {
      field: 'phase',
      header: t('filters.phase'),
      renderValue: (row: { phaseCount?: number; phase?: Phase }) => (
        <div className='flex'>
          <div className='mr-2 h-[21px] w-[21px] rounded-[4px] bg-secondary text-center text-white'>
            {row.phaseCount}
          </div>
          {row.phase ? t(`filters.${row.phase}`) : ''}
        </div>
      ),
      enableSort: true,
    },
    {
      field: 'email',
      header: t('common.email'),
      cellClassName: 'sm:!break-all sm:!whitespace-pre-wrap',
      enableSort: true,
    },
    {
      field: 'phoneNumber',
      header: t('common.telephone'),
      enableSort: true,
      sortByKey: 'phone',
    },
    {
      field: 'address',
      header: t('common.location'),
      cellClassName: 'sm:!break-all sm:!whitespace-pre-wrap',
    },
    {
      field: 'status',
      header: t('filters.status'),
      renderValue: (row: { status?: Status }) => (
        <div className={`${row.status === 'Inactive' ? 'text-grey-56' : ''}`}>
          {row.status ? t(`filters.${row.status}`) : ''}
        </div>
      ),
    },
  ];

  const setQueryParam = useCallback(
    (queryParams: { [key: string]: string[] | string }, replace = true) => {
      const urlParams = new URLSearchParams(searchParams);
      Object.keys(queryParams).forEach((key) => {
        buildParams(urlParams, key, queryParams[key]);
      });
      const query = urlParams.toString() || '';
      const path = `/persons?${query}`;
      startTransition(() => {
        if (replace) {
          router.replace(path);
        } else {
          router.push(path);
        }
      });
    },
    [searchParams, router]
  );

  const onSort = useCallback(
    (sortByValue: string, sortOrderValue: SORT_ORDER_VALUES | '') => {
      const urlParams = new URLSearchParams(searchParams);
      buildParams(urlParams, 'sortBy', sortByValue);
      buildParams(urlParams, 'sortOrder', sortOrderValue);
      const query = urlParams.toString() || '';
      const path = `/persons?${query}`;

      router.replace(path);
    },
    [searchParams, router]
  );

  const rows = persons?.data?.map((data) => ({
    ...data,
    address: getAddressToDisplay(data.address!),
  }));

  const deletePerson = async (id: string) => {
    const res = await deletePersonAction(id);
    if (res?.errorCode === 'CASCADE_DELETE_FAILED') {
      showErrorToast(t('actionMenuItems.cascadingDeleteFailed'));
    } else if (res !== null) {
      showErrorToast(t('common.somethingWentWrong'));
    } else {
      showSuccessToast(t('common.savedSuccessfully'));
    }
  };

  const menuItems: Item[] = [
    {
      id: 'edit',
      name: t('actionMenuItems.edit'),
      onClick: (_, id) => router.push(`persons/${id}/edit`),
      testId: 'person-table-menu-edit-person',
    },
    {
      id: 'delete',
      name: t('actionMenuItems.delete'),
      onClick: (_, id) => {
        deletePerson(id as string);
      },
      testId: 'person-table-menu-delete-person',
    },
    {
      id: 'createQuotation',
      name: t('actionMenuItems.createQuotation'),
      onClick: (_, id) => router.push(`quotations/quick?personId=${id}`),
      disabled: (index) => persons.data?.[index]?.status === 'Inactive',
      testId: 'person-table-menu-create-quotation',
    },
  ];

  return (
    <div>
      <Table
        rows={rows || []}
        columns={columns}
        hasMenu
        menuItems={menuItems}
        onSort={onSort}
        sortOrder={
          searchParams?.sortOrder || DEFAULT_LIST_QUERY_PARAMS.sortOrder
        }
        sortBy={searchParams?.sortBy || 'firstName'}
        onClick={(rowData) => router.push(`/persons/${rowData.id}/details`)}
      />
      {persons.data!.length > 0 && (
        <TablePagination
          slotProps={{
            select: {
              id: 'person-table-pagination-select',
              labelId: 'person-table-pagination-select-label',
            },
          }}
          component='div'
          labelRowsPerPage={`${t('tableLabels.rows')}:`}
          count={persons.count || 0}
          page={
            (Number(searchParams?.offset) || DEFAULT_LIST_QUERY_PARAMS.offset) /
            (Number(searchParams?.limit) || DEFAULT_LIST_QUERY_PARAMS.limit)
          }
          onPageChange={(e, page) => {
            setQueryParam(
              {
                offset:
                  page === 0
                    ? ''
                    : (
                        page * Number(searchParams.limit) ||
                        page * DEFAULT_LIST_QUERY_PARAMS.limit
                      ).toString(),
              },
              false
            );
          }}
          rowsPerPage={
            Number(searchParams?.limit) || DEFAULT_LIST_QUERY_PARAMS.limit
          }
          onRowsPerPageChange={(e) =>
            setQueryParam({
              offset: '0',
              limit:
                e.target.value.toString() ===
                DEFAULT_LIST_QUERY_PARAMS.limit.toString()
                  ? ''
                  : e.target.value.toString(),
            })
          }
        />
      )}
    </div>
  );
};
export default PersonsTable;
