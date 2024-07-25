import { FC } from 'react';

import { QuickQuotationPageProps } from '../api/type';
import { fetchVehicleInfo } from './api/actions';
import QuickQuotation from './QuickQuotation.client';

const QuickQuotationServer: FC<QuickQuotationPageProps> = async ({
  searchParams,
}) => {
  let vehicleHeaderDetails = null;
  let imageResponse = null;
  const { vehicleId } = searchParams || {};

  if (vehicleId) {
    const vehicleInfo = await fetchVehicleInfo({
      vehicleId: vehicleId || '',
    });

    vehicleHeaderDetails = vehicleInfo?.vehicleHeaderDetails;
    imageResponse = vehicleInfo?.imageResponse;
  }

  return (
    <QuickQuotation
      searchParams={searchParams}
      vehicleHeaderDetails={vehicleHeaderDetails}
      vehicleImageDetails={imageResponse}
    />
  );
};
export default QuickQuotationServer;
