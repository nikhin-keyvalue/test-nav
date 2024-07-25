'use client';

import 'react-toastify/dist/ReactToastify.css';

import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { ToastContainer } from 'react-toastify';

import { lightTheme } from '@/theme/MuiTheme';

import LocalizationContextProvider from './(user)/context/localization-context/LocalizationContextProvider';

const queryClient = new QueryClient();

const Providers = ({ children }: React.PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>
    <AppRouterCacheProvider>
      <StyledEngineProvider injectFirst={false}>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <LocalizationContextProvider>
            <ToastContainer newestOnTop />
            {children}
          </LocalizationContextProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </AppRouterCacheProvider>
  </QueryClientProvider>
);

export default Providers;
