import OrganisationsList from '@/containers/organisations/organisationsList/OrganisationsList';
import { SearchParams } from '@/types/common';

const Page = async ({ searchParams }: { searchParams: SearchParams }) => (
  <OrganisationsList searchParams={searchParams} />
);

export default Page;
