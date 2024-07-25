'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import { Button, Drawer } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useState, useTransition } from 'react';
import {
  MdCheck,
  MdClose,
  MdLock,
  MdOutlineExitToApp,
  MdOutlineLanguage,
  MdOutlineSettings,
  MdPersonOutline,
} from 'react-icons/md';

import { useTranslations } from '@/hooks/translation';
import { signOutAction } from '@/utils/actions/formActions';
import { changeLanguageAction } from '@/utils/languageActions';

import MobileMenuItem from './MobileMenuItem';
import MobileSubmenu from './MobileSubmenu';

const MobileProfileMenu = ({ roles = [] }: { roles: string[] }) => {
  const t = useTranslations('userMenu');
  const router = useRouter();
  const [submenu, setSubmenu] = useState<string>('');
  const languages = ['nl', 'en'] as const;
  const locale = useLocale();
  const [, startTransition] = useTransition();
  const [open, setOpen] = useState<boolean>(false);
  const toggleOpen = () => setOpen(!open);

  const closeSubMenu = () => {
    setSubmenu('');
  };

  const changeLanguage = (language: string) => {
    if (language !== locale) {
      startTransition(() => {
        changeLanguageAction(language);
        router.refresh();
      });
    }
  };

  return (
    <>
      <Button className='flex items-center justify-end' onClick={toggleOpen}>
        {!open ? (
          <MdPersonOutline className='size-5 text-white' />
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
        anchor='right'
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
        <div className='size-full border border-x-0 border-b-0 border-solid border-t-secondary-300 '>
          {submenu === 'language' ? (
            <MobileSubmenu handleBackClick={closeSubMenu}>
              {languages.map((language) => (
                <div
                  className='flex cursor-pointer flex-row gap-4 px-4  py-3 font-kanit text-base font-semibold text-white'
                  key={language}
                >
                  <div className='flex w-6 flex-row items-center'>
                    {locale === language ? <MdCheck size='1.2rem' /> : null}
                  </div>

                  <Button
                    onClick={() => {
                      changeLanguage(language);
                      toggleOpen();
                    }}
                    className='flex justify-start p-0 text-white'
                  >
                    <Typography variant='titleSmallBold' className='capitalize'>
                      {t(`languages.${language}`)}
                    </Typography>
                  </Button>
                </div>
              ))}
            </MobileSubmenu>
          ) : (
            <div className='flex flex-col gap-3 py-4'>
              <MobileMenuItem
                icon={<MdOutlineLanguage size='1.5rem' />}
                label={t('language')}
                isSubMenu
                onClick={() => setSubmenu('language')}
              />
              {/** Hiding it as part of bug fix CFE-336 */}
              {/* {roles.includes('ROLE_USER') && (
                <Link href='/preferences' className='no-underline'>
                  <MobileMenuItem
                    icon={<MdOutlineSettings size='1.5rem' />}
                    label={t('preferences')}
                  />
                </Link>
              )} */}
              {roles.includes('ROLE_USER') && (
                <Link
                  href='/settings'
                  className='no-underline'
                  prefetch={false}
                >
                  <MobileMenuItem
                    icon={<MdOutlineSettings size='1.5rem' />}
                    label={t('myAccount')}
                  />
                </Link>
              )}
              {roles.includes('ROLE_USER') && (
                <Link
                  href='/password'
                  className='no-underline'
                  prefetch={false}
                >
                  <MobileMenuItem
                    icon={<MdLock size='1.5rem' />}
                    label={t('password')}
                  />
                </Link>
              )}
              <MobileMenuItem
                icon={<MdOutlineExitToApp size='1.5rem' />}
                label={t('signout')}
                onClick={() => signOutAction()}
              />
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default MobileProfileMenu;
