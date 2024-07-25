import { Suspense } from 'react';

import SpinnerScreen from '@/components/SpinnerScreen';
import { CreateOpportunityParams } from '@/containers/opportunities/api/type';
import CreateOpportunity from '@/containers/opportunities/createOpportunity/CreateOpportunity.server';

const Page = async ({
  searchParams,
}: {
  searchParams: CreateOpportunityParams;
}) => (
  <Suspense
    fallback={
      <div className='flex w-full justify-center'>
        <SpinnerScreen />
      </div>
    }
  >
    <CreateOpportunity params={searchParams} />
  </Suspense>
);
export default Page;
