import { documentServiceFetcher } from '@/utils/api';
import { getTokenDecodedValues } from '@/utils/tokenDecodeAction';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get('filename');
  const category = searchParams.get('category');
  const opportunityId = searchParams.get('opportunityId');
  const deliveryId = searchParams.get('deliveryId');

  const REQUEST_URL = `${opportunityId ? 'opportunities' : 'deliveries'}/${
    opportunityId || deliveryId
  }/documents/download?category=${category}&subcategory=${filename}`;

  const reqHeaders = {
    headers: {
      'X-Tenant-Identifier': await getTokenDecodedValues('tenantId'),
    },
  };

  const response = await documentServiceFetcher(REQUEST_URL, reqHeaders, {
    format: false,
    throwError: false,
  });

  if (response.status === 200) {
    return new Response(response.body, {
      headers: response.headers
    });
  }
}
