'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

import {
  NextServerActionAPIResponse,
  ProposalResponseDataType,
} from '@/types/common';
import { crmServiceFetcher, metaFactoryFetcher } from '@/utils/api';
import {
  getTraceId,
  replaceUndefinedAndEmptyStringsWithNull,
} from '@/utils/common';

import {
  EmailQuotationReq,
  ESignMethodResponse,
  Quotation,
  QuotationCreateRequest,
  QuotationCreateResponse,
  QuotationResponse,
  QuotationStatus,
  QuotationUpdateRequest,
  ShareQuotationReq,
  TradeInVehicleDetails,
} from './type';

export const createQuotation = async (
  newQuotation: QuotationCreateRequest
): Promise<NextServerActionAPIResponse & ProposalResponseDataType> => {
  try {
    const data: QuotationCreateResponse = await crmServiceFetcher(
      `quotations?withValidation`, // TODO: should remove the param 'withValidation' once calculation validation is done in BE without this param
      {
        method: 'POST',
        cache: 'no-store',
        body: JSON.stringify(
          replaceUndefinedAndEmptyStringsWithNull(newQuotation)
        ),
      }
    );
    if (data) {
      revalidatePath(`/opportunities/${newQuotation.opportunityId}/details`);
      return { success: true, ...data };
    }
    throw new Error('No data');
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('createQuotationServerActionFunction')
    );

    return { success: false };
  }
};

export const updateQuotationAction = async ({
  body,
  pathParams,
}: {
  body: QuotationUpdateRequest;
  pathParams: { id: string };
}): Promise<NextServerActionAPIResponse & ProposalResponseDataType> => {
  try {
    const data: Quotation = await crmServiceFetcher(
      `quotations/${pathParams.id}?withValidation`, // TODO: should remove the param 'withValidation' once calculation validation is done in BE without this param
      {
        method: 'PUT',
        cache: 'no-store',
        body: JSON.stringify(replaceUndefinedAndEmptyStringsWithNull(body)),
      }
    );
    if (data) {
      revalidatePath(`/opportunities/${data.opportunity.id}/details`);
      return { success: true, ...data };
    }
    throw new Error('No data');
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('updateQuotationServerActionFunction')
    );

    return { success: false };
  }
};

export const shareQuotation = async ({
  id,
  payload,
  opportunityId,
}: {
  id: string;
  payload: ShareQuotationReq;
  opportunityId: string;
}) => {
  try {
    const response = await crmServiceFetcher(
      `quotations/${id}/share`,
      {
        method: 'PUT',
        body: JSON.stringify(replaceUndefinedAndEmptyStringsWithNull(payload)),
      },
      { format: false, throwError: true }
    );

    if (response.ok) {
      revalidateTag('opportunityDetails');
      return { success: true };
    }
  } catch (errorResponse) {
    console.log(
      'ERROR Something went wrong :',
      errorResponse,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('shareQuotationServerActionFunction')
    );
    return { success: false };
  }

  return { success: false };
};

export const emailQuotation = async ({
  id,
  payload,
}: {
  id: string;
  payload: EmailQuotationReq;
  opportunityId: string;
}) => {
  try {
    const response = await crmServiceFetcher(
      `quotations/${id}/email`,
      {
        method: 'PUT',
        body: JSON.stringify(replaceUndefinedAndEmptyStringsWithNull(payload)),
      },
      { format: false, throwError: true }
    );

    if (response.ok) {
      revalidateTag('opportunityDetails');
      return { success: true };
    }
  } catch (errorResponse) {
    console.log(
      'ERROR Something went wrong :',
      errorResponse,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('emailQuotationServerActionFunction')
    );
    return { success: false };
  }

  return { success: false };
};

export const deleteQuotation = async ({
  id,
  opportunityId,
}: {
  id: number | string;
  opportunityId: string;
}) => {
  try {
    const response = await crmServiceFetcher(
      `quotations/${id}`,
      {
        method: 'DELETE',
      },
      { format: false, throwError: true }
    );

    if (response.ok) {
      revalidatePath(`/opportunities/${opportunityId}/details`);
      return { success: true };
    }
  } catch (errorResponse) {
    console.log(
      'ERROR Something went wrong :',
      errorResponse,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('deleteQuotationServerActionFunction')
    );
    return { success: false };
  }

  return { success: false };
};

