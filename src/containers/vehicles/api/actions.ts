'use server';

import { VAT_MULTIPLIER } from '@/constants/common';
import { CIC_BASE_URL } from '@/constants/env';
import {
  CarStockEffectiveAmountResponse,
  getCarStockEffectiveAmountServerAction,
} from '@/containers/quotations/api/actions';
import { ErrorObjectType } from '@/types/api';
import { NextServerActionAPIResponse } from '@/types/common';
import { fetchCIC, metaFactoryFetcher } from '@/utils/api';
import { getTraceId } from '@/utils/common';
import { getTokenDecodedValues } from '@/utils/tokenDecodeAction';

import { CarouselData } from '../components/types';
import { localToPayloadVehicleDetailsDTO } from '../constants';
import { VehicleHeaderDetails, VehicleSpecifications } from './types';

export const getImageArray = async ({ carStockId }: { carStockId: number }) => {
  try {
    return await fetchCIC(`${CIC_BASE_URL}/carstock/images/carousel`, {
      method: 'POST',
      body: JSON.stringify({
        carStockId,
        tenantId: Number(await getTokenDecodedValues('tenantId')),
      }),
    });
  } catch (error) {
    const errorObject: ErrorObjectType = {
      url: `${CIC_BASE_URL}/carstock/images/carousel`,
      isOk: false,
      statusCode: 400,
      statusText: 'Not found',
      message: 'Something went wrong',
    };
    return errorObject;
  }
};

export const getVehicleSpecifications = async ({
  carStockId,
}: {
  carStockId: number;
}) => {
  try {
    const data: VehicleSpecifications = await metaFactoryFetcher(
      `api/carstock/${carStockId}/specifications`,
      undefined,
      {
        format: true,
        throwError: true,
      }
    );

    if (data) return data;
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('getVehicleSpecificationsServerAction')
    );

    return null;
  }

  return null;
};

// Function to get Car-Stock Header information
export const getVehicleHeaderDetails = async ({
  carStockId,
}: {
  carStockId: number;
}) => {
  try {
    const data: VehicleHeaderDetails = await metaFactoryFetcher(
      `/api/carstock/${carStockId}/header`,
      undefined,
      {
        format: true,
        throwError: true,
      }
    );

    if (data) return data;
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('getVehicleHeaderDetailsServerAction')
    );

    return null;
  }

  return null;
};

export const fetchAndTransformVehicleData = async ({
  vehicleId,
}: {
  vehicleId: string;
}) => {
  if (!vehicleId) return null;

  const numericVehicleId = Number(vehicleId);
  const vehicleHeaderPromise = getVehicleHeaderDetails({
    carStockId: numericVehicleId,
  });
  const imageResponsePromise = getImageArray({
    carStockId: numericVehicleId,
  });
  const vehicleSpecificationsPromise = getVehicleSpecifications({
    carStockId: numericVehicleId,
  });
  const effectiveAmountPromise = getCarStockEffectiveAmountServerAction({
    pathParams: { id: numericVehicleId },
  });

  const [
    vehicleHeaderDetails,
    imageResponse,
    vehicleSpecifications,
    effectiveAmountResponse,
  ]: [
    VehicleHeaderDetails,
    CarouselData,
    VehicleSpecifications,
    CarStockEffectiveAmountResponse | NextServerActionAPIResponse,
  ] = await Promise.all([
    vehicleHeaderPromise,
    imageResponsePromise,
    vehicleSpecificationsPromise,
    effectiveAmountPromise,
  ]);

  if (effectiveAmountResponse?.success) {
    const effectiveAmountResponseDataWithZeroDiscount =
      effectiveAmountResponse as CarStockEffectiveAmountResponse;

    const transformedVehicleData = localToPayloadVehicleDetailsDTO({
      ...vehicleHeaderDetails,
      id: numericVehicleId,
      specifications: vehicleSpecifications,
      vehiclePrice:
        effectiveAmountResponseDataWithZeroDiscount.effectiveSellingPrice,
      imageArray: imageResponse?.images || [],
    });
    transformedVehicleData.totalExclVat =
      effectiveAmountResponseDataWithZeroDiscount.effectiveSellingPrice;
    transformedVehicleData.totalInclVat =
      effectiveAmountResponseDataWithZeroDiscount.effectiveSellingPrice *
      VAT_MULTIPLIER;

    return transformedVehicleData;
  }
  return null;
};
