import { Suspense } from 'react';

import SpinnerScreen from '@/components/SpinnerScreen';
import CreateOrganisation from '@/containers/organisations/createOrganisation/CreateOrganisation';

const Page = async () => (
  <Suspense
    fallback={
      <div className='flex w-full justify-center'>
        <SpinnerScreen />
      </div>
    }
  >
    <CreateOrganisation />
  </Suspense>
);
export default Page;
