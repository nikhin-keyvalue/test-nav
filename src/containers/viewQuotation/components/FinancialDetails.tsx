import { Typography } from '@AM-i-B-V/ui-kit';

import { PERSON_TYPES } from '@/constants/filter';
import PreviewAllTenantGroups from '@/containers/opportunities/components/PreviewAllTenantGroups';
import {
  LineGroupItemsQuotationUpdateRequest,
  QuotationResponse,
} from '@/containers/quotations/api/type';
import { useTranslations } from '@/hooks/translation';
import { mergeStrings } from '@/utils/common';
import { formatDate } from '@/utils/date';

const FinancialDetails = ({
  quoteDetails,
}: {
  quoteDetails: QuotationResponse;
}) => {
  const t = useTranslations();

  const getInfoBasedOnPersonType = () => {
    const data =
      quoteDetails.person?.type === PERSON_TYPES.PRIVATE
        ? quoteDetails?.person
        : quoteDetails?.organisation;
    const { primaryAddress, email, phoneNumber } = data || {};
    return { address: primaryAddress, email, phoneNumber };
  };

  const { address, email, phoneNumber } = getInfoBasedOnPersonType();

  return (
    <div className='w-full px-6 lg:px-20'>
      <div className='mb-10 w-max self-stretch text-3xl font-bold leading-10 text-grey-26'>
        {t('shareQuotation.financialDetails')}
      </div>

      <div className='inline-flex w-full flex-col items-start justify-start gap-10 bg-white pb-8'>
        <div className='flex w-full flex-col items-start justify-start gap-8 self-stretch pb-6'>
          <div className='flex w-full items-start justify-between gap-8 self-stretch text-secondary'>
            <div className='w-[48%] text-base font-normal leading-tight'>
              {mergeStrings({
                values: [
                  quoteDetails.person?.firstName,
                  quoteDetails.person?.middleName,
                  quoteDetails.person?.lastName,
                ],
              })}
              {quoteDetails.person?.type === 'Business' && (
                <Typography variant='textMedium'>
                  {quoteDetails?.organisation?.name}
                </Typography>
              )}

              <section>
                <Typography variant='textMedium'>
                  {address?.street}
                  {` `}
                  {address?.houseNumber}
                </Typography>
                <Typography variant='textMedium'>
                  {address?.postalCode}
                  {` `}
                  {address?.city}
                </Typography>
              </section>
              <Typography variant='textMedium'>{phoneNumber}</Typography>
              <Typography variant='textMedium'>{email}</Typography>
            </div>
            <div>
              {quoteDetails.dealer?.dealerName}
              <section>
                <Typography variant='textMedium'>
                  {quoteDetails.dealer?.address?.street}
                  {` `} {quoteDetails.dealer?.address?.houseNumber}
                </Typography>
                <Typography variant='textMedium'>
                  {quoteDetails.dealer?.address?.postalCode}
                  {` `}
                  {quoteDetails.dealer?.address?.city}
                </Typography>
              </section>
            </div>
          </div>
          <div className='inline-flex flex-wrap items-end justify-start gap-8 self-stretch'>
            <div className='flex gap-10'>
              <div className='inline-flex min-w-36 max-w-60 flex-col items-start justify-start'>
                <div className='self-stretch text-xs font-normal leading-none text-grey-56'>
                  {t('shareQuotation.quotationName')}
                </div>
                <div className=' text-base font-normal leading-tight text-grey-26'>
                  {quoteDetails.proposalIdentifier}
                </div>
              </div>
            </div>

            <div className='flex gap-10'>
              <div className='inline-flex w-36 flex-col items-start justify-start'>
                <div className='self-stretch text-xs font-normal leading-none text-grey-56'>
                  {t('common.date')}
                </div>
                <div className='self-stretch text-base font-normal leading-tight text-grey-26'>
                  {formatDate(quoteDetails.quotationDate, 'DD MMM YYYY')}
                </div>
              </div>
              <div className='inline-flex w-36 flex-col items-start justify-start'>
                <div className='self-stretch text-xs font-normal leading-none text-grey-56'>
                  {t('common.validUntil')}
                </div>
                <div className='self-stretch text-base font-normal leading-tight text-grey-26'>
                  {formatDate(quoteDetails.quotationValidUntil, 'DD MMM YYYY')}
                </div>
              </div>
            </div>
          </div>
          <div className='w-full border-t pt-10'>
            {quoteDetails?.lineGroupItems && (
              <PreviewAllTenantGroups
                lineGroupItems={
                  quoteDetails.lineGroupItems as LineGroupItemsQuotationUpdateRequest
                }
                vatType={quoteDetails.vatType}
                totalAfterDiscountExclVAT={
                  quoteDetails.totalAfterDiscountExclVAT
                }
                totalAfterDiscountInclVAT={
                  quoteDetails.totalAfterDiscountInclVAT
                }
                totalExclVat={quoteDetails.totalExclVat}
                vat={quoteDetails.vat || 0}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDetails;
