import { Suspense } from 'react';

import SpinnerScreen from '@/components/SpinnerScreen';
import EditOpportunityServer from '@/containers/opportunities/editOpportunity/EditOpportunity.server';

const Page = async ({ params }: { params: { id: string } }) => (
  <Suspense
    fallback={
      <div className='flex w-full justify-center'>
        <SpinnerScreen />
      </div>
    }
  >
    <EditOpportunityServer id={params?.id} />
  </Suspense>
);
export default Page;
