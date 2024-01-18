import { expect, test } from './helpers';

test.describe('dashboard page', () => {
  test('renders the page as expected', async ({
    dashboardPage: { dashboardPage, dashboard },
  }) => {
    await dashboardPage.expectIsCurrentPage();
    await expect(dashboardPage.heading).toHaveText(dashboard.name);

    // The dashboard starts in preview mode
    await expect(dashboardPage.editButton).toBeVisible();
    await expect(dashboardPage.saveButton).toBeVisible();
  });

  test('dashboard save is successful', async ({
    applicationFrame,
    dashboardPage: { dashboardPage, dashboard },
  }) => {
    await expect(applicationFrame.notification).toBeHidden();
    await dashboardPage.saveButton.click();
    await expect(applicationFrame.notification).toBeVisible();
    await expect(applicationFrame.notification).toContainText(
      `Successfully updated dashboard "${dashboard.name}".`,
    );
  });

  test('screenshot', async ({
    page,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dashboardPage: _dashboardPage,
  }) => {
    await expect(page).toHaveScreenshot('dashboard-page.png', {
      mask: [page.locator('.dashboard')], // dashboard screenshot tested in iot-app-kit
    });
  });

  test('accessibility', async ({
    makeAxeBuilder,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dashboardPage: _dashboardPage,
  }) => {
    const accessibilityScanResults = await makeAxeBuilder()
      .exclude('.dashboard') // dashboard accessibility tested in iot-app-kit
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
