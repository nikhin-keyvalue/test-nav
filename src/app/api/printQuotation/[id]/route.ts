import { revalidatePath } from 'next/cache';

import { crmServiceFetcher } from '@/utils/api';
import { getTraceId } from '@/utils/common';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const opportunityId = searchParams.get('opportunityId');
    const markSharedParam = searchParams.get('markShared');
    const eSignService = searchParams.get('eSignService');

    const response = await crmServiceFetcher(
      `quotations/${params.id}/print?eSignService=${eSignService}${markSharedParam === 'true' ? '&markShared=true' : ''}`,
      undefined,
      { format: false }
    );

    revalidatePath(`/opportunities/${opportunityId}/details`);

    if (response.status === 200) {
      return new Response(response.body);
    }

    return new Response(
      JSON.stringify({ status: response.status, message: response.statusText }),
      {
        status: response.status,
      }
    );
  } catch (error) {
    console.log(
      'Print error occurred : ',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId(`getPrintQuotation${params?.id}`)
    );

    return new Response(
      JSON.stringify({ status: 500, message: 'Internal Server Error' })
    );
  }
}
