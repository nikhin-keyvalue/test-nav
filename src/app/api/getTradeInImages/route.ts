import { NextRequest } from 'next/server';

import { imageServiceFetcher } from '@/utils/api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const quotationId = searchParams.get('quotationId');
  const tradeInId = searchParams.get('tradeInId');
  const path = `quotations/${quotationId}/trade-in-vehicles/${tradeInId}/images`;

  const response = await imageServiceFetcher(path);

  return new Response(JSON.stringify(response));
}
