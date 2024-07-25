import { Typography } from '@AM-i-B-V/ui-kit';
import { Grid } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Fragment } from 'react';
import { MdOutlineEdit } from 'react-icons/md';

import EllipsisMenu from '@/components/menus/EllipsisMenu';
import { Item } from '@/components/menus/types';
import { nullFn, VAT_MULTIPLIER } from '@/constants/common';
import {
  containsNonEmptyString,
  removeEmptyStringsFromArray,
  removeSpaceFromString,
} from '@/utils/common';
import {
  formatAmountAfterRounding,
  formatCurrencyAfterRounding,
} from '@/utils/currency';
import { showErrorToast } from '@/utils/toast';

import { proposalTestIds } from '../../../../../tests/e2e/constants/testIds';
import { LineGroupItemHavingDiscount } from '../../api/type';
import { LineGroupItemEntityEnum, tenantGroupIdMap } from '../../constants';
import { useCreateQuotationContext } from '../../CreateQuotationContextWrapper';
import { TenantGroupItemProps } from './types';

const TenantGroupItem = ({
  item,
  vatType,
  itemType,
  tenantGroupId,
  onEditGroupItem,
  onDeleteGroupItem,
  showTotalSection = true,
  isAnotherFormOpen = false,
  setDiscountParent = nullFn,
  onRemoveDiscountItem = nullFn,
  onAddEditDiscountItem = nullFn,
  onMoveItemToTenantGroup = nullFn,
  testGroupName = tenantGroupIdMap[0],
}: TenantGroupItemProps) => {
  const t = useTranslations();
  const { state } = useCreateQuotationContext();

  const basicMenuItemList: Item[] = [
    {
      id: 0,
      name: t('quotations.editOrderLine'),
      onClick: () => onEditGroupItem(item.index),
      testId: `${proposalTestIds.orderLineItemActionMenuEdit}`,
    },
    {
      id: 1,
      name: t('quotations.deleteOrderLine'),
      testId: `${proposalTestIds.orderLineItemActionMenuDelete}`,
      onClick: () => onDeleteGroupItem && onDeleteGroupItem(item.index),
    },
  ];

  const lineGroupItemList = state?.groupNameList ?? [];

  const currentLineGroupItemIndexInMoveToMenu =
    lineGroupItemList &&
    lineGroupItemList.findIndex(
      (lineGroupItem) => lineGroupItem.id === tenantGroupId
    );
  // For generating test id's we need to know index of the current line group item is opened
  const getIndexOfMoveToMenuItem = (index: number) => {
    if (index >= currentLineGroupItemIndexInMoveToMenu) {
      return index + 1;
    }
    return index;
  };

  const moveToMenuItemList: Item[] | undefined =
    lineGroupItemList &&
    lineGroupItemList
      .filter((lineGroupItem) => lineGroupItem.id !== tenantGroupId)
      .map((lineGroupItem, index) => {
        const id = (basicMenuItemList.length + index).toString();
        return {
          id,
          testId: `moveTo-${tenantGroupIdMap[getIndexOfMoveToMenuItem(index)]}`,
          name: `${t(`quotations.moveTo`)} ${lineGroupItem.groupName}`,
          onClick: () =>
            onMoveItemToTenantGroup({
              lineItem: item,
              lineGroupItemDesc: lineGroupItem,
            }),
        };
      });

  const finalMenuItemList: Item[] = [
    ...basicMenuItemList,
    ...(moveToMenuItemList || []),
    ...(item.type === LineGroupItemEntityEnum.PURCHASE ||
    item.type === LineGroupItemEntityEnum.PRODUCT
      ? [
          {
            id: 99,
            disabled: () =>
              !!(item?.discount?.amount || item?.discount?.percentage),
            name: t('common.addDiscount'),
            onClick: () => {
              onAddEditDiscountItem(item.index);
              setDiscountParent(item);
            },
          },
        ]
      : []),
  ];

  const discountMenuItemList: Item[] = [
    {
      id: 100,
      name: t('common.editDiscount'),
      onClick: () => {
        onAddEditDiscountItem(item.index);
        setDiscountParent(item);
      },
    },
    {
      id: 101,
      name: t('common.removeDiscount'),
      onClick: () => {
        onRemoveDiscountItem(
          item.index,
          item.type as LineGroupItemHavingDiscount
        );
        setDiscountParent(null);
      },
    },
  ];

  const getFormattedAmount = (amount: number) => {
    if (
      [
        LineGroupItemEntityEnum.PURCHASE,
        LineGroupItemEntityEnum.PRODUCT,
      ].includes(item.type)
    ) {
      if (vatType === 'ExclVAT')
        return formatCurrencyAfterRounding({ value: amount });
      return formatCurrencyAfterRounding({ value: amount * VAT_MULTIPLIER });
    }
    return formatCurrencyAfterRounding({ value: amount });
  };

  const displayAmount = `${
    item.type === LineGroupItemEntityEnum.TRADE_IN ? '-' : ''
  } ${getFormattedAmount(item.totalExclVat)}`;

  const getTestId = () => {
    switch (itemType) {
      case LineGroupItemEntityEnum.PURCHASE:
        return proposalTestIds.purchaseVehicleName;
      case LineGroupItemEntityEnum.PRODUCT:
        return proposalTestIds.productItemName;
      case LineGroupItemEntityEnum.TRADE_IN:
        return proposalTestIds.tradeInVehicleName;
      default:
        return proposalTestIds.financeItemName;
    }

    return proposalTestIds.purchaseVehicleName;
  };
  return (
    <>
      <Grid
        container
        flexDirection='row'
        className='border-t-2  border-t-grey-16  p-5 pr-2'
        data-testid={`${testGroupName}-${removeSpaceFromString(item.name)}`}
      >
        <Grid
          className='cursor-pointer'
          item
          onClick={() => {
            if (isAnotherFormOpen) {
              showErrorToast(t('quotations.anotherFormAlreadyOpen'));
              return;
            }
            onEditGroupItem(item.index);
          }}
        >
          <MdOutlineEdit size='1rem' className='mr-1 mt-0.5 text-primary' />
        </Grid>

        <Grid item>
          <Typography className='mr-3 text-primary' variant='textMediumBold'>
            {item.quantity}
            <span className='ml-0.5'>x</span>
          </Typography>
        </Grid>
        <Grid xs={6} item container>
          <Grid item>
            <Typography
              className='text-primary'
              variant='textMediumBold'
              data-testid={getTestId()}
            >
              <div
                data-testid={`${testGroupName}-${removeSpaceFromString(item.name)}-name`}
              >
                {item?.name?.length > 0 ? item.name : '_'}
              </div>
            </Typography>
          </Grid>

          <Grid item container flexDirection='row' flexWrap='nowrap'>
            <Typography
              className='whitespace-nowrap text-grey-56'
              variant='textSmall'
              data-testid={item.type}
            >
              {t(`quotations.${item.type}`)}
            </Typography>
            {containsNonEmptyString(item.descriptiveFieldArray ?? []) &&
              removeEmptyStringsFromArray(
                item.descriptiveFieldArray ?? []
              )?.map((desc, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Fragment key={index}>
                  <Typography
                    className='mx-0.5 text-grey-56'
                    variant='textSmall'
                  >
                    •
                  </Typography>
                  <Typography
                    className='max-w-[40%] truncate  text-grey-56'
                    variant='textSmall'
                  >
                    {desc}
                  </Typography>
                </Fragment>
              ))}
          </Grid>
        </Grid>

        <Grid className='ml-auto' xs={4} item container>
          <div className='ml-auto flex flex-row'>
            {showTotalSection && (
              <div className='flex flex-col'>
                <Typography variant='textMediumBold' className='text-secondary'>
                  {displayAmount}
                </Typography>
                {item.type !== LineGroupItemEntityEnum.TRADE_IN && (
                  <Typography
                    variant='textSmall'
                    className='text-right text-grey-56'
                  >
                    {`${vatType === 'ExclVAT' ? t('quotations.quotationVATType.ExclVAT') : t('quotations.quotationVATType.InclVAT')}`}
                  </Typography>
                )}
              </div>
            )}
            <div className='mt-[-3px]'>
              <EllipsisMenu
                disabledState={{
                  disabled: isAnotherFormOpen,
                  message: t('quotations.anotherFormAlreadyOpen'),
                }}
                menuItems={finalMenuItemList}
                index
              />
            </div>
          </div>
        </Grid>
      </Grid>

      {/* Discount Section */}
      {(item?.discount?.amount || item?.discount?.percentage) &&
      !item.isGeneralDiscount ? (
        <Grid
          container
          flexDirection='row'
          className='border-t-2 border-t-grey-16  p-5 pr-2'
        >
          <Grid xs={6} item container>
            <Grid item>
              <Typography
                variant='textMediumBold'
                className='ml-12 text-secondary'
              >
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
              {showTotalSection && (
                <div className='flex flex-col'>
                  <Typography
                    variant='textMediumBold'
                    className='text-secondary'
                  >
                    -{' '}
                    {formatCurrencyAfterRounding({
                      value: item.discount.totalDiscount,
                    })}
                  </Typography>
                </div>
              )}
              <div className='mt-[-3px]'>
                <EllipsisMenu
                  disabledState={{
                    disabled: isAnotherFormOpen,
                    message: t('quotations.anotherFormAlreadyOpen'),
                  }}
                  menuItems={discountMenuItemList}
                  index
                />
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
              className='ml-12 whitespace-nowrap text-grey-56'
              variant='textSmall'
            >
              {t(`common.amount`)}
            </Typography>
            <Typography
              variant='textSmall'
              className='mr-4 whitespace-nowrap text-grey-56'
            >
              {formatCurrencyAfterRounding({ value: item.discount.amount })}
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
              className='ml-12 whitespace-nowrap text-grey-56'
            >
              {t(`common.percentage`)}
            </Typography>
            <Typography
              variant='textSmall'
              className='mr-4 whitespace-nowrap text-grey-56'
            >
              {`${formatAmountAfterRounding({
                value: item?.discount?.percentage ?? 0,
              })} %`}
            </Typography>
          </Grid>
        </Grid>
      ) : null}
    </>
  );
};

export default TenantGroupItem;
