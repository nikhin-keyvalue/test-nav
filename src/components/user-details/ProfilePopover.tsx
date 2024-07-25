import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { use } from 'react';
import {
  MdExpandMore,
  MdLock,
  MdOutlineExitToApp,
  MdOutlineLanguage,
  MdSettings,
} from 'react-icons/md';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/DropdownMenu';
import { languages } from '@/constants/language';
import { currentUser } from '@/hooks/server/currentUser';
import { signOutAction } from '@/utils/actions/formActions';

import LanguageChanger from './LanguageChanger';

// Not async because got error: https://github.com/vercel/next.js/issues/51477
const ProfilePopover = () => {
  const user = use(currentUser());
  const t = useTranslations('userMenu');

  if (user == null) {
    return <p>Error</p>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className='flex items-center gap-4 border-none bg-transparent hover:cursor-pointer'
          type='button'
        >
          {user.imageUrl ? (
            <Image
              src={user.imageUrl}
              height={40}
              width={40}
              alt='profile_image'
              className='rounded-full'
            />
          ) : (
            <div className='bg-grey-medium-32 flex size-10 items-center justify-center rounded-full font-sans text-sm text-white'>{`${user.firstName[0]}${user.lastName[0]}`}</div>
          )}
          <div className='text-left'>
            <p className='m-0 leading-snug'>{`${user.firstName} ${user.lastName}`}</p>
            <p className='m-0 leading-snug text-secondary-500'>
              {user.tenant.displayValue}
            </p>
          </div>
          <MdExpandMore className='size-6 text-secondary-500' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className='gap-4'>
              <MdOutlineLanguage size='1.5rem' fill='#B4C2C7' /> {t('language')}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {languages.map((lang) => (
                  <LanguageChanger key={lang} lang={lang} />
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          {/** Hiding it as part of bug fix CFE-336 */}
          {/* {user.authorities.includes('ROLE_USER') && (
            <Link href='/preferences' className='text-inherit no-underline'>
              <DropdownMenuItem className='gap-1'>
                <MdSettings size='1.5rem' fill='#B4C2C7' /> {t('preferences')}
              </DropdownMenuItem>
            </Link>
          )} */}
          {user.authorities.includes('ROLE_USER') && (
            <Link
              href='/settings'
              className='text-inherit no-underline'
              prefetch={false}
            >
              <DropdownMenuItem className='cursor-pointer gap-4'>
                <MdSettings size='1.5rem' fill='#B4C2C7' /> {t('myAccount')}
              </DropdownMenuItem>
            </Link>
          )}
          {user.authorities.includes('ROLE_USER') && (
            <Link
              href='/password'
              className='text-inherit no-underline'
              prefetch={false}
            >
              <DropdownMenuItem className='cursor-pointer gap-4'>
                <MdLock size='1.5rem' fill='#B4C2C7' /> {t('password')}
              </DropdownMenuItem>
            </Link>
          )}

          <form action={signOutAction}>
            <button type='submit' className='m-0 w-full border-none p-0'>
              <DropdownMenuItem
                itemType='submit'
                className='cursor-pointer gap-4 font-sans text-[15px] text-secondary'
              >
                <MdOutlineExitToApp className='size-6 text-[#B4C2C7]' />
                {t('signout')}
              </DropdownMenuItem>
            </button>
          </form>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};

export default ProfilePopover;
