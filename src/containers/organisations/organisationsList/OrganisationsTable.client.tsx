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
import { Organisations, OrganisationType, Phase, Status } from '@/types/api';
import { SearchParams } from '@/types/common';
import { deleteOrganisationsAction } from '@/utils/actions/formActions';
import { getAddressToDisplay } from '@/utils/common';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import { buildParams } from '@/utils/urlParams';

interface Props {
  organisations: Organisations;
  searchParams: SearchParams;
}

const OrganisationsTable: FC<Props> = ({ organisations, searchParams }) => {
  const router = useRouter();
  const t = useTranslations();

  const [, startTransition] = useTransition();

  const setQueryParam = useCallback(
    (queryParams: { [key: string]: string[] | string }, replace = true) => {
      const urlParams = new URLSearchParams(searchParams);
      Object.keys(queryParams).forEach((key) => {
        buildParams(urlParams, key, queryParams[key]);
      });
      const query = urlParams.toString() || '';
      const path = `/organisations?${query}`;
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

  const columns = [
    {
      field: 'name',
      header: t('common.name'),
      cellClassName: '!text-primary !font-semibold',
      headerClassName: '!min-w-[200px]',
      enableSort: true,
    },
    {
      field: 'type',
      header: t('filters.type'),
      cellClassName: 'sm:!break-all sm:!whitespace-pre-wrap',
      enableSort: true,
      renderValue: (row: { type?: OrganisationType }) =>
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

  const onSort = useCallback(
    (sortByValue: string, sortOrderValue: SORT_ORDER_VALUES | '') => {
      const urlParams = new URLSearchParams(searchParams);
      buildParams(urlParams, 'sortBy', sortByValue);
      buildParams(urlParams, 'sortOrder', sortOrderValue);
      const query = urlParams.toString() || '';
      const path = `/organisations?${query}`;

      router.replace(path);
    },
    [searchParams, router]
  );

  const organisationsData = organisations.data!;

  const rows = organisationsData?.map((data) => ({
    ...data,
    address: getAddressToDisplay(data.address!),
  }));

  const deleteOrganisations = async (id: string) => {
    const res = await deleteOrganisationsAction(id);
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
      testId: 'organisation-table-menu-edit-organisation',
      onClick: (_, id) => router.push(`organisations/${id}/edit`),
    },
    {
      id: 'delete',
      name: t('actionMenuItems.delete'),
      onClick: (_, id) => {
        deleteOrganisations(id as string);
      },
      testId: 'organisation-table-menu-edit-organisation',
    },
    {
      id: 'createQuotation',
      name: t('actionMenuItems.createQuotation'),
      testId: 'organisation-table-menu-edit-organisation',
      onClick: (_, id) => router.push(`quotations/quick?organisationId=${id}`),
      disabled: (index) => organisationsData[index]?.status === 'Inactive',
    },
  ];

  return (
    <div>
      <Table
        hasMenu
        rows={rows}
        onSort={onSort}
        columns={columns}
        menuItems={menuItems}
        testId='organisations-table'
        sortBy={searchParams?.sortBy || 'name'}
        onClick={(rowData) =>
          router.push(`/organisations/${rowData.id}/details`)
        }
        sortOrder={
          searchParams?.sortOrder || DEFAULT_LIST_QUERY_PARAMS.sortOrder
        }
      />
      {organisations.data!.length > 0 && (
        <TablePagination
          component='div'
          labelRowsPerPage={`${t('tableLabels.rows')}:`}
          count={organisations.count || 0}
          slotProps={{
            select: {
              id: 'organisation-table-pagination-select',
              labelId: 'organisation-table-pagination-select-label',
            },
          }}
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
          page={
            (Number(searchParams?.offset) || DEFAULT_LIST_QUERY_PARAMS.offset) /
            (Number(searchParams?.limit) || DEFAULT_LIST_QUERY_PARAMS.limit)
          }
          rowsPerPage={
            Number(searchParams?.limit) || DEFAULT_LIST_QUERY_PARAMS.limit
          }
          onRowsPerPageChange={(e) => {
            setQueryParam({
              offset: '0',
              limit:
                e.target.value.toString() ===
                DEFAULT_LIST_QUERY_PARAMS.limit.toString()
                  ? ''
                  : e.target.value.toString(),
            });
          }}
        />
      )}
    </div>
  );
};
export default OrganisationsTable;
