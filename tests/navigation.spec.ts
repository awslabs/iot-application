import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('as a user, I can use the navigation drawer to access my dashboards', async ({
    page,
  }) => {
    // user opens the home page
    await page.goto('');

    // user opens the navigation drawer
    await page.getByRole('button', { name: 'Open navigation drawer' }).click();

    // user navigates to the dashboards page
    await page
      .getByRole('navigation', { name: 'Navigation drawer' })
      .getByText('Dashboards')
      .click();

    // user closes the navigation drawer
    await page.getByRole('button', { name: 'Close navigation drawer' }).click();

    // user sees they are on the dashboards page
    await expect(page.getByRole('heading')).toHaveText('Dashboards');
  });

  test('as a user, I can use the side navigation to access the home page', async ({
    page,
  }) => {
    // users opens the dashboards page
    await page.goto('dashboards');

    // user opens the navigation drawer
    await page.getByRole('button', { name: 'Open navigation drawer' }).click();

    // user navigates to the home page
    await page
      .getByRole('navigation', { name: 'Navigation drawer' })
      .getByText('IoT Application')
      .click();

    // user closes the navigation drawer
    await page.getByRole('button', { name: 'Close navigation drawer' }).click();

    // user sees they are on the home page
    await expect(page.getByRole('heading')).toHaveText('Home');
  });

  test('as a user, I can use the top navigation to navigate to the home page', async ({
    page,
  }) => {
    // users opens the dashboards page
    await page.goto('dashboards');

    // user navigates to home page
    await page.getByRole('navigation').getByText('IoT Application').click();

    // user sees they are on the home page
    await expect(page.getByRole('heading')).toHaveText('Home');
  });

  test('as a user, I can use the breadcrumbs to navigate to the home page', async ({
    page,
  }) => {
    // users opens the dashboards page
    await page.goto('dashboards');

    // user navigates to home page
    await page
      .getByRole('navigation', { name: 'Breadcrumbs' })
      .getByText('IoT Application')
      .click();

    // user sees they are on the home page
    await expect(page.getByRole('heading')).toHaveText('Home');
  });

  test('as a user, I can navigate to application documentation', async ({
    page,
  }) => {
    // user opens the home page
    await page.goto('');

    // the dropdown menu is not visible to user
    await expect(page.getByRole('menu')).not.toBeVisible();

    // user opens the dropdown menu
    await page.getByRole('button', { name: '<name>' }).click();

    // the dropdown menu is visible to user
    await expect(page.getByRole('menu')).toBeVisible();

    // user clicks on documentation link
    await page.getByRole('menuitem', { name: 'Documentation' }).click();

    // the documentation opens in a new tab
    page.on('popup', async () => {
      // user sees their are on the documentation page
      await expect(page).toHaveURL(
        'https://github.com/awslabs/iot-application',
      );
    });
  });

  test('as a user, I can navigate to application feedback', async ({
    page,
  }) => {
    // user opens the home page
    await page.goto('');

    // user opens the dropdown menu
    await page.getByRole('button', { name: '<name>' }).click();

    // user clicks on feedback link
    await page.getByRole('menuitem', { name: 'Feedback' }).click();

    // the feedback page opens in a new tab
    page.on('popup', async () => {
      // user sees they are on the feedback page
      await expect(page).toHaveURL(
        'https://github.com/awslabs/iot-application/issues',
      );
    });
  });
});
