import { Page } from '@playwright/test';

export const getIdFromUrl = (page: Page) => {
  const url = page.url();
  const urlArray = url?.split('/');
  const urlArrayLength = urlArray?.length || 0;
  return urlArrayLength && urlArrayLength >= 2
    ? urlArray[urlArrayLength - 2]
    : '';
};
