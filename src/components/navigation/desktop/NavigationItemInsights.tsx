'use client';

import { usePathname } from 'next/navigation';
import { MdQueryStats } from 'react-icons/md';

import { NavigationMenuItem } from '../NavigationMenu';

const NavigationItemInsights = () => {
  const pathname = usePathname();
  return (
    <NavigationMenuItem isActive={pathname.startsWith('/insight')}>
      <MdQueryStats size='2rem' />
    </NavigationMenuItem>
  );
};

export default NavigationItemInsights;
