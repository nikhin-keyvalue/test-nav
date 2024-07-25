import { NextRequest } from 'next/server';

import { SEARCH_CRITERIA_BASE_URL } from '@/constants/env';
import { getHeaders } from '@/utils/apiHeaders';
import {
  getTokenDecodedValues,
} from '@/utils/tokenDecodeAction';

const methods = 'OPTIONS, GET';

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: getHeaders(request, methods),
  });
}

export async function GET(request: NextRequest) {
  const userHeaders = await getTokenDecodedValues('tenantUserIdHeader');
  const response = await fetch(`${SEARCH_CRITERIA_BASE_URL}/search-criteria`, {
    headers: { ...userHeaders },
  });
  try {
    if (response) {
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: getHeaders(request, methods),
      });
    }
    throw new Error();
  } catch (e) {
    return new Response(JSON.stringify(e), {
      status: 500,
      headers: getHeaders(request, methods),
    });
  }
}
