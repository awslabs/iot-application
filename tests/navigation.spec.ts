import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home.page';
import {
  Breadcrumbs,
  SideNavigation,
  TopNavigation,
} from './pages/application-frame.page';
import { DashboardsIndexPage } from './pages/dashboards-index.page';

test.describe('Navigation', () => {
  test('as a user, I can use the navigation drawer to access my dashboards', async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const sideNavigation = new SideNavigation(page);
    const dashboardsPage = new DashboardsIndexPage(page);

    await homePage.goto();
    await homePage.expectIsCurrentPage();

    await sideNavigation.openButton.click();
    await sideNavigation.expectIsNotHidden();
    await sideNavigation.dashboardsPageLink.click();

    await dashboardsPage.expectIsCurrentPage();
    await homePage.expectIsNotCurrentPage();
    await sideNavigation.expectIsHidden();
  });

  test('as a user, I can use the side navigation to access the home page', async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const sideNavigation = new SideNavigation(page);
    const dashboardsPage = new DashboardsIndexPage(page);

    await dashboardsPage.goto();
    await dashboardsPage.expectIsCurrentPage();

    await sideNavigation.openButton.click();
    await sideNavigation.homeLink.click();

    await homePage.expectIsCurrentPage();
    await dashboardsPage.expectIsNotCurrentPage();
    await sideNavigation.expectIsHidden();
  });

  test('as a user, I can use the top navigation to navigate to the home page', async ({
    page,
  }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const homePage = new HomePage(page);
    const topNavigation = new TopNavigation(page);

    await dashboardsPage.goto();
    await dashboardsPage.expectIsCurrentPage();

    await topNavigation.homeLink.click();

    await homePage.expectIsCurrentPage();
    await dashboardsPage.expectIsNotCurrentPage();
  });

  test('as a user, I can use the breadcrumbs to navigate to the home page', async ({
    page,
  }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const homePage = new HomePage(page);
    const breadcrumbs = new Breadcrumbs(page);

    await dashboardsPage.goto();
    await dashboardsPage.expectIsCurrentPage();

    await breadcrumbs.homeLink.click();

    await homePage.expectIsCurrentPage();
    await dashboardsPage.expectIsNotCurrentPage();
  });

  test('as a user, I can navigate to application documentation', async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const topNavigation = new TopNavigation(page);

    await homePage.goto();
    await homePage.expectIsCurrentPage();

    await expect(topNavigation.dropdownMenu).toBeHidden();
    await topNavigation.openDropdownButton.click();
    await expect(topNavigation.dropdownMenu).toBeVisible();

    await topNavigation.documentationLink.click();

    // the documentation opens in a new tab
    page.on('popup', () => {
      void (async () => {
        // user sees their are on the documentation page
        await expect(page).toHaveURL(
          'https://github.com/awslabs/iot-application',
        );
      })();
    });
  });

  test('as a user, I can navigate to application feedback', async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const topNavigation = new TopNavigation(page);

    await homePage.goto();
    await homePage.expectIsCurrentPage();

    await topNavigation.openDropdownButton.click();
    await topNavigation.feedbackLink.click();

    // the feedback page opens in a new tab
    page.on('popup', () => {
      void (async () => {
        // user sees they are on the feedback page
        await expect(page).toHaveURL(
          'https://github.com/awslabs/iot-application/issues',
        );
      })();
    });
  });

  test('as a user, I see a page not found page when I navigate to a non-existent page', async ({
    page,
  }) => {
    await page.goto('this-page-does-not-exist');

    await expect(
      page.getByRole('heading', { name: 'Page not found' }),
    ).toBeVisible();

    // TODO: add a screenshot once https://github.com/awslabs/iot-application/pull/122 is merged
    await page.getByRole('link', { name: 'IoT Application home page' }).click();

    await expect(page).toHaveURL('/');
  });
});
