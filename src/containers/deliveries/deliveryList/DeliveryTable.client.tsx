'use client';

import TablePagination from '@mui/material/TablePagination';
import { deliveryTestIds } from '@test/constants/testIds';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { FC, startTransition, useCallback } from 'react';

import { Item } from '@/components/menus/types';
import Table from '@/components/table/Table';
import { TableRowData } from '@/components/table/type';
import {
  DEFAULT_LIST_QUERY_PARAMS,
  SORT_ORDER_VALUES,
} from '@/constants/common';
import { PersonType, PersonTypeEnum, SearchParams } from '@/types/common';
import { mergeStrings } from '@/utils/common';
import { buildParams } from '@/utils/urlParams';

import { DeliveryStatusEnum } from '../api/constants';
import { DeliveriesResponse, Delivery } from '../api/type';

type DeliveryTableProps = {
  deliveriesResponse: DeliveriesResponse;
  searchParams: SearchParams;
};

const DeliveryTable: FC<DeliveryTableProps> = ({
  deliveriesResponse = {
    count: 0,
    limit: 10,
    offset: 0,
    data: [],
  },
  searchParams = {
    offset: DEFAULT_LIST_QUERY_PARAMS.offset.toString(),
    limit: DEFAULT_LIST_QUERY_PARAMS.limit.toString(),
    sortOrder: DEFAULT_LIST_QUERY_PARAMS.sortOrder,
    sortBy: 'name',
  },
}) => {
  const router = useRouter();
  const t = useTranslations();

  const deliveryTableColumns = [
    {
      field: 'name',
      header: t('deliveries.delivery'),
      cellClassName: '!text-primary !font-semibold',
      headerClassName: '!min-w-[120px]',
      enableSort: true,
    },
    {
      field: 'status',
      header: t('filters.status'),
      enableSort: true,
    },
    {
      field: 'salespersons',
      header: t('common.salespersons'),
      cellClassName: 'sm:!whitespace-pre-wrap',
    },
    {
      field: 'dealer',
      header: t('common.dealer'),
      enableSort: true,
      sortByKey: 'dealerName',
    },
    {
      field: 'customer',
      header: t('common.customer'),
      enableSort: true,
      sortByKey: 'customerName',
    },
    { field: 'type', header: t('common.customerType') },
    {
      field: 'opportunity',
      header: t('opportunities.opportunity'),
      enableSort: true,
      sortByKey: 'opportunityName',
    },
    {
      field: 'quotation',
      header: t('filters.Quotation'),
      enableSort: true,
      sortByKey: 'quotationName',
    },
  ];

  const { data: deliveryListData = [], count: deliveryCount = 0 } =
    deliveriesResponse;

  const {
    offset = DEFAULT_LIST_QUERY_PARAMS.offset,
    limit = DEFAULT_LIST_QUERY_PARAMS.limit,
    sortOrder = DEFAULT_LIST_QUERY_PARAMS.sortOrder,
    sortBy = 'name',
  } = searchParams;

  const page = Number(offset) / Number(limit);

  const formatPersonTypeText = ({
    type,
    organisationName = '',
  }: {
    type: PersonType;
    organisationName?: string;
  }): string =>
    type === PersonTypeEnum.Business
      ? t('personDetails.businessCustomer', { organisationName })
      : t('personDetails.privateCustomer');

  const deliveryList = () => {
    if (deliveryListData.length > 0) {
      return deliveryListData.map((delivery: Delivery) => ({
        id: delivery.id,
        name: delivery.name ?? '',
        status: t(`deliveries.deliveryStatus.${delivery.status}`),

        salespersons: delivery?.salespersons
          ? mergeStrings({
              separator: ',\n',
              values: delivery?.salespersons.map((salesperson) =>
                mergeStrings({
                  values: [salesperson?.firstName, salesperson?.lastName],
                })
              ),
            })
          : '',
        dealer: delivery?.dealer?.dealerName ?? '',
        customer: mergeStrings({
          values: [
            delivery?.customer?.firstName,
            delivery?.customer?.middleName,
            delivery?.customer?.lastName,
          ],
        }),
        type: formatPersonTypeText({
          organisationName: delivery?.organisation?.name,
          type: delivery?.opportunity?.type,
        }),
        quotation: delivery?.quotation?.proposalIdentifier ?? '',
        opportunity: delivery?.opportunity?.name ?? '',
      }));
    }
    return [];
  };

  const deliveryMenuItems: Item[] = [
    {
      id: 'edit',
      name: t('common.edit'),
      onClick: (_, id) => router.push(`deliveries/${id}/edit`),
      disabled: (index) =>
        deliveryListData[index]?.status === DeliveryStatusEnum.DELIVERED ||
        deliveryListData[index]?.status === DeliveryStatusEnum.ORDER_REJECTED,
      testId: deliveryTestIds.deliveryListPageEllipsisEdit,
    },
  ];

  const setQueryParamFn = useCallback(
    (queryParams: { [key: string]: string[] | string }, replace = true) => {
      const urlParams = new URLSearchParams(searchParams);
      Object.keys(queryParams).forEach((key) => {
        buildParams(urlParams, key, queryParams[key]);
      });
      const query = urlParams.toString() || '';
      const path = `/deliveries?${query}`;
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

  const onSort = (
    sortByValue: string,
    sortOrderValue: SORT_ORDER_VALUES | ''
  ) => {
    const urlParams = new URLSearchParams(searchParams);
    buildParams(urlParams, 'sortBy', sortByValue);
    buildParams(urlParams, 'sortOrder', sortOrderValue);
    const query = urlParams.toString() || '';
    const path = `/deliveries?${query}`;
    router.replace(path);
  };

  // TODO move routes to a common place
  const onTableRowClick = (rowData: TableRowData) => {
    router.push(`/deliveries/${rowData.id}/details`);
  };

  const isDeliveryListDataPresent = deliveryListData.length > 0;

  const onPageChange = (
    e: React.MouseEvent<HTMLButtonElement> | null,
    currentPage: number
  ) => {
    setQueryParamFn(
      {
        offset:
          currentPage === 0 ? '' : (currentPage * Number(limit)).toString(),
      },
      false
    );
  };

  const onRowsPerPageChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setQueryParamFn({
      offset: '0',
      limit:
        e.target.value.toString() === DEFAULT_LIST_QUERY_PARAMS.limit.toString()
          ? ''
          : e.target.value.toString(),
    });
  };

  return (
    <>
      <Table
        rows={deliveryList()}
        columns={deliveryTableColumns}
        hasMenu
        menuItems={deliveryMenuItems}
        sortOrder={sortOrder}
        sortBy={sortBy}
        onSort={onSort}
        onClick={onTableRowClick}
      />
      {isDeliveryListDataPresent && (
        <TablePagination
          slotProps={{
            select: {
              id: deliveryTestIds.deliveryTablePaginationSelect,
              labelId: deliveryTestIds.deliveryTablePaginationSelectLabel,
            },
          }}
          component='div'
          count={deliveryCount}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={Number(limit)}
          onRowsPerPageChange={onRowsPerPageChange}
          labelRowsPerPage={`${t('tableLabels.rows')}:`}
        />
      )}
    </>
  );
};

export default DeliveryTable;
