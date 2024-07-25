import withBundleAnalyzer from '@next/bundle-analyzer';
import nextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    instrumentationHook: true
  },
};

const withIntl = nextIntlPlugin('./src/i18n.ts');

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withIntl(bundleAnalyzer(nextConfig));
