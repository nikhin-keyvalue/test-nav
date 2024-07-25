import { definitions } from '@generated/metafactory-service-types';

import { LineGroupItemPurchase } from '@/containers/quotations/api/type';

export type VehicleSpecifications =
  | definitions['ISpecificationsCarStockDto']
  | null;

export type VehicleHeaderDetails = definitions['IHeaderCarStockDto'] | null;

export type TransformedVehicleData = LineGroupItemPurchase | null;
