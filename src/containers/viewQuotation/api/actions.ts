'use server';

import { revalidatePath } from 'next/cache';

import { CRM_SERVICE_BASE_URL } from '@/constants/env';
import { QuotationResponse } from '@/containers/quotations/api/type';
import {
  publicFetcherWithAwsCognitoToken,
} from '@/utils/api';
import { getTraceId } from '@/utils/common';

export const getQuotationDetailsByToken = async (token: string) => {
  let quotationDetails: QuotationResponse;
  const encodedToken = encodeURIComponent(token);

  try {
    quotationDetails = await publicFetcherWithAwsCognitoToken(
      `${CRM_SERVICE_BASE_URL}/quotations?token=${encodedToken}`
    );

    return quotationDetails;
  } catch (errorResponse) {
    // TODO: Remove console and handle error
    console.log(
      'ERROR Something went wrong :',
      errorResponse,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('getQuotationDetailsByTokenServerActionFunction')
    );
    // throw new Error('Not found');
    return null;
  }
};

export const acceptQuotation = async (token: string) => {
  let acceptQuoteResponse: Response;
  const encodedToken = encodeURIComponent(token);

  try {
    acceptQuoteResponse = await publicFetcherWithAwsCognitoToken(
      `${CRM_SERVICE_BASE_URL}/quotations/accept?token=${encodedToken}`,
      { method: 'POST' },
      { format: false }
    );
    if (acceptQuoteResponse.ok) {
      revalidatePath('/view-quotation');
      return { success: true };
    }

    throw Error('Something went wrong');
  } catch (errorResponse) {
    // TODO: Remove console and handle error
    console.log(
      'ERROR Something went wrong :',
      errorResponse,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('acceptQuotationServerActionFunction')
    );
    // throw new Error('Not found');
    return null;
  }
};

export const reSharePublicQuotation = async (token: string) => {
  let reShareQuoteResponse: Response;
  const encodedToken = encodeURIComponent(token);

  try {
    reShareQuoteResponse = await publicFetcherWithAwsCognitoToken(
      `${CRM_SERVICE_BASE_URL}/quotations/re-share-signature-email?token=${encodedToken}`,
      { method: 'POST' },
      { format: false }
    );
    if (reShareQuoteResponse.ok) {
      return { success: true };
    }

    throw Error('Something went wrong');
  } catch (errorResponse) {
    // TODO: Remove console and handle error
    console.log(
      'ERROR Something went wrong :',
      errorResponse,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('reSharePublicQuotationServerActionFunction')
    );
    // throw new Error('Not found');
    return null;
  }
};
