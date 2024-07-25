'use client';

import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { changeLanguageAction } from '@/utils/languageActions';

import { QUOTATION_STATUSES } from '../opportunities/types';
import { QuotationResponse } from '../quotations/api/type';
import AcceptedQuotation from './components/AcceptedQuote';
import CoverPage from './components/CoverPage';
import FinancialDetails from './components/FinancialDetails';
import Footer from './components/Footer';
import QuotationDetails from './components/QuotationDetails';
import SideNav from './components/SideNav';
import TradeInVehicle from './components/TradeInVehicle';
import VehicleDetails from './components/VehicleDetails';
import { activePageUrlKey } from './constants';
import { SHARE_QUOTE_PAGES } from './types';

const ShareQuotationWrapper = ({
  quotationDetails,
  langCookie,
}: {
  quotationDetails: QuotationResponse;
  langCookie?: RequestCookie;
}) => {
  const [pageNumber, setPageNumber] = useState(0);
  const router = useRouter();

  const purchaseVehicleDetails = quotationDetails?.lineGroupItems?.find(
    (item) => item.purchases?.length
  )?.purchases?.[0];

  const tradeInDetails = quotationDetails?.lineGroupItems?.find(
    (item) => item.tradeIns?.length
  )?.tradeIns?.[0];

  const [quotePages, setQuotePages] = useState<SHARE_QUOTE_PAGES[]>([
    SHARE_QUOTE_PAGES.QUOTATION_DETAILS,
  ]);

  const getActivePage = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const activePage = Number(searchParams.get(activePageUrlKey)) || 0;

    return { searchParams, activePage };
  };

  useEffect(() => {
    if (!langCookie?.value) changeLanguageAction('nl');
  }, [langCookie]);

  useEffect(() => {
    const { activePage } = getActivePage();
    const arrayToBeAdded: SHARE_QUOTE_PAGES[] = [];

    if (purchaseVehicleDetails)
      arrayToBeAdded.push(SHARE_QUOTE_PAGES.VEHICLE_DETAILS);
    if (tradeInDetails) arrayToBeAdded.push(SHARE_QUOTE_PAGES.TRADE_IN_VEHICLE);

    arrayToBeAdded.push(SHARE_QUOTE_PAGES.FINANCIAL_DETAILS);

    if (
      quotationDetails.status === 'AgreementSigned' ||
      quotationDetails.status === 'PreliminaryAgreement'
    ) {
      arrayToBeAdded.push(SHARE_QUOTE_PAGES.ACCEPTED_QUOTATION);
    }

    setPageNumber(activePage);

    setQuotePages([...quotePages, ...arrayToBeAdded]);
  }, []);

  useEffect(() => {
    if (quotePages.includes(SHARE_QUOTE_PAGES.ACCEPTED_QUOTATION)) {
      setPageNumber(quotePages.length);
    }
  }, [quotePages]);

  useEffect(() => {
    const { activePage, searchParams } = getActivePage();

    const pageToAppend = pageNumber || activePage;
    searchParams.set(activePageUrlKey, String(pageToAppend));

    router.push(`?${searchParams.toString()}`);
  }, [pageNumber]);

  const getQuotePage = (pageIndex: number) => {
    const pageToSectionMap: Record<SHARE_QUOTE_PAGES, JSX.Element> = {
      [SHARE_QUOTE_PAGES.QUOTATION_DETAILS]: (
        <QuotationDetails
          quoteDetails={quotationDetails}
          showFinance={!!purchaseVehicleDetails?.id}
          purchaseVehicleDetails={purchaseVehicleDetails}
        />
      ),
      [SHARE_QUOTE_PAGES.VEHICLE_DETAILS]: (
        <VehicleDetails purchaseVehicleDetails={purchaseVehicleDetails} />
      ),
      [SHARE_QUOTE_PAGES.TRADE_IN_VEHICLE]: (
        <TradeInVehicle tradeInDetails={tradeInDetails} />
      ),
      [SHARE_QUOTE_PAGES.FINANCIAL_DETAILS]: (
        <FinancialDetails quoteDetails={quotationDetails} />
      ),
      [SHARE_QUOTE_PAGES.ACCEPTED_QUOTATION]: (
        <AcceptedQuotation quoteDetails={quotationDetails} />
      ),
    };

    return pageToSectionMap[quotePages[pageIndex - 1]];
  };

  return pageNumber === 0 ? (
    <CoverPage
      setPageNumber={setPageNumber}
      quoteDetails={quotationDetails}
      vehicleName={purchaseVehicleDetails?.name}
    />
  ) : (
    <div className='relative h-svh w-screen'>
      <section className='flex'>
        <SideNav
          quotePages={quotePages}
          pageIndex={pageNumber}
          setPageNumber={setPageNumber}
          quoteDetails={quotationDetails}
          purchaseVehicleDetails={purchaseVehicleDetails}
        />
        <div className='relative w-full md:w-[calc(100vw-360px)]'>
          <div
            className='absolute top-0 z-10 h-[340px] w-full bg-cover bg-center'
            style={{ backgroundImage: `url('/viewQuoteBackground.svg')` }}
          />
          <div
            className='absolute top-0 z-20 mx-5 mt-5 inline-flex h-[calc(100svh-110px)] w-[calc(100%-2.5rem)] flex-col
            items-start justify-start gap-4 overflow-auto bg-white pb-16 pt-10 shadow md:mx-20 md:mt-12
            md:h-[calc(100svh-130px)] md:w-[calc(100%-10rem)] lg:mx-24 lg:w-[calc(100%-12rem)] xl:mx-36 xl:w-[calc(100%-18rem)]'
          >
            {getQuotePage(pageNumber)}
          </div>
        </div>
      </section>

      <Footer
        setPageNumber={setPageNumber}
        pageIndex={pageNumber}
        maxPages={
          quotePages.includes(SHARE_QUOTE_PAGES.ACCEPTED_QUOTATION)
            ? quotePages.length - 1
            : quotePages.length
        }
        status={quotationDetails.status as QUOTATION_STATUSES}
      />
    </div>
  );
};

export default ShareQuotationWrapper;
