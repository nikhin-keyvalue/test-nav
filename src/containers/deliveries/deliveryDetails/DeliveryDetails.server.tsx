import { notFound } from 'next/navigation';

import { EXTERNAL_BASE_URL, WEBDEALER_BASE_URL } from '@/constants/env';
import { DefaultESignResponse } from '@/containers/opportunities/constants';
import { DocumentCategories } from '@/containers/opportunities/types';
import { getDealerESignInfo } from '@/containers/quotations/api/actions';
import { ESignMethodResponse } from '@/containers/quotations/api/type';
import { getCurrentWorkflows } from '@/containers/workflows/api/actions';
import { currentUser } from '@/hooks/server/currentUser';
import { getTokenDecodedValues } from '@/utils/tokenDecodeAction';

import {
  getDeliveryDetailsById,
  getDeliveryDocumentCategory,
} from '../api/actions';
import DeliveryDetailsUI from './DeliveryDetails.client';

const DeliveryDetails = async ({ deliveryId }: { deliveryId: string }) => {
  const [
    deliveryDetails,
    deliveryDocumentCategories,
    workflowsData,
    userDetails,
    dealersESignInfo,
  ] = await Promise.all([
    getDeliveryDetailsById({ pathParams: { deliveryId } }),
    getDeliveryDocumentCategory(),
    getCurrentWorkflows(deliveryId, 'DELIVERY'),
    currentUser(),
    getDealerESignInfo(),
  ]);
  let isDealerPreview = false;
  const availablePermissions = await getTokenDecodedValues('userRoles');
  isDealerPreview = availablePermissions.includes('ROLE_DEALER_PREVIEW');

  if (!deliveryDetails) {
    notFound();
  }

  const dealerESignInfo = (
    (dealersESignInfo as ESignMethodResponse[]) || []
  )?.find(
    (dealer) => String(dealer?.dealerId) === deliveryDetails?.dealer?.dealerId
  ) as ESignMethodResponse;

  return (
    <DeliveryDetailsUI
      deliveryDetails={deliveryDetails}
      isDealerPreview={isDealerPreview}
      deliveryDocumentCategories={
        deliveryDocumentCategories as DocumentCategories[]
      }
      webdealerBaseUrl={
        isDealerPreview ? WEBDEALER_BASE_URL! : EXTERNAL_BASE_URL!
      }
      workflowData={workflowsData}
      roles={userDetails?.authorities}
      dealerESignInfo={dealerESignInfo || DefaultESignResponse}
    />
  );
};
export default DeliveryDetails;
