import { test, expect } from '@playwright/test';
import { DashboardsIndexPage } from '../pages/dashboards-index.page';
import { Footer } from '../pages/application-frame.page';

test.describe('Homepage For Iot Application - Footer Testing', () => {
  // Positive Scenario: Verify Footer Rendering
  test('Verify Footer Rendering', async ({ page }) => {
    const dashboardsPage = new DashboardsIndexPage(page);

    // Navigate to the dashboard page where the footer should be displayed.
    await dashboardsPage.goto();
    await dashboardsPage.expectIsCurrentPage();

    // Initialize the Footer object.
    const footer = new Footer(page);

    // Check if the footer is visible.
    await footer.isFooterVisible();

    // Assert that the Footer is visible.
    await expect(footer.footerElement).toBeVisible();

    // Get the copyright text from the footer.
    const copyrightText = await footer.getCopyrightText();

    // Assert that the copyright text contains the expected content.
    expect(copyrightText).toContain('© 2023, Amazon Web Services, Inc.');
  });
});
