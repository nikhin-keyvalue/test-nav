'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import { Button } from '@mui/material';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion';
import { useRouter } from 'next/navigation';
import React, { Suspense, use } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { MdExpandMore } from 'react-icons/md';

import { composeUrlSegmentWithVehicleId } from '@/containers/quotations/utils';
import { useTranslations } from '@/hooks/translation';
import { convertDateFormat } from '@/utils/date';

import { carStockListTestIds } from '../../../../tests/e2e/constants/testIds';
import {
  getLocalQuotationDetails,
  markVehicleSelectionInLocalStorage,
} from '../constants';
import AdvertisementStatus from './AdvertisementStatus';
import AttributeView, { AttributeViewLoadingFallback } from './AttributeView';
import CarImage from './CarImage';
import ImageType, { ImageTypeLoadingFallback } from './ImageType';
import { PriceAttribute, PriceAttributeFallback } from './PriceAttribute';
import StockSubheading from './StockSubheading';
import { CarStockListData, StockListItem } from './types';

const ListImageErrorFallback = () => {
  const t = useTranslations('stock.listedCar');
  return (
    <>
      <div className='relative h-[94px] w-[150px] lg:h-[129px] lg:w-[205px]'>
        <CarImage style={{ objectFit: 'contain' }} />
      </div>
      <div className='flex items-center justify-center gap-3 lg:flex-col lg:justify-normal lg:gap-1'>
        <span className='text-xs leading-snug text-secondary'>
          {t('noImages')}
        </span>
      </div>
    </>
  );
};

const ListImage = ({
  promise,
  id,
}: {
  promise: Promise<Array<CarStockListData>>;
  id: number;
}) => {
  const imagesResponse = use(promise);
  const image = imagesResponse.find(({ carStockId }) => carStockId === id);
  const t = useTranslations('stock.listedCar');
  const tImage = useTranslations('imageSource');

  return (
    <>
      <div className='relative h-[94px] w-[150px] lg:h-[129px] lg:w-[205px]'>
        <CarImage imgSrc={image?.thumbNail} style={{ objectFit: 'contain' }} />
      </div>
      <div className='flex items-center justify-center gap-3 lg:flex-col lg:justify-normal lg:gap-1'>
        {image?.availableImagesCount ? (
          <>
            <p className='m-0 text-xs leading-snug text-secondary'>
              {image?.activeImagesCount}/{image?.availableImagesCount} •{' '}
              {image?.thumbNailSource ? tImage(image?.thumbNailSource) : ''}
            </p>
            <ImageType imageSources={image?.imageSources} />
          </>
        ) : (
          <span className='text-xs leading-snug text-secondary'>
            {t('noImages')}
          </span>
        )}
      </div>
    </>
  );
};

