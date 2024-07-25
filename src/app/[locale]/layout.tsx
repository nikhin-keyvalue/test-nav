import './globals.css';

import type { Metadata } from 'next';
// eslint-disable-next-line camelcase
import { Kanit, Roboto, Roboto_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';

import { GTM_ID } from '@/constants/env';
import { getTraceId } from '@/utils/common';

import Providers from './providers';


const kanit = Kanit({
  weight: ['400', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-kanit',
});

const roboto = Roboto({
  weight: ['400', '500'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

const robotoMono = Roboto_Mono({
  weight: ['500'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
  preload: false,
});

export const metadata: Metadata = {
  title: 'AM-i CRM',
  description: '',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;

  try {
    messages = (await import(`../../../messages/${params.locale}.json`))
      .default;
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('rootlayoutLocaleIssue')
    );
    notFound();
  }

  return (
    <html lang={params.locale}>
      {GTM_ID && (
        <Script id='google-tag-manager' strategy='afterInteractive'>
          {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
        `}
        </Script>
      )}
      <body className={`${kanit.variable} ${roboto.variable} ${robotoMono.variable} ${roboto.className}`} id='__next'>
        {GTM_ID && (
          <noscript>
            <iframe
              title='sx'
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height='0'
              width='0'
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <Providers>
          <NextIntlClientProvider locale={params.locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
