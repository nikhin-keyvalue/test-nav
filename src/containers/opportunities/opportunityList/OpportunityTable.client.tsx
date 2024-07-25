'use client';

import TablePagination from '@mui/material/TablePagination';
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
import { deleteOpportunity } from '@/utils/actions/formActions';
import { getTraceId, mergeStrings } from '@/utils/common';
import {
  defaultAutoCloseTime,
  showErrorToast,
  showSuccessToast,
} from '@/utils/toast';
import { buildParams } from '@/utils/urlParams';

import { opportunityTestIds } from '../../../../tests/e2e/constants/testIds';
import {
  OpportunitiesResponse,
  opportunityDetails,
  OpportunityStatusType,
} from '../api/type';
import { OPPORTUNITY_STATUS } from '../constants';

type OpportunityTableProps = {
  opportunitiesResponse: OpportunitiesResponse;
  searchParams: SearchParams;
};

const OpportunityTable: FC<OpportunityTableProps> = ({
  opportunitiesResponse = {
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

  const opportunityTablecolumns = [
    {
      field: 'name',
      header: t('opportunities.opportunity'),
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
  ];

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

  const { data: opportunityListData = [], count: opportunityCount = 0 } =
    opportunitiesResponse;

  const {
    offset = DEFAULT_LIST_QUERY_PARAMS.offset,
    limit = DEFAULT_LIST_QUERY_PARAMS.limit,
    sortOrder = DEFAULT_LIST_QUERY_PARAMS.sortOrder,
    sortBy = 'name',
  } = searchParams;
  const page = Number(offset) / Number(limit);

  const opportunityList = () => {
    if (opportunityListData.length > 0) {
      return opportunityListData.map((opportunity: opportunityDetails) => ({
        id: opportunity.id,
        name: opportunity.name ?? '',
        status:
          t(`filters.${opportunity.status as OpportunityStatusType}`) ?? '',
        salespersons: opportunity?.salespersons
          ? mergeStrings({
              separator: ',\n',
              values: opportunity?.salespersons.map((salesperson) =>
                mergeStrings({
                  values: [salesperson?.firstName, salesperson?.lastName],
                })
              ),
            })
          : '',
        dealer: opportunity?.dealer?.dealerName ?? '',
        customer: mergeStrings({
          values: [
            opportunity?.customer?.firstName,
            opportunity?.customer?.middleName,
            opportunity?.customer?.lastName,
          ],
        }),
        type: formatPersonTypeText({
          organisationName: opportunity?.organisation?.name,
          type: opportunity?.type,
        }),
      }));
    }
    return [];
  };

  const deleteCurrentOpportunity = async ({
    currentOpportunityId,
  }: {
    currentOpportunityId: string | number | boolean | undefined;
  }) => {
    if (currentOpportunityId) {
      try {
        const response = await deleteOpportunity(
          currentOpportunityId.toString()
        );
        if (response?.ok) {
          showSuccessToast(t('common.savedSuccessfully'), {
            autoClose: defaultAutoCloseTime,
          });
        } else {
          showErrorToast(t('common.somethingWentWrong'), {
            autoClose: defaultAutoCloseTime,
          });
        }
      } catch (err) {
        console.log(
          'ERROR Something went wrong :',
          err,
          'AWS-XRAY-TRACE-ID=',
          getTraceId('deleteOpportunityFunction')
        );
        showErrorToast(t('common.somethingWentWrong'), {
          autoClose: defaultAutoCloseTime,
        });
      }
    }
  };

  const isOpportunityClosed = (
    status: OpportunityStatusType | undefined
  ): boolean =>
    status === OPPORTUNITY_STATUS.CLOSEDLOST ||
    status === OPPORTUNITY_STATUS.CLOSEDWON;

  const opportunityMenuItems: Item[] = [
    {
      id: 'edit',
      name: t('actionMenuItems.edit'),
      onClick: (_, id) => router.push(`opportunities/${id}/edit`),
      disabled: (index) =>
        isOpportunityClosed(opportunityListData[index]?.status),
      testId: opportunityTestIds.opportunityListPageEllipsisEdit,
    },

    {
      id: 'delete',
      name: t('actionMenuItems.delete'),
      onClick: (_, id) =>
        deleteCurrentOpportunity({ currentOpportunityId: id }),
      testId: opportunityTestIds.opportunityListPageEllipsisDelete,
    },
    {
      id: 'duplicate',
      name: t('actionMenuItems.duplicate'),
      onClick: (_, id) => router.push(`opportunities/${id}/duplicate`),
      testId: opportunityTestIds.opportunityListPageEllipsisDuplicate,
    },
    {
      id: 'createQuotation',
      name: t('actionMenuItems.createQuotation'),
      onClick: (_, id) => router.push(`quotations/quick?opportunityId=${id}`),
      disabled: (index) =>
        isOpportunityClosed(opportunityListData[index]?.status),
      testId: opportunityTestIds.opportunityListPageEllipsisCreateQuotation,
    },
  ];

  const setQueryParamFn = useCallback(
    (queryParams: { [key: string]: string[] | string }, replace = true) => {
      const urlParams = new URLSearchParams(searchParams);
      Object.keys(queryParams).forEach((key) => {
        buildParams(urlParams, key, queryParams[key]);
      });
      const query = urlParams.toString() || '';
      const path = `/opportunities?${query}`;
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
    const path = `/opportunities?${query}`;
    router.replace(path);
  };

  // TODO move routes to a common place
  const onTableRowClick = (rowData: TableRowData) => {
    router.push(`/opportunities/${rowData.id}/details`);
  };

  const isOpportunityListDataPresent = opportunityListData.length > 0;

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
        testId={opportunityTestIds.opportunityTable}
        rows={opportunityList()}
        columns={opportunityTablecolumns}
        hasMenu
        menuItems={opportunityMenuItems}
        sortOrder={sortOrder}
        sortBy={sortBy}
        onSort={onSort}
        onClick={onTableRowClick}
      />
      {isOpportunityListDataPresent && (
        <TablePagination
          slotProps={{
            select: {
              id: opportunityTestIds.opportunityTablePaginationSelect,
              labelId: opportunityTestIds.opportunityTablePaginationSelectLabel,
            },
          }}
          component='div'
          count={opportunityCount}
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

export default OpportunityTable;
