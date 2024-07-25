import { FC } from 'react';

import { PageProps } from '@/types/common';

import { getDeliveries } from '../api/actions';
import { DeliveriesResponse } from '../api/type';
import DeliveryTable from './DeliveryTable.client';

const DeliveryTableContainer: FC<PageProps> = async ({ searchParams }) => {
  const deliveriesResponse: DeliveriesResponse = await getDeliveries({
    searchParams,
  });

  return (
    <DeliveryTable
      deliveriesResponse={deliveriesResponse}
      searchParams={searchParams}
    />
  );
};

export default DeliveryTableContainer;