const ListedCar = (props: {
  carDetails: StockListItem;
  imagesPromise: Promise<Array<CarStockListData>>;
}) => {
  const t = useTranslations('stock.listedCar');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const { carDetails, imagesPromise } = props;

  const handleVehicleSelection = async () => {
    const localQuotationDetails = getLocalQuotationDetails();
    const { redirectUrl } = localQuotationDetails;
    markVehicleSelectionInLocalStorage();
    const updatedRedirectUrl = composeUrlSegmentWithVehicleId({
      urlSegment: redirectUrl,
      vehicleId: carDetails.id,
    });
    router.replace(updatedRedirectUrl);
  };

  // If no key is given for suspense then loader will only show during initial load and not show when applying filters
  const suspenseKey = Date.now();

  return (
    <div
      style={{ textDecoration: 'none' }}
      className='w-full'
      data-testid={carStockListTestIds.carStockListItem}
    >
      <div className='shadow-blockbase flex-row rounded bg-white p-4 pb-0 lg:p-6'>
        <div className='flex items-center gap-3 lg:items-start lg:gap-6'>
          {/* Gap nog niet correct */}
          <div className='mb-[5px] flex gap-5 lg:mb-0'>
            <div className='hidden flex-col gap-2 lg:flex'>
              <ErrorBoundary fallback={<ListImageErrorFallback />}>
                <Suspense
                  fallback={
                    <>
                      <div className='h-[129px] w-[205px] animate-pulse bg-secondary-300' />
                      <div className='flex flex-col items-center gap-1'>
                        <div className='mb-1 h-2.5 w-28 animate-pulse rounded-lg bg-secondary-300' />
                        <ImageTypeLoadingFallback />
                      </div>
                    </>
                  }
                  key={suspenseKey}
                >
                  <ListImage promise={imagesPromise} id={carDetails.id!} />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
          <div className='flex flex-1 flex-col gap-6 text-secondary'>
            <div className='flex items-center'>
              <div className='mr-1 flex-1'>
                <p
                  className='m-0 mb-0.5 font-kanit text-base font-semibold leading-tight text-primary lg:text-2xl'
                  data-testid={carStockListTestIds.vehicleDescription}
                >
                  {carDetails?.vehicleDescription}
                </p>
                <div className='hidden lg:block'>
                  <StockSubheading
                    carDetails={{
                      consignment: carDetails?.consignment,
                      newCar: carDetails?.newCar,
                      chassis: carDetails?.chassis,
                      licensePlate: carDetails?.licensePlate,
                      numberOfOpenTask: carDetails?.numberOfOpenTasks,
                      numberOfOpenProcess: carDetails?.numberOfOpenProcess,
                      createdOn: carDetails?.createdOn,
                      updatedOn: carDetails?.updatedOn,
                      updater: carDetails?.updater,
                    }}
                  />
                </div>
              </div>
              <div className='flex h-full items-start'>
                <Button
                  className='h-10'
                  variant='contained'
                  data-testid={carStockListTestIds.selectVehicleButton}
                  onClick={handleVehicleSelection}
                >
                  <Typography variant='textSmallBold' className='normal-case'>
                    {tCommon('selectThis')}
                  </Typography>
                </Button>
              </div>
            </div>
            <div className='hidden gap-5 lg:flex'>
              {carDetails?.stockStatus && (
                <AttributeView
                  className='w-full max-w-[133px]'
                  name={t('stockStatus')}
                >
                  {t(carDetails?.stockStatus)}
                </AttributeView>
              )}
              <AttributeView
                className='w-full max-w-[133px]'
                name={t('deliveryDate')}
              >
                {carDetails?.estimatedDeliveryDate ? (
                  <>
                    <Typography variant='textMedium'>
                      {convertDateFormat(carDetails?.estimatedDeliveryDate)}
                    </Typography>
                    {carDetails?.stockStatus === 'EXPECTED' ? (
                      <Typography variant='textSmall'>
                        {t('expected')}
                      </Typography>
                    ) : null}
                  </>
                ) : (
                  <span>-</span>
                )}
              </AttributeView>
              <ErrorBoundary fallback={<div />}>
                <Suspense
                  fallback={<PriceAttributeFallback />}
                  key={suspenseKey}
                >
                  <PriceAttribute carDetails={carDetails} />
                </Suspense>
              </ErrorBoundary>
              <AttributeView
                className='w-full max-w-[133px]'
                name={t('mileage')}
              >
                {carDetails?.latestMileage
                  ? `${carDetails?.latestMileage} km`
                  : '-'}
              </AttributeView>
              <AttributeView
                className='w-full max-w-[170px]'
                name={t('dealerLocation')}
              >
                {carDetails?.seller ?? '-'}
              </AttributeView>
              <AttributeView
                className='w-full max-w-[133px]'
                name={t('advertisementStatus')}
              >
                <AdvertisementStatus
                  publishSourceType={carDetails.publishSourceType}
                />
              </AttributeView>
            </div>
          </div>
        </div>
        <div className='flex flex-row gap-2 py-4 lg:hidden'>
          <div className='flex flex-col gap-2'>
            <ErrorBoundary fallback={<ListImageErrorFallback />}>
              <Suspense
                fallback={
                  <>
                    <div className='h-[94px] w-[150px] animate-pulse bg-secondary-300' />
                    <div className='flex items-center justify-center gap-3'>
                      <div className='h-2.5 w-10 animate-pulse rounded-lg bg-secondary-300' />
                      <ImageTypeLoadingFallback />
                    </div>
                  </>
                }
                key={suspenseKey}
              >
                <ListImage promise={imagesPromise} id={carDetails.id!} />
              </Suspense>
            </ErrorBoundary>
          </div>
          <div className='text-secondary'>
            <StockSubheading
              carDetails={{
                consignment: carDetails?.consignment,
                newCar: carDetails?.newCar,
                chassis: carDetails?.chassis,
                licensePlate: carDetails?.licensePlate,
                numberOfOpenTask: carDetails?.numberOfOpenTasks,
                numberOfOpenProcess: carDetails?.numberOfOpenProcess,
                createdOn: carDetails?.createdOn,
                updatedOn: carDetails?.updatedOn,
                updater: carDetails?.updater,
              }}
            />
          </div>
        </div>
        {/* Mobile detail accordion */}
        <Accordion
          type='single'
          collapsible
          className='border-x-0 border-b-0 border-t border-solid border-[#DEE0E2] lg:hidden'
          onClick={(event) => event.preventDefault()}
        >
          <AccordionItem value='sort'>
            <AccordionContent className='py-4'>
              <div className='grid grid-cols-2 gap-y-4 text-secondary'>
                <AttributeView name={t('stockStatus')}>
                  {carDetails?.stockStatus ? t(carDetails.stockStatus) : '-'}
                </AttributeView>
                <AttributeView name={t('deliveryDate')}>
                  {carDetails?.estimatedDeliveryDate ? (
                    <>
                      <Typography variant='textMedium'>
                        {convertDateFormat(carDetails?.estimatedDeliveryDate)}
                      </Typography>
                      {carDetails?.stockStatus === 'EXPECTED' ? (
                        <Typography variant='textSmall'>
                          {t('expected')}
                        </Typography>
                      ) : null}
                    </>
                  ) : (
                    <span>-</span>
                  )}
                </AttributeView>
                <ErrorBoundary fallback={<div />}>
                  <Suspense
                    fallback={<PriceAttributeFallback />}
                    key={suspenseKey}
                  >
                    <PriceAttribute carDetails={carDetails} />
                  </Suspense>
                </ErrorBoundary>
                <AttributeView name={t('mileage')}>
                  {carDetails?.latestMileage
                    ? `${carDetails?.latestMileage} km`
                    : '-'}
                </AttributeView>
                <AttributeView name={t('dealerLocation')}>
                  {carDetails?.seller ?? '-'}
                </AttributeView>
                <AttributeView
                  className='w-full max-w-[133px]'
                  name={t('advertisementStatus')}
                >
                  <AdvertisementStatus
                    publishSourceType={carDetails.publishSourceType}
                  />
                </AttributeView>
              </div>
            </AccordionContent>
            <AccordionTrigger className='group flex w-full items-center border-0 border-[#DEE0E2] bg-white px-0 pb-4 pt-3 text-left text-base font-semibold data-[state=open]:border-t'>
              <div className='flex flex-1 items-center text-secondary'>
                <MdExpandMore className='m-0 h-6 w-6 group-data-[state=open]:rotate-180' />
                <Typography
                  variant='textMediumBold'
                  className='group-data-[state=open]:hidden'
                >
                  {t('showDetails')}
                </Typography>
                <Typography
                  variant='textMediumBold'
                  className='group-data-[state=closed]:hidden'
                >
                  {t('hideDetails')}
                </Typography>
              </div>
            </AccordionTrigger>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default ListedCar;

export const ListedCarLoadingFallback = () => (
  <div className='shadow-blockbase flex-row rounded bg-white p-4 lg:p-6'>
    <div className='flex items-center gap-3 lg:items-start lg:gap-6'>
      <div className='mb-[5px] flex gap-5 lg:mb-0'>
        <div className='hidden flex-col gap-2 lg:flex'>
          <div className='h-[129px] w-[205px] animate-pulse bg-secondary-300' />
        </div>
      </div>
      {/* Information */}
      <div className='flex flex-1 flex-col gap-6 text-secondary'>
        {/* Top Information */}
        <div className='flex items-center'>
          {/* Title text */}
          <div className='flex-1'>
            <div className='mb-3 mt-2 hidden h-5 w-2/3 animate-pulse rounded-full bg-secondary-300 lg:block' />
            <div className='mb-1.5 h-3 w-1/2 animate-pulse rounded-full bg-secondary-300' />
            <div className='mb-2 hidden h-2.5 w-1/3 animate-pulse rounded-full bg-secondary-300 lg:block' />
          </div>
        </div>
        {/* Bottom Information */}
        <div className='hidden gap-5 lg:flex'>
          <AttributeViewLoadingFallback className='w-full' />
          <AttributeViewLoadingFallback className='w-full' />
          <AttributeViewLoadingFallback className='w-full' />
          <AttributeViewLoadingFallback className='w-full' />
          <AttributeViewLoadingFallback className='w-full' />
          <AttributeViewLoadingFallback className='w-full' />
        </div>
      </div>
    </div>
    {/* Mobile image and information */}
    <div className='flex flex-row gap-2 py-4 lg:hidden'>
      <div className='flex flex-col gap-2'>
        <div className='h-[94px] w-[150px] animate-pulse bg-secondary-300' />
        <div className='flex items-center justify-center gap-3' />
      </div>
      <div className='flex w-full flex-col gap-2 py-2'>
        <div className='h-3 w-full max-w-[20rem] animate-pulse rounded-lg bg-secondary-300' />
        <div className='h-2.5 w-full max-w-[12rem] animate-pulse rounded-lg bg-secondary-300' />
      </div>
    </div>
  </div>
);
