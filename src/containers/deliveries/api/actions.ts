'use server';

import { revalidatePath } from 'next/cache';

import { DOCUMENTS_SERVICE_BASE_URL } from '@/constants/env';
import { DocumentCategories } from '@/containers/opportunities/types';
import { SearchParams } from '@/types/common';
import {
  crmServiceFetcher,
  documentServiceFetcher,
  fetchAwsCognitoToken,
  fetchStream,
} from '@/utils/api';
import {
  getTraceId,
  getURLSearchParamsString,
  queryParamBuilder,
  replaceUndefinedAndEmptyStringsWithNull,
} from '@/utils/common';
import { getTokenDecodedValues } from '@/utils/tokenDecodeAction';

import {
  BonusRequestData,
  BonusResponseData,
  DeliveriesResponse,
  DeliveryCreateRequest,
  DeliveryCreateResponse,
  DeliveryResponse,
  DeliveryStatus,
  DeliveryUpdateRequest,
  GETDeliveryByIdPathParameters,
  GETDeliveryByIdQueryParameters,
} from './type';

export const getDeliveries = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  let deliveries: DeliveriesResponse;
  try {
    deliveries = await crmServiceFetcher(
      `deliveries?${queryParamBuilder(searchParams, 'name')}`
    );
  } catch (errorResponse) {
    // TODO: Remove console and handle error
    console.log(
      'ERROR Something went wrong :',
      errorResponse,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('getDeliveriesServerActionFunction')
    );
    deliveries = { data: [] };
  }
  return deliveries;
};

export const editDelivery = async (
  id: string,
  deliveryPayload: DeliveryUpdateRequest
) => {
  try {
    const data = await crmServiceFetcher(
      `deliveries/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(
          replaceUndefinedAndEmptyStringsWithNull(deliveryPayload)
        ),
      },
      { format: false, throwError: true }
    );
    if (data.ok) {
      revalidatePath(`/deliveries/${id}/details`);
      revalidatePath(`/deliveries`);
      revalidatePath(`/deliveries/${id}/edit`);
      return { success: true, id };
    }
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('editDeliveryServerActionFunction')
    );
    return { success: false };
  }

  return null;
};

export const createDelivery = async (payload: DeliveryCreateRequest) => {
  try {
    const data: DeliveryCreateResponse = await crmServiceFetcher(
      `deliveries`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      { format: true, throwError: true }
    );

    if (data.id) {
      revalidatePath(`/opportunities/${data.opportunity.id}/details`);
      revalidatePath(`/deliveries`);
      return { success: true };
    }
  } catch (errorResponse) {
    console.log(
      'ERROR Something went wrong :',
      errorResponse,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('createDeliveryServerActionFunction')
    );
    return { success: false };
  }

  return { success: false };
};
export const getDeliveryDocumentCategory = async () => {
  let deliveryDocumentCategory: DocumentCategories[];
  const tenantAndUserIdHeader =
    await getTokenDecodedValues('tenantUserIdHeader');
  const headers = {
    ...(tenantAndUserIdHeader || {}),
    'Content-Type': 'application/json',
  };

  const fetchOptions: RequestInit = {
    cache: 'no-store',
    headers,
  };

  try {
    deliveryDocumentCategory = await documentServiceFetcher(
      `documents/subcategory-group?entityType=Delivery`,
      fetchOptions
    );
    return deliveryDocumentCategory;
  } catch (errorResponse) {
    // TODO: Remove console and handle error
    console.log(
      'ERROR Something went wrong :',
      errorResponse,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('getDeliveryDocumentCategoryServerActionFunction')
    );
    return null;
  }
};

export const getDeliveryDetailsById = async ({
  queryParams,
  pathParams,
}: {
  queryParams?: GETDeliveryByIdQueryParameters;
  pathParams: GETDeliveryByIdPathParameters;
}) => {
  let deliveryDetails: DeliveryResponse;
  try {
    deliveryDetails = await crmServiceFetcher(
      `deliveries/${pathParams.deliveryId}${getURLSearchParamsString({
        queryParams,
      })}`
    );
    return deliveryDetails;
  } catch (errorResponse) {
    // TODO: Remove console and handle error
    console.log(
      'ERROR Something went wrong :',
      errorResponse,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('getDeliveryDetailsbyIdServerActionFunction')
    );
    return null;
  }
};

export const getDocumentData = async (id: string | number) => {
  const token = await fetchAwsCognitoToken();
  const tenantAndUserIdHeader =
    await getTokenDecodedValues('tenantUserIdHeader');
  const headers = {
    ...(tenantAndUserIdHeader || {}),
    Authorization: `Bearer ${token}`,
  };

  return fetchStream(
    `${DOCUMENTS_SERVICE_BASE_URL}/deliveries/${id}/documents`,
    {
      cache: 'no-cache',
      headers,
    }
  );
};

export const createBonus = async (
  bonusData: BonusRequestData,
  deliveryId: string
) => {
  try {
    const data: BonusResponseData = await crmServiceFetcher(
      `deliveries/${deliveryId}/bonus`,
      {
        method: 'POST',
        cache: 'no-store',
        body: JSON.stringify(bonusData),
      }
    );
    if (data) {
      revalidatePath(`/deliveries/${deliveryId}/details`);
      return { success: true };
    }
    throw new Error('No data');
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('createBonusServerActionFunction')
    );
    return { success: false };
  }
};

export const updateBonus = async ({
  body,
  pathParams: { id, deliveryId },
}: {
  body: BonusRequestData;
  pathParams: { id: string; deliveryId: string };
}) => {
  try {
    const data: BonusResponseData = await crmServiceFetcher(
      `deliveries/${deliveryId}/bonus/${id}`, // TODO: should remove the param 'withValidation' once calculation validation is done in BE without this param
      {
        method: 'PUT',
        cache: 'no-store',
        body: JSON.stringify(body),
      }
    );
    if (data) {
      revalidatePath(`/deliveries/${deliveryId}/details`);
      return { success: true };
    }
    throw new Error('No data');
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('updateBonusServerActionFunction')
    );

    return { success: false };
  }
};

export const deleteBonus = async ({
  id,
  deliveryId,
}: {
  id: number | string;
  deliveryId: string;
}) => {
  try {
    const response = await crmServiceFetcher(
      `deliveries/${deliveryId}/bonus/${id}`,
      {
        method: 'DELETE',
      },
      { format: false, throwError: true }
    );
    if (response.ok) {
      revalidatePath(`/deliveries/${deliveryId}/details`);
      return { success: true };
    }
  } catch (errorResponse) {
    console.log(
      'ERROR Something went wrong :',
      errorResponse,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('deleteBonusServerActionFunction')
    );
    return { success: false };
  }
  return { success: false };
};

export const updateDeliveryStatus = async ({
  id,
  status,
}: {
  id: string;
  status: DeliveryStatus;
}) => {
  try {
    const response = await crmServiceFetcher(
      `deliveries/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      },
      { format: false, throwError: true }
    );

    if (response.ok) {
      revalidatePath(`/deliveries/${id}/details`);
      revalidatePath(`/deliveries`);
      return { success: true };
    }
  } catch (errorResponse) {
    console.log(
      'ERROR Something went wrong :',
      errorResponse,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('updateDeliveryStatusServerActionFunction')
    );
    return { success: false };
  }

  return { success: false };
};
