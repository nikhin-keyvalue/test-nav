'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { MdOutlineRequestQuote } from 'react-icons/md';

import If from '@/components/If';
import { Role } from '@/components/user-details/types';
import { useTranslations } from '@/hooks/translation';
import { isSalesPath } from '@/utils/common';

import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from '../NavigationMenu';
import MenuBarItem from './MenuBarItem';

const NavItemOpportunityAndDelivery = ({
  userRoles,
}: {
  userRoles: Role[];
}) => {
  const t = useTranslations();
  const pathName = usePathname();

  const hasSettingsPageAccess = userRoles?.includes('ROLE_DEALER_ADMIN');

  return (
    <NavigationMenuItem isActive={isSalesPath(pathName)}>
      <NavigationMenuTrigger className='cursor-pointer'>
        <MdOutlineRequestQuote size='2rem' />
      </NavigationMenuTrigger>

      <NavigationMenuContent>
        <p className='my-4 font-kanit text-[1.375rem] font-semibold capitalize'>
          {t('navBar.sales')}
        </p>
        <div className='custom-scrollbar mr-1 h-[calc(100vh-72px)] overflow-y-auto overflow-x-hidden'>
          <MenuBarItem
            label={t('opportunityListing.title')}
            onClick={() => null}
            url='/opportunities'
          />
          <MenuBarItem
            label={t('deliveryListing.title')}
            onClick={() => null}
            url='/deliveries'
          />
          <MenuBarItem
            label={t('navBar.createQuotation')}
            onClick={() => null}
            url='/quotations/quick'
          />
          <If condition={hasSettingsPageAccess}>
            <MenuBarItem label={t('navBar.settings')} url='/crm-settings' />
          </If>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default NavItemOpportunityAndDelivery;
