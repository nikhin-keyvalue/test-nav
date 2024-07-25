import { Suspense } from 'react';

import SpinnerScreen from '@/components/SpinnerScreen';
import PersonDetails from '@/containers/persons/personDetails/personDetails.server';

const Page = async ({ params }: { params: { id: string } }) => (
  <Suspense
    fallback={
      <div className='flex  w-full justify-center'>
        <SpinnerScreen />
      </div>
    }
  >
    <PersonDetails id={params.id} />
  </Suspense>
);

export default Page;