enum CarStockDiscountOriginType {
  DYNAMIC = 'DYNAMIC',
  MANUAL = 'MANUAL',
}

type GetCarStockEffectiveAmountServerActionArgs = {
  pathParams: { id: number };
  queryParams?: {
    carStockDiscountOrigin?: CarStockDiscountOriginType;
    sellingPrice?: number;
    discountPercentage?: number;
    discountAmount?: number;
  };
};

export type CarStockEffectiveAmountResponse = {
  effectiveDiscountAmount: number;
  effectiveSellingPrice: number;
  success: boolean;
};

export const getCarStockEffectiveAmountServerAction = async ({
  pathParams,
  queryParams,
}: GetCarStockEffectiveAmountServerActionArgs): Promise<
  CarStockEffectiveAmountResponse | NextServerActionAPIResponse
> => {
  const apiQueryParams = new URLSearchParams({
    carStockDiscountOrigin:
      queryParams?.carStockDiscountOrigin ?? CarStockDiscountOriginType.MANUAL,
    ...(queryParams?.discountPercentage
      ? { discountPercentage: queryParams.discountPercentage.toString() }
      : {}),
    ...(queryParams?.discountAmount
      ? { discountAmount: queryParams.discountAmount.toString() }
      : {}),
  });
  try {
    const res = await metaFactoryFetcher(
      `api/carstock/${pathParams.id}/price/effectiveamounts?${apiQueryParams}`,
      undefined,
      {
        format: false,
        throwError: false,
      }
    );

    if (res.ok) {
      const resData = await res.json();
      const data: CarStockEffectiveAmountResponse = {
        ...resData,
        success: true,
      };

      return data;
    }
  } catch (err) {
    return { success: false };
  }

  return { success: false };
};

export const getQuotationDetailsById = async ({ id }: { id: string }) => {
  const response: QuotationResponse = await crmServiceFetcher(
    `quotations/${id}`
  );
  return response;
};

export const updateQuotationStatus = async ({
  id,
  status,
  opportunityId,
}: {
  id: string | number;
  status: QuotationStatus;
  opportunityId: string;
}) => {
  try {
    const response = await crmServiceFetcher(
      `quotations/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      },
      { format: false, throwError: true }
    );

    if (response.ok) {
      revalidatePath(`/opportunities/${opportunityId}/details`);
      return { success: true };
    }
  } catch (errorResponse) {
    console.log(
      'ERROR Something went wrong :',
      errorResponse,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('updateQuotationStatusServerActionFunction')
    );
    return { success: false };
  }

  return { success: false };
};

export const getTradeInVehicleDetails = async ({
  licensePlate,
}: {
  licensePlate: string;
}) => {
  try {
    const res = await metaFactoryFetcher(`api/vwe/${licensePlate}`, undefined, {
      format: false,
      throwError: false,
    });

    if (res.ok) {
      const resData = await res.json();
      const data: TradeInVehicleDetails = {
        ...resData,
        success: true,
      };
      return data;
    }
  } catch (errorResponse) {
    console.log(
      'ERROR Something went wrong :',
      errorResponse,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('getTradeInVehicleDetailsServerActionFunction')
    );
    return { success: false };
  }

  return { success: false };
};

export const getDealerESignInfo = async () => {
  try {
    const res = await metaFactoryFetcher(
      `api/dealer/esign-service`,
      undefined,
      {
        format: false,
        throwError: false,
      }
    );

    if (res.ok) {
      const resData: ESignMethodResponse[] = await res.json();

      return resData;
    }
  } catch (errorResponse) {
    console.log(
      'ERROR Something went wrong :',
      errorResponse,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('getDealerESignInfoServerActionFunction')
    );
    return { success: false };
  }

  return { success: false };
};

export const getEmailPreview = async ({
  id,
  message,
}: {
  id: string;
  message?: string;
}) => {
  const payload = message ? { message } : {};
  try {
    const response = await crmServiceFetcher(
      `quotations/${id}/email-preview`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      },
      { format: false }
    );
    const textRes = String(await response.text());
    if (response.ok) {
      return textRes;
    }
  } catch (errorResponse) {
    console.log(
      'ERROR Something went wrong :',
      errorResponse,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('getEmailPreviewServerActionFunction')
    );
    return { success: false };
  }

  return { success: false };
};
