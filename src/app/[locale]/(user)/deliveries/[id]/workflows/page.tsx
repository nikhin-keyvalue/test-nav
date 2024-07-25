import { Suspense } from 'react';

import SpinnerScreen from '@/components/SpinnerScreen';
import EditWorkFlow from '@/containers/workflows/editWorkflows/EditWorkFlow.server';

const Page = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { dealerId: string };
}) => (
  <Suspense
    fallback={
      <div className='flex w-full justify-center'>
        <SpinnerScreen />
      </div>
    }
  >
    <EditWorkFlow
      workflowServiceId={params.id}
      entity='DELIVERY'
      dealerId={searchParams?.dealerId}
    />
  </Suspense>
);
export default Page;
