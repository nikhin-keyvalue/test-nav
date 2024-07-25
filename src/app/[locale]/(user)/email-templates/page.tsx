import ListAndEdit from '@/containers/email-templates/listAndEdit/ListAndEdit';
import { EmailTemplatesPageProps } from '@/types/common';

const Page = ({ searchParams }: EmailTemplatesPageProps) => (
  <ListAndEdit searchParams={searchParams} />
);

export default Page;
