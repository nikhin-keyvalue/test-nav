import 'server-only';

import { cookies, headers } from 'next/headers';

import { isDevelopmentMode } from '@/constants/env';

import { getDecryptedToken, verifyToken } from './tokenDecodeAction';

const getCookieDomain = () => {
  const headersList = headers();
  const hostDomain = headersList.get('host')?.split(':')[0] ?? '';
  if (hostDomain && hostDomain !== 'localhost') {
    const urlDomains = hostDomain.split('.');
    const domain = `.${urlDomains.slice(1).join('.')}`;
    return domain;
  }
  return hostDomain;
};

export const getCookieOptions = (name: string, value: string) => ({
  name,
  value,
  httpOnly: false,
  path: '/',
  ...(getCookieDomain() && { domain: getCookieDomain() }),
});

export async function setAuthCookie(token: string) {
  const decryptedToken = await getDecryptedToken(token);
  const tokenData = await verifyToken(decryptedToken);

  cookies().set({
    ...getCookieOptions('webdealerami', token),
    ...(!isDevelopmentMode && { sameSite: 'none', secure: true }), // same site: 'none' is needed for sending cookies cross origin. Its required while running on build, but in local we do not need to send cookies cross origin.
    expires: tokenData?.payload?.exp ? tokenData.payload.exp * 1000 : undefined,
  });
}

export async function deleteAuthCookie() {
  const cookieDomain = getCookieDomain();
  cookies().set({
    name: 'webdealerami',
    value: '',
    httpOnly: false,
    expires: new Date(),
    path: '/',
    ...(cookieDomain && { domain: cookieDomain }),
  });
}

export async function getAuthCookie() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('webdealerami');
  return authCookie?.value;
}
