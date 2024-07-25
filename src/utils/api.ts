// eslint-disable-next-line import/no-extraneous-dependencies
import { trace } from '@opentelemetry/api';
import { revalidateTag } from 'next/cache';

import {
  AWS_AUTH_BASE_URL,
  AWS_CLIENT_ID,
  AWS_CLIENT_SECRET,
  CIC_PASSWORD,
  CIC_USERNAME,
  CRM_SERVICE_BASE_URL,
  DOCUMENTS_SERVICE_BASE_URL,
  IMAGE_SERVICE_BASE_URL,
  LOCAL_DEVELOPMENT_MODE,
  META_FACTORY_BASE_URL,
} from '@/constants/env';
import { OpportunityDocumentResponse } from '@/containers/opportunities/types';
import { ErrorObjectType } from '@/types/api';
import { RequestInit } from '@/types/common';

import { getAuthCookie } from './cookieActions';
import { apiLogger } from './logger';
import { getTokenDecodedValues } from './tokenDecodeAction';

type ExtraOptionsType = { format?: boolean; throwError?: boolean };

type FetcherArgsType = {
  url: string;
  fetchOptions: RequestInit;
  extraOptions?: ExtraOptionsType;
};

const defaultExtraOptions: ExtraOptionsType = {
  format: true,
  throwError: true,
};

export const fetcher = async ({
  url,
  fetchOptions,
  extraOptions = defaultExtraOptions,
}: FetcherArgsType) => {
  const response = await fetch(url, fetchOptions);
  if (LOCAL_DEVELOPMENT_MODE) {
    apiLogger({
      extraOptions,
      url,
      fetchOptions,
      response: response.clone(),
    });
  }

  if (!response.ok && extraOptions.throwError) {
    let formattedResponse;
    try {
      formattedResponse = await response.json();
    } catch (err) {
      formattedResponse = null;
    }
    const errorObject: ErrorObjectType = {
      url,
      isOk: response.ok,
      message:
        formattedResponse?.description || formattedResponse?.message || '',
      statusText: response.statusText,
      statusCode: response.status,
      errorCode: formattedResponse.errorCode || '',
    };
    throw errorObject;
  }

  if (extraOptions.format) {
    return response.json();
  }

  return response;
};

