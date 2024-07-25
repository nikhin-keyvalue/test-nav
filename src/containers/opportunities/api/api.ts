import { DealersResponse, SalespersonListResponse } from '@/types/metafactory';
import { getTraceId } from '@/utils/common';

export const getDealers = async () => {
  try {
    const response: Response = await fetch('/api/dealers');
    if (response.ok) {
      const responseData: { data: DealersResponse } = await response.json();
      return responseData?.data;
      // setDealerListData(responseData?.data ?? []);
    }
    return [];
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('getDealersForOpportunityFunction')
    );
    return [];
  }
};

export const getSalesPersons = async () => {
  try {
    const response: Response = await fetch('/api/salespersons');
    if (response.ok) {
      const responseData: { data: SalespersonListResponse } =
        await response.json();
      return responseData?.data;
    }
    return [];
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('getSalesPersonsForOpportunityFunction')
    );
    return [];
  }
};
