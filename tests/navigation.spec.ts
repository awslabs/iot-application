import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('as a user, I can use the navigation to view my dashboards', async ({
    page,
  }) => {
    await page.goto('http://localhost:3001');
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await page.getByText('Dashboards').click();
    await page.getByRole('button', { name: 'Close navigation' }).click();

    await expect(page.getByRole('heading')).toHaveText('Dashboards');
  });
});
