import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page, browserName }) => {
  // increase timeout for authentication
  setup.slow();

  // user enters application at Amplify login page
  await page.goto('');

  await page.screenshot({
    animations: 'disabled',
    fullPage: true,
    path: `screenshots/${browserName}/login.png`,
  });

  // user enters their credentials
  await page.getByLabel('Username').fill('test-user');
  await page.getByLabel('Password').nth(0).fill('test-Password!');

  // user clicks sign-in
  await page.getByRole('button', { name: 'Sign in' }).click();

  // user skips email verification
  await page.getByRole('button', { name: 'Skip' }).click();

  // user lands at home page
  await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();

  // storage of authentication state for tests
  await page.context().storageState({ path: authFile });
});
