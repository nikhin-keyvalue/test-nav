import { Typography } from '@AM-i-B-V/ui-kit';
import { Grid } from '@mui/material';
import React, { FC } from 'react';

import EllipsisMenu from '@/components/menus/EllipsisMenu';
import { useTranslations } from '@/hooks/translation';
import { formatCurrencyAfterRounding } from '@/utils/currency';

import { LineGroupItemPurchase } from '../api/type';
import { TenantGroupItemEntity } from './tenantGroups/types';

interface ViewGeneralDiscountProps {
  item: (LineGroupItemPurchase | TenantGroupItemEntity) & { index?: number };
  onEditGeneralDiscountItem: () => void;
  onRemoveGeneralDiscountItem: () => void;
}

const ViewGeneralDiscount: FC<ViewGeneralDiscountProps> = (props) => {
  const t = useTranslations();

  const { item, onEditGeneralDiscountItem, onRemoveGeneralDiscountItem } =
    props;
  // TODO: could make this a reusable component

  const discountMenuItemList = [
    {
      id: 100,
      name: t('common.editGeneralDiscount'),
      onClick: () => {
        onEditGeneralDiscountItem();
      },
    },
    {
      id: 101,
      name: t('common.removeGeneralDiscount'),
      onClick: () => {
        onRemoveGeneralDiscountItem();
      },
    },
  ];

  return (
    <>
      {/* Discount Section */}
      <Grid
        item
        container
        justifyContent='space-between'
        className='rounded bg-white p-4'
      >
        <Typography variant='titleMediumBold' className='text-secondary'>
          {t('quotations.generalDiscount')}
        </Typography>
        <Grid container flexDirection='row' className=' p-5 pr-2'>
          <Grid xs={6} item container>
            <Grid item>
              <Typography variant='textMediumBold' className='text-secondary'>
                <div>
                  {item?.discount?.description?.length
                    ? item?.discount?.description
                    : t('common.valuedCustomerDiscount')}
                </div>
              </Typography>
            </Grid>
          </Grid>
          <Grid className='ml-auto' xs={4} item container>
            <div className='ml-auto flex flex-row'>
              <div className='flex flex-col'>
                <Typography variant='textMediumBold' className='text-secondary'>
                  -{' '}
                  {formatCurrencyAfterRounding({
                    value: item?.discount?.totalDiscount,
                  })}
                </Typography>
              </div>
              <div className='mt-[-3px]'>
                <EllipsisMenu index menuItems={discountMenuItemList} />
              </div>
            </div>
          </Grid>
          <Grid
            item
            container
            className='mt-2'
            flexWrap='nowrap'
            flexDirection='row'
            justifyContent='space-between'
          >
            <Typography
              className='whitespace-nowrap text-grey-56'
              variant='textSmall'
            >
              {t(`common.amount`)}
            </Typography>
            <Typography
              variant='textSmall'
              className='mr-4 whitespace-nowrap text-grey-56'
            >
              {formatCurrencyAfterRounding({ value: item?.discount?.amount })}
            </Typography>
          </Grid>
          <Grid
            item
            container
            flexWrap='nowrap'
            flexDirection='row'
            justifyContent='space-between'
          >
            <Typography
              variant='textSmall'
              className='whitespace-nowrap text-grey-56'
            >
              {t(`common.percentage`)}
            </Typography>
            <Typography
              variant='textSmall'
              className='mr-4 whitespace-nowrap text-grey-56'
            >
              {item.discount?.percentage} %
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ViewGeneralDiscount;
