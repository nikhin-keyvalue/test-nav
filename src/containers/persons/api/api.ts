'use server';

import { PersonsDetails } from '@/types/api';
import { crmServiceFetcher } from '@/utils/api';
import { getTraceId, getURLSearchParamsString } from '@/utils/common';

import {
  GETPersonByIdPathParameters,
  GETPersonByIdQueryParameters,
} from './type';

export const getPersonDetailsById = async ({
  queryParams,
  pathParams,
}: {
  queryParams?: GETPersonByIdQueryParameters;
  pathParams: GETPersonByIdPathParameters;
}): Promise<PersonsDetails | null> => {
  try {
    const response = await crmServiceFetcher(
      `persons/${pathParams.personId}${getURLSearchParamsString({ queryParams })}`
    );
    return response;
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('getPersonDetailsByIdApiFunctionCall')
    );
    return null;
  }
};
