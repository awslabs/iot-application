import { test, expect } from '@playwright/test';

test.describe('Breadcrumbs', () => {
  test('as a user, I can navigate up the information hierarchy using breadcrumbs', async ({
    page,
  }) => {
    await page.goto('http://localhost:3001/dashboards');
    await expect(page.getByRole('heading')).toHaveText('Dashboards');
    await page.getByText('Home').click();

    await expect(page.getByText('Dashboards')).not.toBeVisible();
  });
});
