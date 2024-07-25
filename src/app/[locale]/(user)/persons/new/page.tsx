import { Suspense } from 'react';

import SpinnerScreen from '@/components/SpinnerScreen';
import CreatePerson from '@/containers/persons/createPerson/CreatePerson';
import { Organisations } from '@/types/api';
import { crmServiceFetcher } from '@/utils/api';
import { getTraceId } from '@/utils/common';

const Page = async () => {
  let organisations: Organisations;
  try {
    organisations = await crmServiceFetcher('organisations');
  } catch (errorResponse) {
    // TODO: Remove console and handle error
    console.log(
      'ERROR Something went wrong :',
      errorResponse,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('fetchOrganisationsInCreatePersonPage')
    );
    organisations = { data: [] };
  }

  return (
    <Suspense
      fallback={
        <div className='flex w-full justify-center'>
          <SpinnerScreen />
        </div>
      }
    >
      <CreatePerson organisations={organisations?.data} />
    </Suspense>
  );
};

export default Page;
