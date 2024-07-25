import { DEFAULT_LIST_QUERY_PARAMS } from '@/constants/common';
import { SINGLE_VALUED_SEARCH_PARAMS } from '@/containers/persons/constants';
import { Organisations } from '@/types/api';
import { SearchParamKeys, SearchParams } from '@/types/common';
import { crmServiceFetcher } from '@/utils/api';
import { getTraceId, isBooleanPairPresent } from '@/utils/common';

import OrganisationsTableUI from './OrganisationsTable.client';

const queryParamBuilder = (searchParams: SearchParams) => {
  const filterParams = new URLSearchParams({
    ...DEFAULT_LIST_QUERY_PARAMS,
    ...searchParams,
    ...(searchParams.name && { email: searchParams.name }),
    ...(!searchParams?.sortBy && { sortBy: 'name' }),
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

const OrganisationsTable = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const getOrganisationsData = async () => {
    try {
      const organisations: Organisations = await crmServiceFetcher(
        `organisations?${queryParamBuilder(searchParams)}`
      );
      return organisations;
    } catch (errorResponse) {
      console.log(
        'ERROR Something went wrong :',
        errorResponse,
        'AWS-XRAY-TRACE-ID=',
        getTraceId('organisationListApiFunction')
      );
      return { data: [] };
    }
  };

  const organisations: Organisations = await getOrganisationsData();

  return (
    <OrganisationsTableUI
      organisations={organisations}
      searchParams={searchParams}
    />
  );
};

export default OrganisationsTable;
