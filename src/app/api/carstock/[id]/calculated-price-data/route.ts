import { NextRequest, NextResponse } from 'next/server';

import { metaFactoryFetcher } from '@/utils/api';
import { getTraceId } from '@/utils/common';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const res = await metaFactoryFetcher(
      `api/carstock/${params.id}/calculated-price-data`,
      undefined,
      {
        format: false,
        throwError: false,
      }
    );

    if (res.ok) {
      const data = await res.json();
      return Response.json(data);
    }
    throw new Error(res);
  } catch (err) {
    console.log(
      'ERROR Something went wrong :',
      err,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('getCarStockCalculatedPriceRouteHandler')
    );
    return new NextResponse('Internal error', { status: 500 });
  }
}
