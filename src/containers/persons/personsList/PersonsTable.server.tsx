import { DEFAULT_LIST_QUERY_PARAMS } from '@/constants/common';
import { Persons } from '@/types/api';
import { SearchParamKeys, SearchParams } from '@/types/common';
import { crmServiceFetcher } from '@/utils/api';
import { getTraceId, isBooleanPairPresent } from '@/utils/common';

import { SINGLE_VALUED_SEARCH_PARAMS } from '../constants';
import PersonsTableUI from './PersonsTable.client';

const queryParamBuilder = (searchParams: SearchParams) => {
  const filterParams = new URLSearchParams({
    ...DEFAULT_LIST_QUERY_PARAMS,
    ...searchParams,
    ...(searchParams.name && { email: searchParams.name }),
    ...(!searchParams?.sortBy && { sortBy: 'firstName' }),
  });

  // If both Active and Inactive is selected for status filter, don't send it in query-params
  if (isBooleanPairPresent(searchParams?.isActive)) {
    filterParams.delete('isActive');
  }

  const multiValueParams = Object.keys(searchParams).filter(
    (key) =>
      !SINGLE_VALUED_SEARCH_PARAMS.includes(key) &&
      searchParams[key as SearchParamKeys]?.includes(',')
  ) as SearchParamKeys[];
  multiValueParams.forEach((key) => {
    filterParams.delete(key);

    if (searchParams[key]) {
      searchParams[key].split(',').forEach((value) => {
        filterParams.append(key, value);
      });
    }
  });

  return filterParams.toString();
};

const PersonsTable = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  let persons: Persons;
  try {
    persons = await crmServiceFetcher(
      `persons?${queryParamBuilder(searchParams)}`
    );
  } catch (errorResponse) {
    // TODO: Remove console and handle error
    console.log(
      'ERROR Something went wrong :',
      errorResponse,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('personListApiFunction')
    );
    persons = { data: [] };
  }

  return <PersonsTableUI persons={persons} searchParams={searchParams} />;
};

export default PersonsTable;
