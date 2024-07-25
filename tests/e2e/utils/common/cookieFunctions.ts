import { BrowserContext, Page } from '@playwright/test';

const setTestCookie = async (page: Page, cookieName: string, value: string) => {
  const context = page.context();
  const url = new URL(page.url());
  context.addCookies([
    { name: cookieName, value, path: '/', domain: url.hostname },
  ]);
};

const getTestCookie = async (context: BrowserContext, cookieName: string) =>
  (await context.cookies()).find((cookie) => cookie.name === cookieName)?.value;

export { setTestCookie, getTestCookie };
