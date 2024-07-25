import { Suspense } from 'react';

import SpinnerScreen from '@/components/SpinnerScreen';
import { DuplicateQuotationPageProps } from '@/containers/quotations/api/type';
import DuplicateQuotationServer from '@/containers/quotations/duplicateQuotation/DuplicateQuotation.server';

const Page = async ({ params, searchParams }: DuplicateQuotationPageProps) => (
  <Suspense
    fallback={
      <div className='flex w-full justify-center'>
        <SpinnerScreen />
      </div>
    }
  >
    <DuplicateQuotationServer params={params} searchParams={searchParams} />
  </Suspense>
);
export default Page;
