'use server';

import { cookies } from 'next/headers';

import { LANG_COOKIE_KEY } from '@/constants/language';

import { getCookieOptions } from './cookieActions';

export const changeLanguageAction = (language: string) => {
  cookies().set(getCookieOptions(LANG_COOKIE_KEY, language));
  cookies().set(getCookieOptions('NEXT_LOCALE', language));
};
