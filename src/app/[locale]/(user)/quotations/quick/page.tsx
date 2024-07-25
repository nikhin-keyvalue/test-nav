import { QuickQuotationPageProps } from '@/containers/quotations/api/type';
import QuickQuotationServer from '@/containers/quotations/quickQuotation/QuickQuotation.server';

const Page = async ({ searchParams }: QuickQuotationPageProps) => (
  <QuickQuotationServer searchParams={searchParams} />
);
export default Page;
