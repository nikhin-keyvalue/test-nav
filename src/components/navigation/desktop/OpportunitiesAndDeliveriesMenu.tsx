'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Role } from '@/components/user-details/types';

import NavItemOpportunityAndDelivery from './NavItemOpportunityAndDelivery';

const OpportunitiesandDeliveriesMenu = ({
  userRoles,
}: {
  userRoles: Role[];
}) => {
  const t = useTranslations('navBar');

  return (
    <Link href='/opportunities' className='text-inherit' title={t('sales')}>
      <NavItemOpportunityAndDelivery userRoles={userRoles} />
    </Link>
  );
};

export default OpportunitiesandDeliveriesMenu;
