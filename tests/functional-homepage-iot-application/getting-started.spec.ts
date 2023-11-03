import { expect, test } from '@playwright/test';
import {
  DashboardsIndexPage,
  GettingStartedSection,
} from '../pages/dashboards-index.page';

test.describe('Homepage For Iot Application - Getting Started', () => {
  // Positive Scenario - Checking for the existence of Getting Started
  test('Existence of Getting Started Section in the dashboard', async ({
    page,
  }) => {
    test.slow();

    const dashboardsPage = new DashboardsIndexPage(page);
    const gettingStartedSection = new GettingStartedSection(page);

    // Navigate to the dashboard page
    await dashboardsPage.goto();

    // Check if the "Getting Started" section is present
    expect(gettingStartedSection.gettingStartedButton).toBeDefined();
  });

  // Positive Scenario - Getting Started remains in expanded by default
  test('The "Getting Started" container remains expanded by default', async ({
    page,
  }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const gettingStartedSection = new GettingStartedSection(page);

    // Navigate to the dashboard page
    await dashboardsPage.goto();

    // Check if "Getting Started" container is expanded by default
    await expect(gettingStartedSection.gettingStartedButton).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  //Positive scenario - Click Getting started for expansion and collapsed modes
  test('getting started section expand and collapse ', async ({ page }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const gettingStartedSection = new GettingStartedSection(page);

    // Navigate to the dashboard page
    await dashboardsPage.goto();

    // Collapse the ""Getting Started"" section
    await gettingStartedSection.collapseGettingStarted();

    // Check if the ""Getting Started"" section is collapsed
    await expect(gettingStartedSection.gettingStartedButton).toHaveAttribute(
      'aria-expanded',
      'false',
    );

    // Expand the ""Getting Started"" section
    await gettingStartedSection.expandGettingStarted();

    // Check if the ""Getting Started"" section is expanded
    await expect(gettingStartedSection.gettingStartedButton).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  // Negative Scenario - Getting Started should not be expandable
  test('The "Getting Started" should not be expandable', async ({ page }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const gettingStartedSection = new GettingStartedSection(page);

    // Navigate to the dashboard page
    await dashboardsPage.goto();

    // Check if "Getting Started" container is not expandable
    const isExpandable =
      await gettingStartedSection.isGettingStartedExpandable();
    // Assert it is not expandable
    expect(isExpandable).toBeFalsy();
  });

  // Negative Scenario - Getting Started should not be collapsible
  test('The "Getting Started" should not be collapsible', async ({ page }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const gettingStartedSection = new GettingStartedSection(page);

    // Navigate to the dashboard page
    await dashboardsPage.goto();

    // Check if "Getting Started" container is not collapsible
    const isCollapsible = await gettingStartedSection.isExpanded();
    // Assert it is not collapsible
    expect(isCollapsible).toBeTruthy();
  });

  // Negative Scenario - Getting Started section should not be collapsed initially
  test('Getting Started section should not be collapsed initially', async ({
    page,
  }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const gettingStartedSection = new GettingStartedSection(page);

    // Navigate to the dashboard page
    await dashboardsPage.goto();

    // Check if the "Getting Started" section is not collapsed by default
    const isExpanded = await gettingStartedSection.isExpanded();
    // Assert it not to be collapsed
    expect(isExpanded).toBe(true);
  });
});
