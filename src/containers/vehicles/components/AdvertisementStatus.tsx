import { Typography } from '@AM-i-B-V/ui-kit';
import { definitions } from '@generated/metafactory-service-types';
import { useTranslations } from 'next-intl';

type AdvertisementStatusProps = {
  publishSourceType: definitions['ICarStockListItemDto']['publishSourceType'];
};

const AdvertisementStatus = ({
  publishSourceType,
}: AdvertisementStatusProps) => {
  const t = useTranslations('stock.listedCar');

  return (
    <div className='flex gap-[6px]'>
      <div
        className={`mt-1.5 aspect-square h-3 rounded-full 
        ${publishSourceType === 'AUTOMATIC' && 'bg-[#6E9C6D]'}
        ${publishSourceType === 'MANUAL' && 'bg-[#0587B3]'}
        ${publishSourceType === 'NONE' && 'bg-primary'}`}
      />
      <Typography variant='textMedium'>
        {publishSourceType === 'AUTOMATIC' && t('autoPublished')}
        {publishSourceType === 'MANUAL' && t('manualPublished')}
        {publishSourceType === 'NONE' && t('notPublished')}
      </Typography>
    </div>
  );
};

export default AdvertisementStatus;
