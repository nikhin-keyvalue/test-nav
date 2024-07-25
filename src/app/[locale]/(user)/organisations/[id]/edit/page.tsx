import { Suspense } from 'react';

import SpinnerScreen from '@/components/SpinnerScreen';
import OrganisationEdit from '@/containers/organisations/editOrganisation/organisationEdit.server';

const Page = async ({ params }: { params: { id: string } }) => (
  <Suspense
    fallback={
      <div className='flex w-full justify-center'>
        <SpinnerScreen />
      </div>
    }
  >
    <OrganisationEdit id={params.id} />
  </Suspense>
);

export default Page;
