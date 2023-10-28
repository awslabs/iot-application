import { test, expect } from '@playwright/test';

test.describe('Settings', () => {
  test.skip('as a user, I can set my preffered content density', async ({
    page,
  }) => {
    const settingsButton = page.getByRole('button', { name: 'Settings' });
    const settingsDialog = page.getByRole('dialog', { name: 'Settings' });
    const densityToggle = settingsDialog.getByRole('checkbox');

    // user opens the dashboard page
    await page.goto('');

    // user opens application settings
    await settingsButton.click();

    // user sees the toggle is checked
    await expect(densityToggle).toBeChecked();

    // user unchecks the toggle
    await densityToggle.uncheck();

    // user sees the toggle is unchecked
    await expect(densityToggle).not.toBeChecked();

    // user confirms their content density setting
    await settingsDialog.getByRole('button', { name: 'Confirm' }).click();

    // user opens application settings again
    await settingsButton.click();

    // user sees their setting is retained
    await expect(densityToggle).not.toBeChecked();

    // user refreshes the page
    await page.reload();

    // user opens application settings again
    await settingsButton.click();

    // user sees their setting is retained after page refresh
    await expect(densityToggle).not.toBeChecked();
  });

  test.skip('as a user, I can cancel making a change to content density', async ({
    page,
  }) => {
    const settingsButton = page.getByRole('button', { name: 'Settings' });
    const settingsDialog = page.getByRole('dialog', { name: 'Settings' });
    const densityToggle = settingsDialog.getByRole('checkbox');

    // user opens the dashboards page
    await page.goto('');

    // user opens application settings
    await settingsButton.click();

    // user sees the toggle is checked
    await expect(densityToggle).toBeChecked();

    // user unchecks the toggle
    await densityToggle.uncheck();

    // user sees the toggle is unchecked
    await expect(densityToggle).not.toBeChecked();

    // user clicks the cancel button
    await settingsDialog.getByRole('button', { name: 'Cancel' }).click();

    // user opens application settings again
    await settingsButton.click();

    // user sees no change was made to the content density setting
    await expect(densityToggle).toBeChecked();

    // user unchecks the toggle again
    await densityToggle.uncheck();

    // user clicks the close button
    await settingsDialog
      .getByRole('button', { name: 'Close settings' })
      .click();

    // user opens application settings again
    await settingsButton.click();

    // user sees no change was made to the content density setting
    await expect(densityToggle).toBeChecked();
  });
});
