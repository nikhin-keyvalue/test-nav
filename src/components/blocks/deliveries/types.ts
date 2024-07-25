import { DeliveryStatus } from '@/containers/deliveries/api/type';

export interface IDeliveryLineItemProps {
  item: {
    id?: string | undefined;
    name?: string | undefined;
    status?: DeliveryStatus;
  };
}
