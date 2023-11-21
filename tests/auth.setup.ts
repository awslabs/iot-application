import { test as setup, expect } from '@playwright/test';

// Read environment variables
const userPassword = process.env.USER_PASSWORD ?? 'test-Password!';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // increase timeout for authentication
  setup.slow();

  // user enters application at Amplify login page
  await page.goto('');

  // user enters their credentials
  await page.getByLabel('Username').fill('test-user');
  await page.getByLabel('Password').nth(0).fill(userPassword);

  // user clicks sign-in
  await page.getByRole('button', { name: 'Sign in' }).click();

  // user lands at home page
  await expect(
    page.getByRole('heading', { name: 'Dashboards' }).first(),
  ).toBeVisible();

  // storage of authentication state for tests
  await page.context().storageState({ path: authFile });
});
