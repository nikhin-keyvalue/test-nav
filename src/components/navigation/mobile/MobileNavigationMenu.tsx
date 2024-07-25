'use client';

import { Button, Drawer } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  MdClose,
  MdMenu,
  MdOutlineBadge,
  MdOutlineCheck,
  MdOutlineDashboard,
  MdOutlineDirectionsCar,
  MdOutlinePeopleAlt,
  MdOutlineRequestQuote,
  MdOutlineSettings,
  MdOutlineStore,
  MdQueryStats,
} from 'react-icons/md';

import If from '@/components/If';
import DynamicSearchCriteriaFallback from '@/components/search-criteria/DynamicSearchCriteriaFallback';
import Spinner from '@/components/Spinner';
import { useTranslations } from '@/hooks/translation';
import { isCrmPath, isSalesPath } from '@/utils/common';

import MenuBarItem from '../desktop/MenuBarItem';
import { NavBarProps } from '../types';
import MobileMenuItem from './MobileMenuItem';
import MobileSubmenu from './MobileSubmenu';
import StaticFilterSubmenu from './StaticFilterSubmenu';

const MobileNavigationMenu = ({ user, dynamicFilterSubMenu }: NavBarProps) => {
  // TODO: Revisit;
  const roles = user?.authorities || [];
  const pathname = usePathname();
  const t = useTranslations('navBar');
  const subNavT = useTranslations();
  const isActive = (path: string) => pathname.startsWith(path);
  const [submenu, setSubmenu] = useState<string>('');

  const [open, setOpen] = useState<boolean>(false);
  const toggleOpen = () => setOpen(!open);

  const closeSubMenu = () => {
    setSubmenu('');
  };

  const onSubMenuItemClick = () => {
    closeSubMenu();
    toggleOpen();
  };

  const getActiveMenu = () => {
    switch (submenu) {
      case 'stock': {
        return (
          <MobileSubmenu handleBackClick={closeSubMenu}>
            <div className='h-[calc(100vh-115px)] overflow-y-auto px-4'>
              <StaticFilterSubmenu onClose={onSubMenuItemClick} />
              <div className='mt-4 w-full'>
                <ErrorBoundary
                  FallbackComponent={DynamicSearchCriteriaFallback}
                >
                  <Suspense
                    fallback={
                      <div className='flex w-full justify-center'>
                        <Spinner />
                      </div>
                    }
                  >
                    {dynamicFilterSubMenu}
                  </Suspense>
                </ErrorBoundary>
              </div>
            </div>
          </MobileSubmenu>
        );
      }

      case 'crm': {
        return (
          <MobileSubmenu handleBackClick={closeSubMenu}>
            <div className='h-[calc(100vh-115px)] overflow-y-auto px-4'>
              <div className='flex flex-col items-start'>
                <MenuBarItem
                  label={t('persons')}
                  onClick={onSubMenuItemClick}
                  url='/persons'
                />

                <MenuBarItem
                  label={subNavT('organisationsListing.title')}
                  onClick={onSubMenuItemClick}
                  url='/organisations'
                />
              </div>
            </div>
          </MobileSubmenu>
        );
      }

      case 'sales': {
        return (
          <MobileSubmenu handleBackClick={closeSubMenu}>
            <div className='h-[calc(100vh-115px)] overflow-y-auto px-4'>
              <MenuBarItem
                label={subNavT('opportunityListing.title')}
                onClick={onSubMenuItemClick}
                url='/opportunities'
              />
              <MenuBarItem
                label={subNavT('deliveryListing.title')}
                onClick={onSubMenuItemClick}
                url='/deliveries'
              />
              <MenuBarItem
                label={t('createQuotation')}
                onClick={onSubMenuItemClick}
                url='/quotations/quick'
              />
              <If condition={roles?.includes('ROLE_DEALER_ADMIN')}>
                <MenuBarItem
                  label={t('settings')}
                  onClick={onSubMenuItemClick}
                  url='/crm-settings'
                />
              </If>
            </div>
          </MobileSubmenu>
        );
      }
      default:
        return (
          <div className='flex flex-col gap-3 py-4'>
            <Link href='/dashboard' className='no-underline' prefetch={false}>
              <MobileMenuItem
                label={t('dashboard')}
                icon={<MdOutlineDashboard size='1.5rem' />}
              />
            </Link>
            <MobileMenuItem
              isSubMenu
              label={t('vehicles')}
              isActive={isActive('/stock')}
              onClick={() => setSubmenu('stock')}
              icon={<MdOutlineDirectionsCar size='1.5rem' />}
            />
            <Link href='/stockmgmt-dealer-list' className='no-underline' prefetch={false}>
              <MobileMenuItem
                label={t('dealers')}
                icon={<MdOutlineStore size='1.5rem' />}
              />
            </Link>
            {roles.includes('ROLE_CRM') ? (
              <MobileMenuItem
                isSubMenu
                label={t('crm')}
                isActive={isCrmPath(pathname)}
                onClick={() => setSubmenu('crm')}
                icon={<MdOutlinePeopleAlt size='1.5rem' />}
              />
            ) : (
              roles.includes('ROLE_RELATION') && (
                <Link
                  href='/relationmgmt/relation/list'
                  className='no-underline'
                  prefetch={false}
                >
                  <MobileMenuItem
                    icon={<MdOutlinePeopleAlt size='1.5rem' />}
                    label={t('relations')}
                  />
                </Link>
              )
            )}
            {roles.includes('ROLE_CRM') ? (
              <MobileMenuItem
                isSubMenu
                label={t('sales')}
                isActive={isSalesPath(pathname)}
                onClick={() => setSubmenu('sales')}
                icon={<MdOutlineRequestQuote size='1.5rem' />}
              />
            ) : (
              roles.includes('ROLE_RELATION') && (
                <Link
                  href='/relationmgmt/section/list'
                  className='no-underline'
                  prefetch={false}
                >
                  <MobileMenuItem
                    icon={<MdOutlineRequestQuote size='1.5rem' />}
                    label={t('trajectories')}
                  />
                </Link>
              )
            )}
            {roles.includes('ROLE_INSIGHTS') && (
              <Link href='/insight' className='no-underline' prefetch={false}>
                <MobileMenuItem
                  icon={<MdQueryStats size='1.5rem' />}
                  label={t('insights')}
                />
              </Link>
            )}
            {roles.includes('ROLE_TASK') && (
              <Link href='/relationmgmt-mytasks' className='no-underline' prefetch={false}>
                <MobileMenuItem
                  icon={<MdOutlineBadge size='1.5rem' />}
                  label={t('mytasks')}
                />
              </Link>
            )}
            {roles.includes('ROLE_TASK_ADMIN') && (
              <Link href='/relationmgmt-task-list' className='no-underline' prefetch={false}>
                <MobileMenuItem
                  icon={<MdOutlineCheck size='1.5rem' />}
                  label={t('tasks')}
                />
              </Link>
            )}
            {roles.includes('ROLE_DEALER_ADMIN') && (
              <Link
                href='/relationmgmt-guarantee-list'
                className='no-underline'
                prefetch={false}
              >
                <MobileMenuItem
                  icon={<MdOutlineSettings size='1.5rem' />}
                  label={t('guarantees')}
                />
              </Link>
            )}
          </div>
        );
    }
  };

  return (
    <>
      <Button className='flex items-center justify-start' onClick={toggleOpen}>
        {!open ? (
          <MdMenu className='size-5 text-white' />
        ) : (
          <MdClose className='size-5 text-white' />
        )}
      </Button>
      <Drawer
        open={open}
        onClose={() => {
          toggleOpen();
          closeSubMenu();
        }}
        slotProps={{ backdrop: { invisible: true } }}
        classes={{
          paper: 'bg-secondary w-full z-20',
        }}
        sx={{
          '& .MuiDrawer-root': {
            position: 'absolute',
            top: 48,
          },
          '& .MuiPaper-root': {
            position: 'absolute',
            top: 48,
          },
        }}
      >
        <div className='z-20 size-full border border-x-0 border-b-0 border-solid border-t-secondary-300 bg-secondary'>
          {getActiveMenu()}
        </div>
      </Drawer>
    </>
  );
};

export default MobileNavigationMenu;
