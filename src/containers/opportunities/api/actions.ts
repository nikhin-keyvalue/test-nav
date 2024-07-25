'use server';

import { DOCUMENTS_SERVICE_BASE_URL } from '@/constants/env';
import { SearchParams } from '@/types/common';
import {
  crmServiceFetcher,
  documentServiceFetcher,
  fetchAwsCognitoToken,
  fetchStream,
  metaFactoryFetcher,
} from '@/utils/api';
import {
  getTraceId,
  getURLSearchParamsString,
  queryParamBuilder,
} from '@/utils/common';
import { getTokenDecodedValues } from '@/utils/tokenDecodeAction';

import {
  DealerDetails,
  GETOpportunityByIdPathParameter,
  GETOpportunityByIdQueryParameter,
  OpportunitiesResponse,
  OpportunityDetails,
} from './type';

export const getOpportunities = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  let opportunities: OpportunitiesResponse;

  try {
    opportunities = await crmServiceFetcher(
      `opportunities?${queryParamBuilder(searchParams, 'name')}`
    );
  } catch (errorResponse) {
    // TODO: Remove console and handle error
    console.log(
      'ERROR Something went wrong :',
      errorResponse,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('getOpportunitiesServerAction')
    );
    opportunities = { data: [] };
  }
  return opportunities;
};

export const getOpportunityDetailsById = async ({
  queryParams,
  pathParams,
}: {
  queryParams?: GETOpportunityByIdQueryParameter;
  pathParams: GETOpportunityByIdPathParameter;
}) => {
  let opportunityDetails: OpportunityDetails;
  try {
    opportunityDetails = await crmServiceFetcher(
      `opportunities/${pathParams.opportunityId}${getURLSearchParamsString({ queryParams })}`,
      {
        next: { tags: ['opportunityDetails'] },
      }
    );
    return opportunityDetails;
  } catch (errorResponse) {
    // TODO: Remove console and handle error
    console.log(
      'ERROR Something went wrong :',
      errorResponse,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('getOpportunitiesByIdServerAction')
    );
    return null;
  }
};

export const getDocumentData = async (id: string | number) => {
  const token = await fetchAwsCognitoToken();
  const headers = {
    ...((await getTokenDecodedValues('tenantUserIdHeader')) || {}),
    Authorization: `Bearer ${token}`,
  };

  return fetchStream(
    `${DOCUMENTS_SERVICE_BASE_URL}/opportunities/${id}/documents`,
    {
      cache: 'no-cache',
      headers: {
        ...headers,
      },
    }
  );
};

export const getOpportunityDocumentCategory = async () => {
  const headers = {
    ...(await getTokenDecodedValues('tenantUserIdHeader')),
    'Content-Type': 'application/json',
  };

  const fetchOptions: RequestInit = {
    cache: 'no-store',
    headers,
  };
  return documentServiceFetcher(
    `documents/subcategory-group?entityType=Opportunity`,
    fetchOptions
  );
};

export const getDealerDetails = async ({
  dealerId,
}: {
  dealerId: string;
}): Promise<DealerDetails> => {
  try {
    const res = await metaFactoryFetcher(
      `/api/stockmgmt/dealer/${dealerId}`,
      undefined,
      {
        format: false,
        throwError: false,
      }
    );

    if (res.ok) {
      const resData = await res.json();
      const data: DealerDetails = {
        ...resData,
        success: true,
      };

      return data;
    }
    console.log(
      'something went wrong',
      res,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('getDealerDetailsTryServerAction')
    );
  } catch (err) {
    console.log(
      'ERROR Something went wrong :',
      err,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('getDealerDetailsCatchServerAction')
    ); // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { success: false } as any;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { success: false } as any;
};
