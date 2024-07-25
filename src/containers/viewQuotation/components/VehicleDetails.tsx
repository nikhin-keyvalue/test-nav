import { LineGroupItemPurchase } from '@/containers/quotations/api/type';
import { useTranslations } from '@/hooks/translation';

const VehicleDetails = ({
  purchaseVehicleDetails,
}: {
  purchaseVehicleDetails?: LineGroupItemPurchase;
}) => {
  const {
    energyLabel,
    co2,
    exteriorColorDescription,
    interiorColorDescription,
    engineName,
    imageUrls,
    transmission,
    gradeName: edition,
    range,
    powertrainName: drive,
    enginePerformance: power,
  } = purchaseVehicleDetails || {};
  const t = useTranslations();

  return (
    <div className='inline-flex h-20 w-full flex-col items-start justify-start gap-6'>
      <div className='px-6 text-3xl font-bold leading-10 text-grey-26 lg:px-20'>
        {purchaseVehicleDetails?.description}
      </div>

      <div className='inline-flex w-full flex-col items-center justify-start gap-1'>
        {imageUrls?.[0] && (
          <img
            className='h-96 w-full object-contain'
            src={imageUrls?.[0]}
            alt='carmimage'
          />
        )}
        <div className='inline-flex w-full flex-wrap items-start'>
          <div className='inline-flex w-96 flex-col items-start justify-start gap-6 bg-white px-6 pb-10 pt-8 md:px-10'>
            <div className='flex flex-col items-start justify-start gap-3 self-stretch'>
              <div className='text-xl font-bold leading-7 text-grey-26'>
                {t('shareQuotation.your')}{' '}
                {purchaseVehicleDetails?.modelDescription ||
                  t('shareQuotation.car')}
              </div>
              <div className='text-base font-normal leading-tight text-grey-26'>
                {t('shareQuotation.tailorMade')}
              </div>
            </div>
            <div className='flex flex-col items-start justify-start gap-4'>
              <div className='inline-flex w-80 items-start justify-start gap-4'>
                <div className='inline-flex shrink grow basis-0 flex-col items-start justify-start'>
                  <div className='text-xs font-normal leading-none text-grey-56'>
                    {t('shareQuotation.edition')}
                  </div>
                  <div className='text-base font-normal leading-tight text-grey-26'>
                    {edition ?? '-'}
                  </div>
                </div>
                <div className='inline-flex shrink grow basis-0 flex-col items-start justify-start'>
                  <div className='text-xs font-normal leading-none text-grey-56'>
                    {t('shareQuotation.range')}
                  </div>
                  <div className='text-base font-normal leading-tight text-grey-26'>
                    {range ? `${range} km` : '-'}
                  </div>
                </div>
              </div>
              <div className='inline-flex w-80 items-start justify-start gap-4'>
                <div className='inline-flex shrink grow basis-0 flex-col items-start justify-start'>
                  <div className='text-xs font-normal leading-none text-grey-56'>
                    {t('shareQuotation.energyLabel')}
                  </div>
                  <div className='text-base font-normal leading-tight text-grey-26'>
                    {energyLabel ?? '-'}
                  </div>
                </div>
                <div className='inline-flex shrink grow basis-0 flex-col items-start justify-start'>
                  <div className='text-xs font-normal leading-none text-grey-56'>
                    {t('shareQuotation.co2')}
                  </div>
                  <div className='text-base font-normal leading-tight text-grey-26'>
                    {co2 ? `${co2} g/km` : '-'}
                  </div>
                </div>
              </div>
              <div className='inline-flex w-80 items-start justify-start gap-4'>
                <div className='inline-flex shrink grow basis-0 flex-col items-start justify-start'>
                  <div className='text-xs font-normal leading-none text-grey-56'>
                    {t('shareQuotation.exteriorColor')}
                  </div>
                  <div className='text-base font-normal leading-tight text-grey-26'>
                    {exteriorColorDescription ?? '-'}
                  </div>
                </div>
                <div className='inline-flex shrink grow basis-0 flex-col items-start justify-start'>
                  <div className='text-xs font-normal leading-none text-grey-56'>
                    {t('shareQuotation.interiorColor')}
                  </div>
                  <div className='text-base font-normal leading-tight text-grey-26'>
                    {interiorColorDescription ?? '-'}
                  </div>
                </div>
              </div>
              <div className='inline-flex w-80 items-start justify-start gap-4'>
                <div className='inline-flex shrink grow basis-0 flex-col items-start justify-start'>
                  <div className='text-xs font-normal leading-none text-grey-56'>
                    {t('shareQuotation.transmission')}
                  </div>
                  <div className='text-base font-normal leading-tight text-grey-26'>
                    {transmission ?? '-'}
                  </div>
                </div>
                <div className='inline-flex shrink grow basis-0 flex-col items-start justify-start'>
                  <div className='text-xs font-normal leading-none text-grey-56'>
                    {t('shareQuotation.drive')}
                  </div>
                  <div className='text-base font-normal leading-tight text-grey-26'>
                    {drive ?? '-'}
                  </div>
                </div>
              </div>
              <div className='inline-flex w-80 items-start justify-start gap-4'>
                <div className='inline-flex shrink grow basis-0 flex-col items-start justify-start'>
                  <div className='text-xs font-normal leading-none text-grey-56'>
                    {t('shareQuotation.engine')}
                  </div>
                  <div className='text-base font-normal leading-tight text-grey-26'>
                    {engineName ?? '-'}
                  </div>
                </div>
                <div className='inline-flex shrink grow basis-0 flex-col items-start justify-start'>
                  <div className='text-xs font-normal leading-none text-grey-56'>
                    {t('shareQuotation.power')}
                  </div>
                  <div className='text-base font-normal leading-tight text-grey-26'>
                    {power ? `${power} hp` : '-'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {imageUrls?.[1] && (
            <img
              className='grow object-contain lg:w-1/2'
              src={imageUrls?.[1]}
              alt='carImage'
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
