import { Page } from '@playwright/test';

async function getAuthToken(page: Page) {
  return (await page.context().cookies()).find((x) => x.name === 'webdealerami')
    ?.value;
}

export default getAuthToken;
