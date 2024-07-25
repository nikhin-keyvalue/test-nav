import { components, paths } from '@generated/crm-service-types';

export type DeliveryDetails = components['schemas']['Delivery'];
export type DeliveryUpdateRequest =
  components['schemas']['DeliveryUpdateRequest'];

export type DeliveryCreateRequest =
  paths['/deliveries']['post']['requestBody']['content']['application/json'];

export type DeliveryCreateResponse =
  paths['/deliveries']['post']['responses']['201']['content']['application/json'];

export type Delivery = components['schemas']['Delivery'];

export type DeliveriesResponse =
  paths['/deliveries']['get']['responses']['200']['content']['application/json'];

export type DeliveryResponse =
  paths['/deliveries/{deliveryId}']['get']['responses']['200']['content']['application/json'];

export type DeliveryQuotation =
  paths['/deliveries/{deliveryId}']['get']['responses']['200']['content']['application/json']['quotation'];

export type DeliveryStatus = components['schemas']['DeliveryStatus'];

export type BonusRequestData =
  paths['/deliveries/{id}/bonus']['post']['requestBody']['content']['application/json'];
export type BonusResponseData =
  paths['/deliveries/{id}/bonus']['post']['responses']['201']['content']['application/json'];
export type Bonus = components['schemas']['Bonus'];
export type PayoutAfterOptions = components['schemas']['PayOutAfter'];

export type GETDeliveryByIdPathParameters =
  paths['/deliveries/{deliveryId}']['get']['parameters']['path'];
export type GETDeliveryByIdQueryParameters =
  paths['/deliveries/{deliveryId}']['get']['parameters']['query'];
