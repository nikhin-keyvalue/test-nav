import ViewQuotationServer from '@/containers/viewQuotation/ViewQuotation.Server';

const Page = async ({ searchParams }: { searchParams: { token: string } }) => (
  <ViewQuotationServer token={searchParams.token} />
);

export default Page;
