import { GetPrintableQuotationProps } from './type';

export const getTradeInImages = async (
  quotationId: string,
  tradeInId: string
) => {
  try {
    const response: Response = await fetch(
      `/api/getTradeInImages?quotationId=${quotationId}&tradeInId=${tradeInId}`
    );
    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    }
    return [];
  } catch (error) {
    return [];
  }
};

export const getPrintableQuotation = async ({
  quotationId,
  opportunityId,
  markAsShared,
  eSignService,
}: GetPrintableQuotationProps) => {
  const quotationPrintResponse = await fetch(
    `/api/printQuotation/${quotationId}?markShared=${markAsShared}&opportunityId=${opportunityId}&eSignService=${eSignService}`
  );

  if (!quotationPrintResponse.ok) throw new Error();
  return quotationPrintResponse.json();
};
