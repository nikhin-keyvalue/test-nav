import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import {
  CRM_ROLE_ROUTES_REGEX,
  SALES_ROLE_ROUTES_REGEX,
  SETTINGS_ROUTE_REGEX,
  USER_ROLES,
} from '@/constants/routes';

import { isDevelopmentMode, WEBDEALER_BASE_URL } from './constants/env';
import { LANG_COOKIE_KEY, languages } from './constants/language';
import {
  legacyRedirects,
  webDealerRedirects,
} from './constants/legacyRedirects';

const publicRoutes = [
  '/login',
  '/password/reset',
  '/api/verifyToken',
  '/view-quotation',
];

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: languages,

  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: 'nl',
  localePrefix: 'never',
});

export default async function middleware(req: NextRequest) {
  // Syncing language cookies to make sure that other app stays in the same language.
  const { protocol, pathname, search } = req.nextUrl;
  const requestBaseUrl = `${protocol}//${req.headers.get('Host')}`;
  const lang = req.cookies.get(LANG_COOKIE_KEY)?.value;
  if (lang) {
    req.cookies.set('NEXT_LOCALE', lang);
  }

  // In non local environments redirect to webdealers login page
  if (
    webDealerRedirects.includes(pathname) ||
    (pathname === '/login' && !isDevelopmentMode)
  ) {
    return NextResponse.redirect(
      // pathname has a '/' as its 1st character. So no need for a additional '/'
      new URL(`${WEBDEALER_BASE_URL}${pathname}${search}`)
    );
  }

  if (legacyRedirects.includes(pathname)) {
    return NextResponse.redirect(
      // pathname has a '/' as its 1st character. So no need for a additional '/'
      new URL(`${WEBDEALER_BASE_URL}${pathname}${search}`)
    );
  }

  const token = req.cookies.get('webdealerami')?.value;
  const crmRedirectUrl = `${requestBaseUrl}${pathname}${search}`;

  const forbiddenRedirect = NextResponse.redirect(
    new URL(
      `/login?redirectUrl=${encodeURIComponent(crmRedirectUrl)}`,
      isDevelopmentMode ? requestBaseUrl : WEBDEALER_BASE_URL
    )
  );

  const redirectToHome = NextResponse.redirect(
    new URL(
      `/dashboard`,
      isDevelopmentMode ? requestBaseUrl : WEBDEALER_BASE_URL
    )
  );

  forbiddenRedirect.cookies.delete('webdealerami');

  const isPrivateRoute = !publicRoutes.some(
    (x) => x === req.nextUrl.pathname || x === req.url
  );

  const enableJWTVerification = true;

  if (!token && isPrivateRoute) {
    return forbiddenRedirect;
  }

  if (isPrivateRoute && token !== undefined) {
    if (enableJWTVerification) {
      try {
        const tokenVerification = await fetch(
          `${requestBaseUrl}/api/verifyToken`,
          {
            method: 'POST',
            body: JSON.stringify({ token }),
          }
        );

        if (tokenVerification.status !== 200) {
          return forbiddenRedirect;
        }

        const data = await tokenVerification.json();
        const newDealerRole = data?.auth;

        if (
          pathname.match(CRM_ROLE_ROUTES_REGEX) ||
          pathname.match(SALES_ROLE_ROUTES_REGEX)
        ) {
          if (!newDealerRole.includes(USER_ROLES.ROLE_CRM)) {
            return redirectToHome;
          }
        } else if (pathname.match(SETTINGS_ROUTE_REGEX)) {
          if (!newDealerRole.includes(USER_ROLES.ROLE_DEALER_ADMIN)) {
            return redirectToHome;
          }
        }
      } catch {
        return forbiddenRedirect;
      }
    }
    // else {
    //   try {
    //     const webReq = await fetch(`${META_FACTORY_BASE_URL}/api/account`, {
    //       headers: { Authorization: `Bearer ${token}` },
    //     }).catch(() => forbiddenRedirect);
    //     if (!webReq.ok) {
    //       return forbiddenRedirect;
    //     }
    //     const data: UserDetails = await webReq.json();
    //     if (!data.authorities.includes(newDealerRole)) {
    //       return noAccessRedirect;
    //     }
    //   } catch {
    //     return forbiddenRedirect;
    //   }
    // }
  }
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  return intlMiddleware(req);
}

export const config = {
  // Skip all paths that should not be internationalized. This example skips the
  // folders "api", "_next" and all files with an extension (e.g. favicon.ico)
  matcher: ['/((?!api|_next|health|version|.*\\..*).*)'],
};
