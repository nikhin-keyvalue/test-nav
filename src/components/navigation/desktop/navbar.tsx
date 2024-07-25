import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  MdOutlineBadge,
  MdOutlineCheck,
  MdOutlinePeopleAlt,
  MdOutlineRequestQuote,
  MdOutlineSettings,
  MdOutlineStore,
} from 'react-icons/md';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '../NavigationMenu';
import { NavBarProps } from '../types';
import NavigationItemDashboard from './NavigationItemDashboard';
import NavigationItemInsights from './NavigationItemInsights';
import OpportunitiesandDeliveriesMenu from './OpportunitiesAndDeliveriesMenu';
import PersonsAndOrganisationsMenu from './PersonsAndOrganisationsMenu';
import StockMenuUI from './StockMenu';

const NavBar = ({ dynamicFilterSubMenu, user }: NavBarProps) => {
  const roles = user!.authorities;

  const t = useTranslations('navBar');

  return (
    <div className='hidden md:block'>
      <NavigationMenu className='z-[1400]'>
        <NavigationMenuList className='h-auto justify-start overflow-y-auto overscroll-y-contain'>
          {/* Dashboard  -- A */}
          <Link
            href='/dashboard'
            className='text-inherit'
            prefetch={false}
            title={t('dashboard')}
          >
            <NavigationItemDashboard />
          </Link>

          {/* Stock */}
          <StockMenuUI dynamicFilterSubMenu={dynamicFilterSubMenu} />

          {/*  --B */}
          <Link
            href='/stockmgmt/dealer/list'
            className='text-inherit'
            prefetch={false}
            title={t('dealers')}
          >
            <NavigationMenuItem isActive={false}>
              <MdOutlineStore size='2rem' />
            </NavigationMenuItem>
          </Link>

          {/** C */}
          {roles.includes('ROLE_CRM') ? (
            <PersonsAndOrganisationsMenu />
          ) : (
            roles.includes('ROLE_RELATION') && (
              <Link
                href='/relationmgmt/relation/list'
                className='text-inherit'
                prefetch={false}
                title={t('relations')}
              >
                <NavigationMenuItem isActive={false}>
                  <MdOutlinePeopleAlt size='2rem' />
                </NavigationMenuItem>
              </Link>
            )
          )}
          {/** D */}
          {roles.includes('ROLE_CRM') ? (
            <OpportunitiesandDeliveriesMenu userRoles={roles} />
          ) : (
            roles.includes('ROLE_RELATION') && (
              <Link
                href='/relationmgmt/section/list'
                className='text-inherit'
                prefetch={false}
                title={t('trajectories')}
              >
                <NavigationMenuItem isActive={false}>
                  <MdOutlineRequestQuote size='2rem' />
                </NavigationMenuItem>
              </Link>
            )
          )}

          {/** E */}
          {roles.includes('ROLE_INSIGHTS') && (
            <Link
              href='/insight'
              className='text-inherit'
              title={t('insights')}
              prefetch={false}
            >
              <NavigationItemInsights />
            </Link>
          )}

          {/** F */}
          {roles.includes('ROLE_TASK') && (
            <Link
              href='/relationmgmt/mytasks'
              className='text-inherit'
              prefetch={false}
              title={t('mytasks')}
            >
              <NavigationMenuItem isActive={false}>
                <MdOutlineBadge size='2rem' />
              </NavigationMenuItem>
            </Link>
          )}

          {/* G */}
          {roles.includes('ROLE_TASK_ADMIN') && (
            <Link
              href='/relationmgmt/task/list'
              className='text-inherit'
              prefetch={false}
              title={t('tasks')}
            >
              <NavigationMenuItem isActive={false}>
                <MdOutlineCheck size='2rem' />
              </NavigationMenuItem>
            </Link>
          )}


          {/** H */}
          {roles.includes('ROLE_DEALER_ADMIN') && (
            <Link
              href='/relationmgmt/guarantee/list'
              className='text-inherit'
              prefetch={false}
              title={t('guarantees')}
            >
              <NavigationMenuItem isActive={false}>
                <MdOutlineSettings size='2rem' />
              </NavigationMenuItem>
            </Link>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default NavBar;
