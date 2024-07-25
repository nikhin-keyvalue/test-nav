import { Typography } from '@AM-i-B-V/ui-kit';

import { DiscountRequest } from '@/containers/quotations/api/type';
import { useTranslations } from '@/hooks/translation';
import { formatCurrencyAfterRounding } from '@/utils/currency';

const DiscountItem = ({
  discount,
  id,
}: {
  id: number | string;
  discount: DiscountRequest;
}) => {
  const t = useTranslations();

  return (
    <div className='mb-4 flex w-full justify-between' key={`ProdItem ${id}`}>
      <div className='flex justify-start'>
        <div className='w-10' />
        <div className='flex flex-col text-left'>
          <Typography variant='textMediumBold' className='mr-4'>
            {discount?.description ?? t('common.valuedCustomerDiscount')}
          </Typography>
          <Typography variant='textSmall' className='text-grey-56'>
            {t('quotations.discount')}
          </Typography>
        </div>
      </div>
      <Typography variant='textMediumBold' className='flex flex-col text-right'>
        <div>
          -{' '}
          {formatCurrencyAfterRounding({
            value: discount?.totalDiscount,
          })}
        </div>
      </Typography>
    </div>
  );
};

export default DiscountItem;
