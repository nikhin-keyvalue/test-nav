'use server';

import { SEARCH_CRITERIA_BASE_URL } from '@/constants/env';

import { getTokenDecodedValues } from '../tokenDecodeAction';

export const renameSearchCriteria = async (formData: FormData, id: string) => {
  const userHeaders = await getTokenDecodedValues('tenantUserIdHeader');
  const url = `${SEARCH_CRITERIA_BASE_URL}/search-criteria/${id}`;
  const response = await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify({
      name: formData.get('name'),
    }),
    headers: {
      ...userHeaders,
      'Content-Type': 'application/json',
    },
    cache: 'no-cache',
  });
  if (response.status === 200) {
    return { success: true };
  }
  console.log('Rename search criteria failed with status:', response.status);
  try {
    const responseJson = await response.json();
    return {
      success: false,
      message: responseJson?.description ?? '',
    };
  } catch (error) {
    return {
      success: false,
    };
  }
};
