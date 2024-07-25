import PersonsList from '@/containers/persons/personsList/PersonsList';
import { SearchParams } from '@/types/common';

const Page = async ({ searchParams }: { searchParams: SearchParams }) => (
  <PersonsList searchParams={searchParams} />
);

export default Page;
