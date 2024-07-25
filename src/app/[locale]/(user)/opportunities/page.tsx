import OpportunityList from '@/containers/opportunities/opportunityList/OpportunityList';
import { PageProps } from '@/types/common';

const Page = ({ searchParams }: PageProps) => (
  <OpportunityList searchParams={searchParams} />
);

export default Page;
