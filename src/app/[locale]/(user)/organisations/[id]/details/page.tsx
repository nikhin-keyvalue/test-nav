import { Suspense } from 'react';

import SpinnerScreen from '@/components/SpinnerScreen';
import OrganisationDetails from '@/containers/organisations/organisationDetails/OrganisationsDetails.server';

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
      <OrganisationDetails id={id} />
    </Suspense>
  );
};

export default Page;
