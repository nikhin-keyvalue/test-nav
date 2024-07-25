'use server';

import { revalidatePath } from 'next/cache';

import { crmServiceFetcher } from '@/utils/api';

import {
  EditMiscellaneousSettingsPayload,
  MiscellaneousSettingsResponse,
} from '../types';

export const getMiscellaneousSettings = async () => {
  let miscellaneousSettings: MiscellaneousSettingsResponse = null;
  try {
    miscellaneousSettings = await crmServiceFetcher('tenants/miscellaneous');
  } catch (errorResponse) {
    console.log('ERROR Something went wrong :', errorResponse);
  }
  return miscellaneousSettings;
};

export const editMiscellaneousSettings = async (
  editedMiscellaneousSettings: EditMiscellaneousSettingsPayload
) => {
  try {
    const data = await crmServiceFetcher(
      'tenants/miscellaneous',
      {
        method: 'PUT',
        body: JSON.stringify(editedMiscellaneousSettings),
      },
      { format: false, throwError: true }
    );
    if (data) {
      revalidatePath(`/miscellaneous`);
      return { success: true };
    }
  } catch (error) {
    console.log('ERROR Something went wrong :', error);
    return { success: false };
  }

  return null;
};
