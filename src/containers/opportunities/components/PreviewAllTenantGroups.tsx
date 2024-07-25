'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import { Grid } from '@mui/material';
import React, { useMemo } from 'react';

import {
  LineGroupItemsQuotationUpdateRequest,
  VATTypes,
} from '@/containers/quotations/api/type';
import { findPurchaseLineItem } from '@/containers/quotations/utils';
import { useTranslations } from '@/hooks/translation';
import { formatCurrencyAfterRounding } from '@/utils/currency';
import { checkIfLineGroupItemsEmpty } from '@/utils/quote';

import { LineGroupItemsType } from '../types';
import DiscountItem from './DiscountItem';

const PreviewAllTenantGroups = ({
  vatType,
  lineGroupItems,
  totalAfterDiscountInclVAT,
  totalExclVat = 0,
  totalAfterDiscountExclVAT = 0,
  vat,
}: {
  vatType: VATTypes;
  lineGroupItems: LineGroupItemsQuotationUpdateRequest;
  totalAfterDiscountInclVAT: number;
  totalExclVat: number;
  totalAfterDiscountExclVAT: number;
  vat: number;
}) => {
  const isIncludingVat = vatType === 'InclVAT';
  const t = useTranslations();

  const purchaseLineItem = useMemo(() => {
    let val = null;
    if (lineGroupItems) {
      val = findPurchaseLineItem({
        lineGroupItemList: lineGroupItems,
      });
    }
    return val;
  }, [lineGroupItems]);

  const totalAfterDiscountInclVatDF = formatCurrencyAfterRounding({
    value: totalAfterDiscountInclVAT,
  });
  const totalAfterDiscountExclVatDF = formatCurrencyAfterRounding({
    value: totalAfterDiscountExclVAT,
  });

  const discountAmount = totalExclVat - totalAfterDiscountExclVAT;

  const excludingVatSection = (
    <Grid
      item
      sm={12}
      md={6}
      lg={6}
      xl={3}
      className={`flex flex-col ${isIncludingVat ? '' : 'items-end'}`}
    >
      <Typography variant='textSmall' className='text-grey-56'>
        {t('quotations.totalExclVAT')}
      </Typography>

      <Typography
        variant={isIncludingVat ? 'textMedium' : 'titleMediumBold'}
        className='whitespace-nowrap text-secondary	'
      >
        {totalAfterDiscountExclVatDF}
      </Typography>
    </Grid>
  );

  const includingVatSection = (
    <Grid
      item
      sm={12}
      md={6}
      lg={6}
      xl={3}
      className={`flex flex-col ${isIncludingVat ? 'items-end' : ''}`}
    >
      <Typography variant='textSmall' className='text-grey-56'>
        {t('quotations.totalInclVAT')}
      </Typography>
      <Typography
        variant={isIncludingVat ? 'titleMediumBold' : 'textMedium'}
        className='text-secondary'
      >
        {totalAfterDiscountInclVatDF}
      </Typography>
    </Grid>
  );

  return (
    <Grid container spacing={2} className='ml-0 w-full'>
      <Grid item width='100%' className='pl-0'>
        {lineGroupItems?.map((lineItem) => (
          <React.Fragment key={lineItem?.groupName}>
            {checkIfLineGroupItemsEmpty(lineItem as LineGroupItemsType) ? (
              <div className='border-b'>
                <Typography className='mb-4 mt-3' variant='titleMediumBold'>
                  {lineItem?.groupName}
                </Typography>
                {lineItem?.finances?.map((finItem, finIndex) => (
                  <div
                    className='mb-4 flex justify-between'
                    key={`FinItem ${finIndex + 1}`}
                  >
                    <div className='flex justify-start'>
                      <Typography variant='textMedium' className='mr-4'>
                        1 X
                      </Typography>
                      <div className='flex flex-col text-left'>
                        <Typography variant='textMediumBold' className='mr-4'>
                          {finItem?.type}
                        </Typography>
                        <Typography
                          variant='textSmall'
                          className='text-grey-56'
                        >
                          {t('quotations.finance')}
                        </Typography>
                      </div>
                    </div>
                    <Typography
                      variant='textMediumBold'
                      className='flex flex-col text-right'
                    >
                      <div>
                        {formatCurrencyAfterRounding({
                          value: finItem?.monthlyExclVAT,
                        })}
                      </div>
                    </Typography>
                  </div>
                ))}

                {lineItem?.products?.map((prodItem, prodIndex) => (
                  <>
                    <div
                      className='mb-4 flex justify-between'
                      key={`ProdItem ${prodIndex + 1}`}
                    >
                      <div className='flex justify-start'>
                        <Typography variant='textMedium' className='mr-4'>
                          {prodItem?.quantity} X
                        </Typography>
                        <div className='flex flex-col text-left'>
                          <Typography variant='textMediumBold' className='mr-4'>
                            {prodItem?.name}
                          </Typography>
                          <Typography
                            variant='textSmall'
                            className='text-grey-56'
                          >
                            {t('quotations.product')}
                          </Typography>
                        </div>
                      </div>
                      <Typography
                        variant='textMediumBold'
                        className='flex flex-col text-right'
                      >
                        <div>
                          {formatCurrencyAfterRounding({
                            value: isIncludingVat
                              ? prodItem?.totalInclVat
                              : prodItem?.totalExclVat,
                          })}
                        </div>
                        <Typography
                          variant='textSmall'
                          className='text-grey-56'
                        >
                          {' '}
                          {isIncludingVat
                            ? t('quotations.quotationVATType.InclVAT')
                            : t('quotations.quotationVATType.ExclVAT')}
                        </Typography>
                      </Typography>
                    </div>
                    {prodItem?.discount?.totalDiscount && (
                      <DiscountItem
                        discount={prodItem.discount}
                        id={prodIndex}
                      />
                    )}
                  </>
                ))}

                {lineItem?.purchases?.map((purchaseItem, purchaseIndex) => (
                  <>
                    <div
                      className='mb-4 flex justify-between'
                      key={`PurchaseItem ${purchaseIndex + 1}`}
                    >
                      <div className='flex justify-start'>
                        <Typography variant='textMedium' className='mr-4'>
                          1 X
                        </Typography>
                        <div className='flex flex-col text-left'>
                          <Typography variant='textMediumBold' className='mr-4'>
                            {purchaseItem?.name}
                          </Typography>
                          <Typography
                            variant='textSmall'
                            className='text-grey-56'
                          >
                            {t('quotations.purchase')}
                          </Typography>
                        </div>
                      </div>
                      <Typography
                        variant='textMediumBold'
                        className='flex flex-col text-right'
                      >
                        <div>
                          {formatCurrencyAfterRounding({
                            value: isIncludingVat
                              ? purchaseItem?.totalInclVat
                              : purchaseItem?.totalExclVat,
                          })}
                        </div>
                        <Typography
                          variant='textSmall'
                          className='text-grey-56'
                        >
                          {' '}
                          {isIncludingVat
                            ? t('quotations.quotationVATType.InclVAT')
                            : t('quotations.quotationVATType.ExclVAT')}
                        </Typography>
                      </Typography>
                    </div>
                    {purchaseItem?.discount?.totalDiscount &&
                      !purchaseItem?.isGeneralDiscount && (
                        <DiscountItem
                          discount={purchaseItem.discount}
                          id={purchaseIndex}
                        />
                      )}
                  </>
                ))}

                {lineItem?.tradeIns?.map((tradeInItem, tradeInIndex) => (
                  <div
                    className='mb-4 flex justify-between'
                    key={`TradeInItem ${tradeInIndex + 1}`}
                  >
                    <div className='flex justify-start'>
                      <Typography variant='textMedium' className='mr-4'>
                        1 X
                      </Typography>

                      <div className='flex flex-col text-left'>
                        <Typography variant='textMediumBold' className='mr-4'>
                          {tradeInItem?.description}
                        </Typography>
                        <Typography
                          variant='textSmall'
                          className='text-grey-56'
                        >
                          {t('quotations.tradeIn')}
                        </Typography>
                      </div>
                    </div>
                    <Typography
                      variant='textMediumBold'
                      className='flex flex-col text-right'
                    >
                      <div>
                        -{' '}
                        {formatCurrencyAfterRounding({
                          value: tradeInItem?.totalExclVat,
                        })}
                      </div>
                    </Typography>
                  </div>
                ))}
              </div>
            ) : (
              <> </>
            )}
          </React.Fragment>
        ))}
      </Grid>
      {purchaseLineItem?.isGeneralDiscount ? (
        <Grid item className='flex flex-col border-b pb-3 pl-0' width='100%'>
          <Typography variant='titleMediumBold'>
            {t('quotations.generalDiscount')}
          </Typography>
          <div className='flex justify-between pl-4 pt-3'>
            <Typography variant='textMediumBold' className='mr-4'>
              {purchaseLineItem?.discount?.description}
            </Typography>
            <Typography
              variant='textMediumBold'
              className='flex flex-col text-right'
            >
              <div>
                -{' '}
                {formatCurrencyAfterRounding({
                  value: purchaseLineItem.discount?.totalDiscount,
                })}
              </div>
            </Typography>
          </div>
        </Grid>
      ) : (
        <> </>
      )}
      {discountAmount ? (
        <Grid item className='flex justify-between border-b pb-3' width='100%'>
          <Typography variant='textMediumBold'>
            {t('quotations.totalDiscount')}
          </Typography>
          <Typography
            variant='textMediumBold'
            className='flex flex-col text-right'
          >
            <div>
              -{' '}
              {formatCurrencyAfterRounding({
                value: discountAmount,
              })}
            </div>
          </Typography>
        </Grid>
      ) : (
        <> </>
      )}
      <Grid item width='100%'>
        <Grid container>
          <Grid item width='100%' lg={6} md={6} sm={6}>
            <Grid container rowSpacing={2}>
              {isIncludingVat ? excludingVatSection : includingVatSection}
              <Grid
                item
                lg={6}
                md={12}
                width='100%'
                className='flex flex-col items-start'
              >
                <Typography variant='textSmall' className='text-grey-56'>
                  {t('quotations.21VatAmount')}
                </Typography>
                <Typography variant='textMedium'>
                  {formatCurrencyAfterRounding({
                    value: vat,
                  })}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={6} md={6} sm={6} width='100%' className='text-right'>
            <Grid container justifyContent='end'>
              {isIncludingVat ? includingVatSection : excludingVatSection}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PreviewAllTenantGroups;
