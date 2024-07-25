import Image from 'next/image';
import Link from 'next/link';

import ProfilePopover from '../user-details/ProfilePopover';
import MobileNavigationMenu from './mobile/MobileNavigationMenu';
import MobileProfileMenu from './mobile/MobileProfileMenu';
import { NavBarProps } from './types';

const MenuBar = async ({
  dynamicFilterSubMenu,
  user,
}: NavBarProps) => (
  <div className='sticky top-0 z-[8] flex h-12 items-center justify-center border-0 border-b border-solid border-secondary-300 bg-secondary md:h-16 md:!bg-white'>
    <div className='absolute left-4 lg:left-8'>
      <div className='block md:hidden'>
        <MobileNavigationMenu
          dynamicFilterSubMenu={dynamicFilterSubMenu}
          user={user}
        />
      </div>
    </div>
    <Link href='/'>
      <Image
        src='/AM-i-Logo.svg'
        alt='AM-i Logo'
        className='block'
        width={65}
        height={20}
      />
    </Link>
    <div className='absolute right-4 lg:right-8'>
      <div className='hidden md:block'>
        <ProfilePopover />
      </div>
      <div className='block md:hidden'>
        <MobileProfileMenu roles={user!.authorities} />
      </div>
    </div>
  </div>
);

export default MenuBar;
