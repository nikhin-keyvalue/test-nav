import { SearchParams } from '@/types/common';
import { crmServiceFetcher } from '@/utils/api';
import { queryParamBuilder } from '@/utils/common';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams);

  const response = await crmServiceFetcher(
    `organisations?${queryParamBuilder(params as SearchParams, 'name', false)}`
  );

  return new Response(JSON.stringify(response));
}
