import { Suspense } from 'react';

import SpinnerScreen from '@/components/SpinnerScreen';
import DeliveryEditServer from '@/containers/deliveries/editDelivery/DeliveryEdit.server';

const Page = async ({ params }: { params: { id: string } }) => (
  <Suspense
    fallback={
      <div className='flex w-full justify-center'>
        <SpinnerScreen />
      </div>
    }
  >
    <DeliveryEditServer id={params.id} />
  </Suspense>
);

export default Page;
