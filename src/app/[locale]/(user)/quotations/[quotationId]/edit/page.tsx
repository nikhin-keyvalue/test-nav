import { Suspense } from 'react';

import SpinnerScreen from '@/components/SpinnerScreen';
import { EditQuotationPageProps } from '@/containers/quotations/api/type';
import EditQuotationServer from '@/containers/quotations/editQuotation/EditQuotation.server';

const Page = async ({ params, searchParams }: EditQuotationPageProps) => (
  <Suspense
    fallback={
      <div className='flex w-full justify-center'>
        <SpinnerScreen />
      </div>
    }
  >
    <EditQuotationServer params={params} searchParams={searchParams} />
  </Suspense>
);
export default Page;
