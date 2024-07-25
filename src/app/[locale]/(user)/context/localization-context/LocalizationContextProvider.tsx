'use client';

import 'dayjs/locale/nl';
import 'dayjs/locale/en';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useLocale } from 'next-intl';
import { ReactNode } from 'react';

const LocalizationContextProvider = ({ children }: { children: ReactNode }) => {
  const locale = useLocale();

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={dayjs.locale(locale)}
    >
      {children}
    </LocalizationProvider>
  );
};

export default LocalizationContextProvider;
