import { LineGroupItemTradeIn } from '@/containers/quotations/api/type';
import { useTranslations } from '@/hooks/translation';

const TradeInVehicle = ({
  tradeInDetails,
}: {
  tradeInDetails?: LineGroupItemTradeIn;
}) => {
  const t = useTranslations();
  const {
    mileage,
    licensePlate,
    tradeInValue,
    imageUrls = [],
  } = tradeInDetails || {};

  const splitImageArray = [];

  for (let i = 0; i < imageUrls.length; i += 2) {
    splitImageArray.push(imageUrls.slice(i, i + 2));
  }
  return (
    <>
      <div className='inline-flex w-full flex-col items-start justify-start gap-4 bg-white px-6 pb-[37px] pt-10 lg:px-20'>
        <div className="self-stretch font-['Montserrat'] text-3xl font-bold leading-10 text-grey-26">
          {t('common.tradeInVehicle')}: {tradeInDetails?.description}
        </div>
      </div>

      <div className='inline-flex h-96 w-full flex-col items-start justify-start gap-1'>
        <div className='flex h-20 flex-col items-start justify-start gap-6 bg-white px-6 pb-10 pr-10 lg:px-20'>
          <div className='flex h-9 flex-col items-start justify-start gap-4'>
            <div className='inline-flex items-start justify-start gap-4 self-stretch'>
              <div className='inline-flex shrink grow flex-col items-start justify-start'>
                <div className="self-stretch font-['Montserrat'] text-xs font-normal leading-none text-grey-56">
                  {t('quotations.lineGroups.tradeIn.mileage')}
                </div>
                <div className="self-stretch font-['Montserrat'] text-base font-normal leading-tight text-grey-26">
                  {mileage} km
                </div>
              </div>
              <div className='inline-flex shrink grow flex-col items-start justify-start'>
                <div className="self-stretch font-['Montserrat'] text-xs font-normal leading-none text-grey-56">
                  {t('quotations.lineGroups.tradeIn.licensePlate')}
                </div>
                <div className="self-stretch font-['Montserrat'] text-base font-normal leading-tight text-grey-26">
                  {licensePlate ?? '-'}
                </div>
              </div>
              <div className='inline-flex shrink grow flex-col items-start justify-start'>
                <div className="self-stretch font-['Montserrat'] text-xs font-normal leading-none text-grey-56">
                  {t('quotations.lineGroups.tradeIn.tradeInValue')}
                </div>
                <div className="self-stretch font-['Montserrat'] text-base font-normal leading-tight text-grey-26">
                  € {tradeInValue}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='w-full flex-col items-start gap-4'>
          {splitImageArray.map((innerArray) => (
            <div
              className='mb-3 flex flex-wrap justify-between gap-4'
              key={innerArray[0]}
            >
              <img
                alt='tradeInImage_1'
                className='grow object-contain xl:max-w-[48%]'
                src={innerArray[0]}
              />
              {innerArray[1] && (
                <img
                  alt='tradeInImage_2'
                  className='grow object-contain xl:max-w-[48%]'
                  src={innerArray[1]}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TradeInVehicle;
