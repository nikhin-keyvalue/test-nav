import { Suspense } from 'react';

import SpinnerScreen from '@/components/SpinnerScreen';
import OpportunityDetailsServer from '@/containers/opportunities/opportunityDetails/OpportunityDetails.server';

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
      <OpportunityDetailsServer opportunityId={id} />
    </Suspense>
  );
};

export default Page;
