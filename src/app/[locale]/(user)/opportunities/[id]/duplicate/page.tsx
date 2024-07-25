import DuplicateOpportunityServer from '@/containers/opportunities/duplicateOpportunity/DuplicateOpportunity.server';
import { DuplicateOpportunityPageProps } from '@/containers/opportunities/types';

const Page = async ({
  params,
  searchParams,
}: DuplicateOpportunityPageProps) => (
  <DuplicateOpportunityServer params={params} searchParams={searchParams} />
);
export default Page;
