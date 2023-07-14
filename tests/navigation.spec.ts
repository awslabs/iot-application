import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home.page';
import {
  Breadcrumbs,
  SideNavigation,
  TopNavigation,
} from './pages/application-frame.page';
import { DashboardsIndexPage } from './pages/dashboards-index.page';

test('as a user, I can use the application navigation', async ({ page }) => {
  test.slow();

  const homePage = new HomePage(page);
  const sideNavigation = new SideNavigation(page);
  const dashboardsPage = new DashboardsIndexPage(page);
  const topNavigation = new TopNavigation(page);
  const breadcrumbs = new Breadcrumbs(page);

  await dashboardsPage.goto();
  await dashboardsPage.expectIsCurrentPage();

  // navigate back to home page with side navigation
  await sideNavigation.openButton.click();
  await sideNavigation.homeLink.click();

  await homePage.expectIsCurrentPage();
  await dashboardsPage.expectIsNotCurrentPage();
  await sideNavigation.expectIsHidden();

  // navigate to dashboards page with side navigation
  await sideNavigation.openButton.click();
  await sideNavigation.expectIsNotHidden();
  await sideNavigation.dashboardsPageLink.click();

  await dashboardsPage.expectIsCurrentPage();
  await homePage.expectIsNotCurrentPage();
  await sideNavigation.expectIsHidden();

  // navigate back to home page with top navigation
  await topNavigation.homeLink.click();

  await homePage.expectIsCurrentPage();
  await dashboardsPage.expectIsNotCurrentPage();

  // go to dashboards page directly
  await dashboardsPage.goto();
  await dashboardsPage.expectIsCurrentPage();

  // navigate back to home page with breadcrumbs
  await breadcrumbs.homeLink.click();

  await homePage.expectIsCurrentPage();
  await dashboardsPage.expectIsNotCurrentPage();

  // FIXME: add non-existent page handling in Core
  // // navigate to non-existent page
  // await page.goto('this-page-does-not-exist');

  // await expect(
  //   page.getByRole('heading', { name: 'Page not found' }),
  // ).toBeVisible();

  // // navigate back to home page on 404 page
  // await page.getByRole('link', { name: 'IoT Application home page' }).click();

  await expect(page).toHaveURL('/');
});
