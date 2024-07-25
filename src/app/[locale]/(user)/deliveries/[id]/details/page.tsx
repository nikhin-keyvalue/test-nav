import { Suspense } from 'react';

import SpinnerScreen from '@/components/SpinnerScreen';
import DeliveryDetails from '@/containers/deliveries/deliveryDetails/DeliveryDetails.server';

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  return (
    <Suspense
      fallback={
        <div className='flex w-full justify-center'>
          <SpinnerScreen />
        </div>
      }
    >
      <DeliveryDetails deliveryId={id} />
    </Suspense>
  );
};

export default Page;
