import { Button } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

import { QuotationResponse } from '@/containers/quotations/api/type';
import { useTranslations } from '@/hooks/translation';
import { mergeStrings } from '@/utils/common';
import { formatDate } from '@/utils/date';

import { CompanyLogo, CoverImage, PrimaryColor } from '../constants';
import LanguageChangeComponent from './LanguageChangeComponent';

const CoverPage = ({
  setPageNumber,
  quoteDetails,
  vehicleName,
}: {
  setPageNumber: Dispatch<SetStateAction<number>>;
  quoteDetails: QuotationResponse;
  vehicleName?: string;
}) => {
  const t = useTranslations();

  const personName =
    mergeStrings({
      values: [
        quoteDetails?.person?.firstName,
        quoteDetails?.person?.middleName,
        quoteDetails?.person?.lastName,
      ],
    }) || '-';

  return (
    <>
      <div className='w-100vw flex flex-col-reverse md:flex-row'>
        <section className='flex w-full justify-center md:w-[360px]'>
          <div className='inline-flex h-96 w-96 flex-col items-start justify-start gap-10 bg-white p-10'>
            <div className='flex h-14 flex-col items-start justify-start gap-2 self-stretch px-6'>
              <img className='h-14 w-56' src={CompanyLogo} alt='company_logo' />
            </div>
            <div className='hidden pl-6 text-3xl font-bold leading-10 text-gray-700 md:block'>
              {t('shareQuotation.yourQuotation')}
            </div>
            <Button
              onClick={() => setPageNumber(1)}
              variant='contained'
              sx={{
                background: PrimaryColor,
              }}
              className='mx-6 block h-12 w-[calc(100%-48px)] text-[15px] font-bold normal-case hover:!bg-sky-700 md:hidden'
            >
              {t('shareQuotation.viewQuotation')}
            </Button>
            <div className='flex h-80 flex-col items-start justify-start gap-8 self-stretch'>
              <div
                style={{ background: PrimaryColor }}
                className='h-px self-stretch opacity-10'
              />
              <div className='flex h-60 flex-col items-start justify-start self-stretch px-6'>
                <div className='flex h-60 flex-col items-start justify-start gap-10 self-stretch'>
                  <div className='flex flex-col items-start justify-start gap-2 self-stretch'>
                    <div className="self-stretch font-['Montserrat'] text-base font-normal leading-tight text-grey-26">
                      {vehicleName
                        ? t('shareQuotation.newVehicleDelivery')
                        : t('deliveries.deliveryOf')}
                    </div>
                    <div className="self-stretch font-['Montserrat'] text-base font-bold leading-tight text-grey-26">
                      {(vehicleName || quoteDetails?.proposalIdentifier) ?? '-'}
                    </div>
                  </div>
                  <div className='flex flex-col items-start justify-start gap-2 self-stretch'>
                    <div className="self-stretch font-['Montserrat'] text-base font-normal leading-tight text-grey-26">
                      {t('shareQuotation.ourValuedCustomer')}
                    </div>
                    <div className="self-stretch font-['Montserrat'] text-base font-bold leading-tight text-grey-26">
                      {personName}
                    </div>
                  </div>
                  <div className='flex flex-col items-start justify-start gap-2 self-stretch'>
                    <div className="self-stretch font-['Montserrat'] text-base font-normal leading-tight text-grey-26">
                      {t('shareQuotation.Quotation')} {quoteDetails.proposalIdentifier}
                    </div>
                    <div className="self-stretch font-['Montserrat'] text-base font-bold leading-tight text-grey-26">
                      {quoteDetails.quotationValidUntil
                        ? `${t('common.validUntil')} ${formatDate(
                            quoteDetails.quotationValidUntil,
                            'DD MMM YYYY'
                          )}`
                        : '-'}
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{ background: PrimaryColor }}
                className='h-px self-stretch opacity-10'
              />
            </div>
            <Button
              onClick={() => setPageNumber(1)}
              variant='contained'
              sx={{
                background: PrimaryColor,
              }}
              className='mx-6 hidden h-12 w-[calc(100%-48px)] text-[15px] font-bold normal-case hover:!bg-sky-700 md:block'
            >
              {t('shareQuotation.viewQuotation')}
            </Button>
          </div>
        </section>

        <section
          className='h-[40vh] grow bg-cover bg-center bg-no-repeat md:h-[100vh]'
          style={{
            backgroundImage: `url(${CoverImage})`,
          }}
        />
      </div>
      <div className='sticky bottom-[30px] ml-[20px]'>
        <LanguageChangeComponent />
      </div>
    </>
  );
};

export default CoverPage;
