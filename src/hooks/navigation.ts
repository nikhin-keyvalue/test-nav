'use client';

import { usePathname, useSearchParams } from 'next/navigation';

const usePathWithSearchParams = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return `${pathname}?${encodeURIComponent(searchParams.toString())}`;
};

export { useSearchParams, usePathWithSearchParams };
