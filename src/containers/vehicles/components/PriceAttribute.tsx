import { Typography } from '@AM-i-B-V/ui-kit';
import { useTranslations } from 'next-intl';
import { ReactNode, useEffect, useState } from 'react';

import { formatCurrency } from '@/utils/currency';

import AttributeView from './AttributeView';
import { StockListItem, VehiclePriceData } from './types';

export const PriceAttributeFallback = () => (
  <div className='flex flex-col gap-1'>
    <div className='skeleton-loader h-2 w-28 rounded' />
    <div className='skeleton-loader h-3 w-24 rounded' />
    <div className='skeleton-loader h-2 w-28 rounded' />
  </div>
);

export const PriceAttribute = async ({
  carDetails,
}: {
  carDetails: StockListItem;
}) => {
  const t = useTranslations('stock.listedCar');
  const tPrice = useTranslations('stock.price');
  const [data, setData] = useState<VehiclePriceData | null>(null);

  const fetchPriceData = async () => {
    const response = await fetch(
      `/api/carstock/${carDetails.id}/calculated-price-data`
    );
    if (response.ok) {
      const priceData = await response.json();
      setData(priceData);
    }
  };

  useEffect(() => {
    fetchPriceData();
  }, [carDetails.id]);

  if (!data) {
    return <PriceAttributeFallback />;
  }

  const { discountOrigin } = carDetails;
  const { effectiveSellingPrice, effectiveDiscountAmount, retailPrice } = data;
  const hasDiscount = effectiveSellingPrice !== retailPrice;
  const renderStrikeThrough = (chunks: ReactNode) => <s>{chunks}</s>;

  return hasDiscount ? (
    <AttributeView
      className='w-full max-w-[160px]'
      name={
        t.rich('priceWithValue', {
          value: formatCurrency(retailPrice),
          s: renderStrikeThrough,
        }) as React.JSX.Element
      }
    >
      <>
        <Typography variant='textMedium'>
          {formatCurrency(effectiveSellingPrice)}
        </Typography>
        {retailPrice && effectiveSellingPrice && (
          <Typography variant='textSmall'>
            {t('discountWithValue', {
              value: formatCurrency(effectiveDiscountAmount),
            })}
          </Typography>
        )}
      </>
    </AttributeView>
  ) : (
    <AttributeView className='w-full max-w-[160px]' name={t.markup('price')}>
      <>
        <Typography variant='textMedium'>
          {formatCurrency(effectiveSellingPrice)}
        </Typography>
        <Typography variant='textSmall'>
          {discountOrigin ? `${tPrice(discountOrigin)} ${t('discount')}` : ''}
        </Typography>
      </>
    </AttributeView>
  );
};
