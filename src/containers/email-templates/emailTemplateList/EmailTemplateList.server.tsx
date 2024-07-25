import { PageProps } from '@/types/common';

import { getEmailTemplates } from '../api/actions';
import { EmailTemplatesResponse } from '../api/types';
import EmailTemplateList from './EmailTemplateList.client';

const EmailTemplateListServer = async ({ searchParams }: PageProps) => {
  const emailTemplatesResponse: EmailTemplatesResponse =
    await getEmailTemplates({
      searchParams,
    });

  return <EmailTemplateList emailTemplatesResponse={emailTemplatesResponse} />;
};

export default EmailTemplateListServer;
