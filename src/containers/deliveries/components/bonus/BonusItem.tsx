import { Typography } from '@AM-i-B-V/ui-kit';
import { Grid } from '@mui/material';
import { useTranslations } from 'next-intl';
import { MdOutlineEdit } from 'react-icons/md';

import EllipsisMenu from '@/components/menus/EllipsisMenu';
import { Item } from '@/components/menus/types';
import { formatCurrencyAfterRounding } from '@/utils/currency';
import { formatDate } from '@/utils/date';

import { BonusResponseData } from '../../api/type';
import { BonusStatusEnum } from '../../constants';

interface BonusItemProps {
  item: BonusResponseData & { status: BonusStatusEnum };
  onEdit: (item: BonusResponseData) => void;
  onDelete: (index: string) => void;
  disableMenus: boolean;
}

const BonusItem = ({
  item,
  onEdit,
  onDelete,
  disableMenus,
}: BonusItemProps) => {
  const t = useTranslations();

  const menuItemList: Item[] = [
    {
      id: 0,
      name: t('common.edit'),
      onClick: () => onEdit(item),
      disabled: () => disableMenus,
    },
    {
      id: 1,
      name: t('common.delete'),
      onClick: () => onDelete && onDelete(item.id),
      disabled: () => disableMenus,
    },
  ];

  const {
    status,
    receivedOn,
    payoutAfter,
    bonusAmount,
    bonusPercentage,
    bonusMonth,
  } = item;

  const statustext = {
    [BonusStatusEnum.RECEIVED]: t('bonusStatusText.received', {
      date: formatDate(receivedOn),
    }),
    [BonusStatusEnum.EXPECTED]: t('bonusStatusText.expected', {
      payoutAfter: t(`payoutAfter.${payoutAfter}`),
    }),
    [BonusStatusEnum.OVERDUE]: t('bonusStatusText.overdue'),
  }[status];

  const statusColor =
    status === BonusStatusEnum.RECEIVED ? 'text-green' : 'text-primary';

  return (
    <Grid
      container
      flexDirection='row'
      className='border-t-2 border-t-grey-16 px-6 py-4'
    >
      <Grid item>
        <MdOutlineEdit size='1.5rem' className={`mr-2 ${statusColor}`} />
      </Grid>
      <Grid xs={6} item container>
        <Grid item className={`flex gap-1 ${statusColor}`}>
          <Typography variant='textMediumBold'>
            <div>{item?.title}</div>
          </Typography>
          {bonusAmount && (
            <>
              <Typography variant='textMediumBold'>•</Typography>
              <Typography variant='textMediumBold'>
                <div>{formatCurrencyAfterRounding({ value: bonusAmount })}</div>
              </Typography>
            </>
          )}
          {bonusPercentage && (
            <>
              <Typography variant='textMediumBold'>•</Typography>
              <Typography variant='textMediumBold'>
                <div>{`${bonusPercentage}%`}</div>
              </Typography>
            </>
          )}
          <Typography variant='textMediumBold'>•</Typography>
          <Typography variant='textMediumBold'>
            <div>{formatDate(bonusMonth, 'MMM YYYY')}</div>
          </Typography>
        </Grid>
        <Grid
          item
          container
          flexDirection='row'
          flexWrap='nowrap'
          className='gap-1'
        >
          <Typography
            className='whitespace-nowrap text-grey-56'
            variant='textSmallBold'
          >
            {t(`bonusStatus.${status}`)}
          </Typography>
          <Typography
            className='whitespace-nowrap text-grey-56'
            variant='textSmall'
          >
            {statustext}
          </Typography>
        </Grid>
      </Grid>
      <Grid className='ml-auto justify-end' xs={4} item container>
        <EllipsisMenu menuItems={menuItemList} index />
      </Grid>
    </Grid>
  );
};

export default BonusItem;
