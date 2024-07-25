import { headers } from 'next/headers';

const getCookieDomain = () => {
  const headersList = headers();
  const hostDomain = headersList.get('host')?.split(':')[0] ?? '';
  if (hostDomain && hostDomain !== 'localhost') {
    const urlDomains = hostDomain.split('.');
    const urlLength = urlDomains.length;
    const domain = `.${urlDomains[urlLength - 2]}.${urlDomains[urlLength - 1]}`; // taking the last two portions of the domain to set the cookie's domain
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
