import { NextResponse } from 'next/server';

import { SearchParams } from '@/types/common';
import { crmServiceFetcher } from '@/utils/api';
import { queryParamBuilder } from '@/utils/common';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams);

  try {
    const response = await crmServiceFetcher(
      `persons?${queryParamBuilder(params as SearchParams, 'name', false)}`,
      {},
      { format: false, throwError: true }
    );

    if (response.ok) {
      const responseData = await response.json();
      return Response.json({ data: responseData.data });
    }
  } catch (err) {
    const statusCode = (err as { statusCode?: number })?.statusCode || 500;
    return new NextResponse((err as { statusText?: string })?.statusText, {
      status: statusCode,
    });
  }
}
