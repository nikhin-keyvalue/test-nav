import { paths } from '@generated/metafactory-service-types';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { convertDateFormat, dateDifferenceInDays } from '@/utils/date';

import Pill from './Pill';

const StockSubheading = ({
  carDetails,
}: {
  carDetails: paths['/api/carstock/{id}/header']['get']['responses']['200']['schema'] & {
    licensePlate?: string;
  };
}) => {
  const t = useTranslations('stock.listedCar');

  return (
    <>
      <div className='flex flex-col items-start gap-2 font-roboto lg:flex-row lg:items-center'>
        {carDetails?.licensePlate ? (
          <span className='rounded-sm border-2 border-solid border-secondary px-2 py-0.5 text-xs font-semibold leading-4 text-secondary'>
            {carDetails?.licensePlate}
          </span>
        ) : null}
        {carDetails?.consignment && (
          <Pill variant='small'>{t('consignment')}</Pill>
        )}{' '}
        <p className='m-0 text-[15px] leading-snug '>
          {t(carDetails?.newCar ? 'newCar' : 'usedCar')} •{' '}
          <span data-testid='chassisNumber'>{carDetails?.chassis}</span> •{' '}
          {carDetails?.numberOfOpenTask !== 0 &&
            `${t('openTasks', {
              count: carDetails?.numberOfOpenTask,
            })} • `}
          {carDetails?.createdOn &&
            t('daysInAMI', {
              days: dateDifferenceInDays(
                new Date(carDetails?.createdOn),
                new Date()
              ),
            })}
        </p>
      </div>
      <div className='flex items-center gap-2 py-[0.1875rem] font-roboto text-xs'>
        <p className='m-0 text-secondary-500'>
          {t('updated', {
            date: convertDateFormat(carDetails?.updatedOn, undefined, true),
            updater: carDetails?.updater,
          })}
        </p>
        {carDetails?.numberOfOpenProcess ? (
          <div className='align-center flex'>
            <Image
              className='mr-1'
              src='/vitals.svg'
              alt='vitals'
              width={16}
              height={16}
            />
            <span className='font-semibold'>
              {t('queuedActions', { count: carDetails?.numberOfOpenProcess })}
            </span>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default StockSubheading;
