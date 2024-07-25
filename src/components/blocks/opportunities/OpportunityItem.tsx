'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import Dialog from '@/components/Dialog';
import { Item } from '@/components/menus/types';
import { useTranslations } from '@/hooks/translation';
import { deleteOpportunity } from '@/utils/actions/formActions';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

import EllipsisMenu from '../../menus/EllipsisMenu';
import { IOpportunityLineItemProps } from './types';

const OpportunityLineItem: React.FC<IOpportunityLineItemProps> = (props) => {
  const {
    item: { id: opportunityOrDeliveryId, name, status },
  } = props;
  const { id: parentEntityId } = useParams();
  const router = useRouter();

  const isImmutable = status === 'ClosedWon' || status === 'ClosedLost';

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const t = useTranslations();

  const handleEditClick = () => {
    router.push(`/opportunities/${opportunityOrDeliveryId}/edit`);
  };

  const handleDeleteItem = async () => {
    setLoading(true);
    const res = await deleteOpportunity(
      opportunityOrDeliveryId!,
      parentEntityId as string
    );

    if (res?.ok) {
      showSuccessToast(t('common.savedSuccessfully'));
      setIsDeleteOpen(false);
    } else {
      showErrorToast(t('common.somethingWentWrong'));
    }
    setLoading(false);
  };

  const menuItems: Item[] = [
    {
      id: 1,
      name: t('common.edit'),
      onClick: handleEditClick,
      disabled: () => isImmutable,
    },
    {
      id: 2,
      name: t('common.delete'),
      onClick: () => setIsDeleteOpen(true),
      disabled: () => isImmutable,
    },
    {
      id: 'duplicate',
      name: t('actionMenuItems.duplicate'),
      onClick: () =>
        router.push(`/opportunities/${opportunityOrDeliveryId}/duplicate`),
    },
  ];

  return (
    <>
      <div className='inline-flex w-full items-center justify-start gap-2 self-stretch border-t border-grey-16 py-2'>
        <div className='flex shrink grow basis-0 items-center gap-2 px-2'>
          <Link href={`/opportunities/${opportunityOrDeliveryId}/details`}>
            <Typography variant='textMediumBold' className='text-primary'>
              {name}
            </Typography>
          </Link>
          <Typography variant='textSmall' className='text-secondary-500'>
            • {t('opportunities.opportunity')}
          </Typography>
        </div>
        <EllipsisMenu menuItems={menuItems} index={opportunityOrDeliveryId!} />
      </div>
      <Dialog
        onSubmit={handleDeleteItem}
        headerElement={t('opportunities.deleteOpportunity')}
        onClose={() => setIsDeleteOpen(false)}
        isOpen={isDeleteOpen}
        submitText={t('common.yes')}
        disabled={isLoading}
      >
        {t('opportunities.deleteOpportunityConfirmation')}
      </Dialog>
    </>
  );
};

export default OpportunityLineItem;
