'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { MdOutlineDashboard } from 'react-icons/md';

import { NavigationMenuItem } from '../NavigationMenu';

const NavigationItemDashboard = () => {
  const pathname = usePathname();
  return (
    <NavigationMenuItem isActive={pathname.startsWith('/dashboard')}>
      <MdOutlineDashboard size='2rem' />
    </NavigationMenuItem>
  );
};

export default NavigationItemDashboard;
