import { Suspense } from 'react';

import SpinnerScreen from '@/components/SpinnerScreen';
import { QuotationPageProps } from '@/containers/quotations/api/type';
import CreateQuotationServer from '@/containers/quotations/createQuotation/CreateQuotation.server';

// TODO remove if searchParams is not required in create page
const Page = async ({ searchParams }: { searchParams: QuotationPageProps }) => (
  <Suspense
    fallback={
      <div className='flex w-full justify-center'>
        <SpinnerScreen />
      </div>
    }
  >
    <CreateQuotationServer searchParams={searchParams} />
  </Suspense>
);
export default Page;
