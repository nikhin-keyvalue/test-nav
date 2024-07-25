import { Suspense } from 'react';

import SpinnerScreen from '@/components/SpinnerScreen';
import PersonEditServer from '@/containers/persons/editPersons/PersonEdit.server';

const Page = async ({ params }: { params: { id: string } }) => (
  <Suspense
    fallback={
      <div className='flex w-full justify-center'>
        <SpinnerScreen />
      </div>
    }
  >
    <PersonEditServer id={params.id} />
  </Suspense>
);

export default Page;
