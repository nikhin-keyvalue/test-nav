import DeliveryList from '@/containers/deliveries/deliveryList/DeliveryList';
import { PageProps } from '@/types/common';

const Page = ({ searchParams }: PageProps) => (
  <DeliveryList searchParams={searchParams} />
);

export default Page;
