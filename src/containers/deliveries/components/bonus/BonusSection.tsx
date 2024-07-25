import { Typography } from '@AM-i-B-V/ui-kit';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { MdAdd } from 'react-icons/md';

import { NoData } from '@/components';
import DetailBlock from '@/components/blocks/DetailBlock';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

import { deleteBonus } from '../../api/actions';
import { Bonus, BonusResponseData } from '../../api/type';
import { BonusStatusEnum } from '../../constants';
import BonusForm from './BonusForm';
import BonusItem from './BonusItem';

interface BonusSectionpProps {
  bonusList?: Bonus[];
}

const BonusSection = ({ bonusList }: BonusSectionpProps) => {
  const t = useTranslations();
  const { id: deliveryId } = useParams();
  const [openBonusForm, setOpenBonusForm] = useState(false);
  const [bonusData, setBonusData] = useState<BonusResponseData | undefined>(
    undefined
  );

  const DetailBlockProps = {
    title: t('deliveries.bonus.bonus'),
    className: 'gap-0',
    button: (
      <Button onClick={() => setOpenBonusForm(true)} disabled={openBonusForm}>
        <MdAdd size='1.25rem' />
        <Typography variant='titleSmallBold' className='capitalize'>
          {t('common.add')}
        </Typography>
      </Button>
    ),
  };

  const handleDelete = async (id: string) => {
    const response = await deleteBonus({
      id,
      deliveryId: deliveryId as string,
    });
    if (response.success) {
      showSuccessToast(t('common.deletedSuccessfully'));
    } else {
      showErrorToast(t('common.somethingWentWrong'));
    }
  };

  const handleEdit = (item: BonusResponseData) => {
    setOpenBonusForm(true);
    setBonusData(item);
  };

  const handleClose = () => {
    setOpenBonusForm(false);
    setBonusData(undefined);
  };

  const bonusListWithStatus = useMemo(
    () =>
      bonusList?.map((bonus) => {
        let status;
        if (bonus.receivedOn) {
          status = BonusStatusEnum.RECEIVED;
        } else if (dayjs().isAfter(bonus.bonusMonth, 'month')) {
          status = BonusStatusEnum.OVERDUE;
        } else {
          status = BonusStatusEnum.EXPECTED;
        }
        return { ...bonus, status };
      }),
    [bonusList]
  );

  return (
    <DetailBlock {...DetailBlockProps}>
      <div className='-m-6 mt-6'>
        {openBonusForm && (
          <BonusForm handleClose={handleClose} bonusData={bonusData} />
        )}
        {bonusListWithStatus?.map((bonus) => (
          <BonusItem
            key={bonus.id}
            item={bonus}
            onEdit={handleEdit}
            onDelete={handleDelete}
            disableMenus={openBonusForm}
          />
        ))}
      </div>
      {!bonusList?.length && !openBonusForm && (
        <div className='h-full w-full'>
          <NoData
            imageDimension={130}
            primaryText={t('common.noDataDefaultPrimaryText')}
          />
        </div>
      )}
    </DetailBlock>
  );
};

export default BonusSection;
