import { paths } from '@generated/crm-service-types';

export type EmailTemplatesResponse =
  paths['/tenants/email-templates']['get']['responses']['200']['content']['application/json'];

export type EmailTemplateDetails =
  paths['/tenants/email-templates/{templateId}']['get']['responses']['200']['content']['application/json'];

export type EditEmailTemplatePayload =
  paths['/tenants/email-templates/{templateId}']['put']['requestBody']['content']['application/json'];
