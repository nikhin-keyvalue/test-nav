'use server';

import { SEARCH_CRITERIA_BASE_URL } from '@/constants/env';

import { getTokenDecodedValues } from '../tokenDecodeAction';

export const deleteSearchCriteria = async (id: string) => {
  const userHeaders = await getTokenDecodedValues('tenantUserIdHeader');
  const url = `${SEARCH_CRITERIA_BASE_URL}/search-criteria?id=${id}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers:  {
      ...userHeaders,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 200) {
    return { success: true };
  }
  console.log('Delete search criteria failed with status:', response.status);
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