export const fetchAwsCognitoToken = async () => {
  const base64Auth = Buffer.from(
    `${AWS_CLIENT_ID}:${AWS_CLIENT_SECRET}`
  ).toString('base64');
  const startTime = performance.now();
  const req = await fetcher({
    url: `${AWS_AUTH_BASE_URL}/oauth2/token?grant_type=client_credentials`,
    fetchOptions: {
      cache: 'force-cache',
      method: 'POST',
      headers: {
        Authorization: `Basic ${base64Auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      next: { tags: ['awsToken'] },
    },
  });

  // eslint-disable-next-line no-console
  console.log(
    'Fetch time for AWS Cognito endpoint :',
    performance.now() - startTime
  );

  return req?.access_token;
};

const fetchWithAwsCognitoTokenHelper = async ({
  url,
  fetchOptions,
  extraOptions,
}: FetcherArgsType) => {
  const token = await fetchAwsCognitoToken();

  const headers = {
    ...fetchOptions.headers,
    Authorization: `Bearer ${token}`,
  };
  const modifiedFetchoptions: RequestInit = {
    ...fetchOptions,
    headers,
  };

  const response = await fetcher({
    url,
    fetchOptions: modifiedFetchoptions,
    extraOptions,
  });

  return response;
};

const fetchWithAwsCognitoToken = async ({
  url,
  fetchOptions,
  extraOptions,
}: FetcherArgsType) => {
  const modifiedFetchoptions: RequestInit = {
    cache: 'no-store',
    ...fetchOptions,
  };
  let isTokenExpired;
  let response;

  try {
    response = await fetchWithAwsCognitoTokenHelper({
      url,
      fetchOptions: modifiedFetchoptions,
      extraOptions,
    });

    if (response.status === 401) isTokenExpired = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.statusCode === 401) isTokenExpired = true;
    else throw error;
  } finally {
    if (isTokenExpired) {
      // eslint-disable-next-line no-console
      console.log('Cognito token expired, fetching new token');
      revalidateTag('awsToken');
      response = await fetchWithAwsCognitoTokenHelper({
        url,
        fetchOptions: modifiedFetchoptions,
        extraOptions,
      });
    }
  }
  return response;
};

const isJson = (val: string): boolean => {
  try {
    JSON.parse(val);
  } catch (e) {
    return false;
  }
  return true;
};

function parseConcatenatedJSON(data: string) {
  const objects = [];
  let currentObject = '';
  for (let i = 0; i < data.length; ) {
    currentObject += data[i];
    try {
      JSON.parse(currentObject);
      objects.push(JSON.parse(currentObject));
      currentObject = '';
    } catch (error) {
      // JSON parsing incomplete, continue collecting characters
    }
    i += 1;
  }
  return objects;
}

const setUserHeaders = async (fetchOptions: RequestInit) => {
  const authToken = await getAuthCookie();
  const tokenDecodedValues = await getTokenDecodedValues('tenantUserIdHeader');

  const modifiedFetchOptions = {
    ...fetchOptions,
    headers: {
      ...tokenDecodedValues,
      MetaFactoryToken: `${authToken}`,
      ...fetchOptions.headers,
    },
  };

  return modifiedFetchOptions;
};

export const fetchStream = async (url: string, fetchOptions: RequestInit) =>
  fetch(url, fetchOptions)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const reader = response?.body?.getReader();
      let responseData: OpportunityDocumentResponse[] = [];
      await reader?.read().then(async function pump({
        done,
        value,
      }): Promise<ReadableStreamReadResult<Uint8Array> | null> {
        if (done) {
          return null;
        }
        const decoder = new TextDecoder();
        const decodedVal = parseConcatenatedJSON(decoder.decode(value));
        if (Array.isArray(decodedVal)) {
          responseData = responseData.concat(decodedVal);
        } else if (isJson(decodedVal))
          responseData.push(JSON.parse(decodedVal));
        return reader.read().then(pump);
      });
      return responseData;
    })
    .then((res) => res)
    .catch((err) => console.error(err));

export const fetchCIC = async (
  url: string,
  options: RequestInit = {},
  extraOptions: {
    format?: boolean;
    throwError?: boolean;
    attachBaseURLHeaders?: boolean;
  } = defaultExtraOptions
) => {
  const base64Credentials = Buffer.from(
    `${CIC_USERNAME}:${CIC_PASSWORD}`
  ).toString('base64');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${base64Credentials}`,
    ...options.headers,
  };

  const fetchOptions: RequestInit = {
    cache: 'no-store',
    ...options,
    headers,
  };

  return fetcher({ url, fetchOptions, extraOptions });
};

export const crmServiceFetcher = async (
  path: string,
  fetchOptions?: RequestInit,
  extraOptions?: ExtraOptionsType
) =>
  fetchWithAwsCognitoToken({
    url: `${CRM_SERVICE_BASE_URL}/${path}`,
    fetchOptions: await setUserHeaders(fetchOptions || {}),
    extraOptions,
  });

export const metaFactoryFetcher = async (
  path: string,
  fetchOptions?: RequestInit,
  extraOptions?: ExtraOptionsType
) => {
  const authToken = await getAuthCookie();

  const headers = {
    Authorization: `Bearer ${authToken}`,
    'Content-Type': 'application/json',
    ...fetchOptions?.headers,
  };

  const modifiedFetchOptions: RequestInit = {
    cache: 'no-store',
    ...fetchOptions,
    headers,
  };

  return trace
    .getTracer('crm-web')
    .startActiveSpan('metaFactoryFetcher', async (span) => {
      span.setAttribute('path', path);
      try {
        return fetcher({
          url: `${META_FACTORY_BASE_URL}/${path}`,
          fetchOptions: modifiedFetchOptions,
          extraOptions,
        });
      } finally {
        span.end();
      }
    });
};

export const documentServiceFetcher = async (
  path: string,
  fetchOptions?: RequestInit,
  extraOptions?: ExtraOptionsType
) =>
  fetchWithAwsCognitoToken({
    url: `${DOCUMENTS_SERVICE_BASE_URL}/${path}`,
    fetchOptions: await setUserHeaders(fetchOptions || {}),
    extraOptions,
  });

export const imageServiceFetcher = async (
  path: string,
  fetchOptions?: RequestInit,
  extraOptions?: ExtraOptionsType
) =>
  fetchWithAwsCognitoToken({
    url: `${IMAGE_SERVICE_BASE_URL}/${path}`,
    fetchOptions: await setUserHeaders(fetchOptions || {}),
    extraOptions,
  });

export const publicFetcherWithAwsCognitoToken = async (
  path: string,
  fetchOptions?: RequestInit,
  extraOptions?: ExtraOptionsType
) =>
  fetchWithAwsCognitoToken({
    url: path,
    fetchOptions: fetchOptions || {},
    extraOptions,
  });
