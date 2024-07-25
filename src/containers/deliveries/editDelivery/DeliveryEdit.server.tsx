import { notFound } from 'next/navigation';

import { crmServiceFetcher } from '@/utils/api';
import { getTraceId, getURLSearchParamsString } from '@/utils/common';

import { DeliveryDetails, GETDeliveryByIdQueryParameters } from '../api/type';
import DeliveryEditClient from './DeliveryEdit.client';

const DeliveryEditServer = async ({ id }: { id: string }) => {
  let deliveryDetails: DeliveryDetails | null;
  const getDeliveryByIdQueryParameters: GETDeliveryByIdQueryParameters = {
    excludeRelated: true,
  };
  try {
    deliveryDetails = await crmServiceFetcher(
      `deliveries/${id}${getURLSearchParamsString({ queryParams: getDeliveryByIdQueryParameters })}`
    );
  } catch (errorResponse) {
    // TODO: Remove console and handle error
    console.log(
      'ERROR Something went wrong :',
      errorResponse,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('getDeliveryDetailsForEditDeliveryPage')
    );
    deliveryDetails = null;
  }

  // TODO: Remove unreachable code
  if (!deliveryDetails) {
    notFound();
  }

  return <DeliveryEditClient id={id} deliveryDetails={deliveryDetails} />;
};

export default DeliveryEditServer;
