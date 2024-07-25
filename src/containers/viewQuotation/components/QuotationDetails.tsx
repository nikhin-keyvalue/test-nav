import {
  LineGroupItemPurchase,
  QuotationResponse,
} from '@/containers/quotations/api/type';
import { useTranslations } from '@/hooks/translation';
import { mergeStrings } from '@/utils/common';

const QuotationDetails = ({
  quoteDetails,
  showFinance,
  purchaseVehicleDetails,
}: {
  quoteDetails: QuotationResponse;
  showFinance: boolean;
  purchaseVehicleDetails?: LineGroupItemPurchase;
}) => {
  const t = useTranslations('shareQuotation');
  const tCommon = useTranslations('common');

  const displayName = purchaseVehicleDetails?.id
    ? `${tCommon('new')} ${purchaseVehicleDetails.brandDescription ?? '-'}`
    : t('products/services');

  const personName =
    mergeStrings({
      values: [
        quoteDetails?.person?.firstName,
        quoteDetails?.person?.middleName,
        quoteDetails?.person?.lastName,
      ],
    }) || '-';

  return (
    <div className='px-6 lg:px-20'>
      <div className='flex flex-col items-start justify-start gap-6'>
        <div className='self-stretch text-3xl font-bold leading-10 text-grey-26'>
          {t('Quotation')}
        </div>
        <div className='self-stretch text-base font-normal leading-tight text-grey-26'>
          {t('DearCustomer', { customerName: personName })},
          <br />
          <div className='mt-4'>{t('requestText')}</div>
        </div>
        <div className='flex flex-col items-start justify-start gap-3 self-stretch'>
          <div className='self-stretch text-xl font-bold leading-7 text-grey-26'>
            {t('firstSectionTitle')}
          </div>
          <div className='self-stretch text-base font-normal leading-tight text-grey-26'>
            {t('firstSectionContent')}
          </div>
        </div>
        <div className='flex flex-col items-start justify-start gap-3 self-stretch'>
          <div className='self-stretch text-xl font-bold leading-7 text-grey-26'>
            {t('secondSectionTitle')}
          </div>
          <div className='self-stretch text-base font-normal leading-tight text-grey-26'>
            {t('secondSectionContent', { brand: displayName })}
          </div>
        </div>
        {showFinance && (
          <div className='flex flex-col items-start justify-start gap-3 self-stretch'>
            <div className='self-stretch text-xl font-bold leading-7 text-grey-26'>
              {t('thirdSectionTitle')}
            </div>
            <div className='self-stretch text-base font-normal leading-tight text-grey-26'>
              {t('thirdSectionContent')}
            </div>
          </div>
        )}
        <div className='flex flex-col items-start justify-start gap-3 self-stretch'>
          <div className='self-stretch text-xl font-bold leading-7 text-grey-26'>
            {t('fourthSectionTitle')}
          </div>
          <div className='self-stretch text-base font-normal leading-tight text-grey-26'>
            {t('fourthSectionContent', { brand: displayName })}
            <br />
            <div className='mt-4'>{t('fourthSectionSubContent')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationDetails;
