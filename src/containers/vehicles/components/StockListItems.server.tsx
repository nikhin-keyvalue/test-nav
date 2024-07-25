import { CIC_BASE_URL } from '@/constants/env';
import { fetchCIC } from '@/utils/api';
import { getTokenDecodedValues } from '@/utils/tokenDecodeAction';

import { SearchParams } from '../constants';
import StockListItemsUI from './StockListItems.client';
import { StockListData } from './types';

const StockListItems = async ({
  searchParams,
  data,
}: {
  searchParams: SearchParams;
  data: Promise<StockListData>;
}) => {
  const listData = await data;
  const carStockIds = listData?.items?.map((carStock) => carStock.id);

  const tenantId = await getTokenDecodedValues('tenantId');

  const carStockRequest = fetchCIC(`${CIC_BASE_URL}/new/carstocklist`, {
    method: 'POST',
    body: JSON.stringify({
      carStockIds,
      tenantId: Number(tenantId),
    }),
  });

  return (
    <StockListItemsUI
      searchParams={searchParams}
      listData={listData}
      imagesPromise={carStockRequest}
    />
  );
};

export default StockListItems;
