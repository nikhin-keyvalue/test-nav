import { cookies } from 'next/headers';

import { LANG_COOKIE_KEY } from '@/constants/language';
import { getCookieOptions } from '@/utils/cookieActions';

import { getQuotationDetailsByToken } from './api/actions';
import ViewQuotationClient from './ViewQuotation.Client';

const ViewQuotationServer = async ({ token }: { token: string }) => {
  const quotationDetails = await getQuotationDetailsByToken(token);
  const langCookie = cookies().get(getCookieOptions(LANG_COOKIE_KEY, 'nl'));

  return (
    <ViewQuotationClient
      quotationDetails={quotationDetails!}
      langCookie={langCookie}
    />
  );
};

export default ViewQuotationServer;
