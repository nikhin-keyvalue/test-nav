'use server';

import { revalidatePath } from 'next/cache';

import { SearchParams } from '@/types/common';
import { crmServiceFetcher } from '@/utils/api';
import {
  queryParamBuilder,
  replaceUndefinedAndEmptyStringsWithNull,
} from '@/utils/common';

import {
  EditEmailTemplatePayload,
  EmailTemplateDetails,
  EmailTemplatesResponse,
} from './types';

export const getEmailTemplates = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  let emailTemplates: EmailTemplatesResponse;
  try {
    emailTemplates = await crmServiceFetcher(
      `tenants/email-templates?${queryParamBuilder(searchParams, 'name')}`
    );
  } catch (errorResponse) {
    console.log('ERROR Something went wrong :', errorResponse);
    emailTemplates = { data: [] };
  }
  return emailTemplates;
};

export const getEmailTemplateDetailsById = async (id: string) => {
  let emailTemplateDetails: EmailTemplateDetails;
  try {
    emailTemplateDetails = await crmServiceFetcher(
      `tenants/email-templates/${id}`
    );
    return emailTemplateDetails;
  } catch (errorResponse) {
    console.log('ERROR Something went wrong :', errorResponse);
    return null;
  }
};

export const editEmailTemplate = async (
  id: string,
  editedEmailTemplate: EditEmailTemplatePayload
) => {
  try {
    const data = await crmServiceFetcher(
      `tenants/email-templates/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(
          replaceUndefinedAndEmptyStringsWithNull(editedEmailTemplate)
        ),
      },
      { format: false, throwError: true }
    );
    if (data) {
      revalidatePath(`/email-templates`);
      return { success: true, id };
    }
  } catch (error) {
    console.log('ERROR Something went wrong :', error);
    return { success: false };
  }

  return null;
};
