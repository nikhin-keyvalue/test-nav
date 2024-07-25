'use server';

import {
  KVK_API_BASE_URL,
  KVK_API_KEY,
  POSTCODE_API_BASE_URL,
  POSTCODE_API_KEY,
  POSTCODE_API_SECRET,
} from '@/constants/env';
import { IOrganisationDetails } from '@/types/api';
import { crmServiceFetcher } from '@/utils/api';
import { getTraceId, getURLSearchParamsString } from '@/utils/common';

import {
  GETOrganisationByIdPathParameters,
  GETOrganisationByIdQueryParameters,
} from './type';

export const getOrganisationDetailsByKVKNum = async (kvkNumber: string) => {
  const kvkDetails = await fetch(
    `${KVK_API_BASE_URL}/basisprofielen/${kvkNumber}`,
    {
      headers: {
        'Content-Type': 'application/json',
        apikey: KVK_API_KEY as string,
      },
    }
  );
  return kvkDetails?.json();
};

export const getOrganisationDetailsById = async ({
  queryParams,
  pathParams,
}: {
  queryParams?: GETOrganisationByIdQueryParameters;
  pathParams: GETOrganisationByIdPathParameters;
}): Promise<IOrganisationDetails | null> => {
  try {
    const response = await crmServiceFetcher(
      `organisations/${pathParams.organisationId}${getURLSearchParamsString({ queryParams })}`
    );
    return response;
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('getOrganisationDetailsByIdServerActionFunction')
    );
    return null;
  }
};

export const getPostcodeContextBasedOnCountry = async (
  searchString: string,
  sessionId: string,
  context?: string,
  countryCode = 'nld'
) => {
  const url = `${POSTCODE_API_BASE_URL}/autocomplete/${
    context || countryCode.toLowerCase()
  }/${searchString}/en-GB`;
  const apiResponse = await fetch(url, {
    headers: {
      'X-Autocomplete-Session': sessionId,
      Authorization: `Basic ${btoa(
        `${POSTCODE_API_KEY}:${POSTCODE_API_SECRET}`
      )}`,
    },
  });

  return apiResponse?.json();
};

export const getPreciseAddressFromPostcode = async (
  context: string,
  sessionId: string
) => {
  const url = `${POSTCODE_API_BASE_URL}/address/${context}`;
  const apiResponse = await fetch(url, {
    headers: {
      'X-Autocomplete-Session': sessionId,
      Authorization: `Basic ${btoa(
        `${POSTCODE_API_KEY}:${POSTCODE_API_SECRET}`
      )}`,
    },
  });
  return apiResponse?.json();
};
