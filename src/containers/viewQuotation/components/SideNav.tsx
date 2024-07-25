import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import {
  LineGroupItemPurchase,
  QuotationResponse,
} from '@/containers/quotations/api/type';
import { useTranslations } from '@/hooks/translation';

import {
  CompanyLogo,
  PrimaryColor,
  PrimaryColorWithOpacity,
} from '../constants';
import { SHARE_QUOTE_PAGES } from '../types';

const SideNav = ({
  pageIndex,
  setPageNumber,
  quoteDetails,
  purchaseVehicleDetails,
  quotePages,
}: {
  pageIndex: number;
  setPageNumber: Dispatch<SetStateAction<number>>;
  quoteDetails: QuotationResponse;
  purchaseVehicleDetails?: LineGroupItemPurchase;
  quotePages: SHARE_QUOTE_PAGES[];
}) => {
  const t = useTranslations();
  const [sideNavMap, setSideNavMap] = useState([
    {
      name: `${t('shareQuotation.Quotation')} ${quoteDetails.proposalIdentifier}`,
      onClick: (page: number) => {
        setPageNumber(page);
      },
    },
  ]);

  useEffect(() => {
    const tempSideNavMap = [];
    if (quotePages.includes(SHARE_QUOTE_PAGES.VEHICLE_DETAILS))
      tempSideNavMap.push({
        name: purchaseVehicleDetails?.description ?? '-',
        onClick: (page: number) => {
          setPageNumber(page);
        },
      });

    if (quotePages.includes(SHARE_QUOTE_PAGES.TRADE_IN_VEHICLE))
      tempSideNavMap.push({
        name: t('common.tradeInVehicle'),
        onClick: (page: number) => {
          setPageNumber(page);
        },
      });

    tempSideNavMap.push({
      name: t('shareQuotation.financialDetails'),
      onClick: (page: number) => {
        setPageNumber(page);
      },
    });
    setSideNavMap([...sideNavMap, ...tempSideNavMap]);
  }, [quotePages]);

  return (
    <div className='hidden h-full w-[360px] flex-col items-start justify-start gap-10 bg-white p-10 md:inline-flex'>
      <div className='flex h-14 flex-col items-start justify-start gap-2 self-stretch px-6'>
        <img className='h-14 w-56' src={CompanyLogo} alt='tenentLogo' />
      </div>
      <div className='flex h-64 flex-col items-start justify-start self-stretch'>
        {sideNavMap.map(({ name, onClick }, index) => (
          <div key={name} className='w-full'>
            {index === 0 && (
              <div
                style={{ background: PrimaryColor }}
                className='mr-1.5 h-px self-stretch opacity-10'
              />
            )}
            <div
              style={{
                clipPath: 'polygon(100% 0, 100% 72%, 88% 100%, 0 100%, 0 0)',
                background:
                  pageIndex === index + 1 ? PrimaryColorWithOpacity : 'white',
              }}
              className='inline-flex w-full cursor-pointer items-center justify-center gap-2 self-stretch !bg-opacity-10 py-5 pl-6 pr-4'
              role='presentation'
              onClick={() => onClick(index + 1)}
            >
              <div
                style={{
                  color: pageIndex === index + 1 ? PrimaryColor : '',
                }}
                className={`shrink grow basis-0 font-['Montserrat'] text-base font-bold leading-tight text-grey-26`}
              >
                {name}
              </div>
            </div>
            {!(pageIndex === index + 1) && (
              <div
                style={{ background: PrimaryColor }}
                className='mr-1.5 h-px self-stretch opacity-10'
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideNav;
