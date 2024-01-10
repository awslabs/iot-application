import { test, expect } from './helpers';

test.describe('create dashboard page', () => {
  test('empty page', async ({ createDashboardPage }) => {
    await expect(createDashboardPage.heading).toBeVisible();
    await expect(createDashboardPage.nameField).toBeVisible();
    await expect(createDashboardPage.nameField).toBeEmpty();
    await expect(createDashboardPage.nameRequiredError).toBeHidden();
    await expect(createDashboardPage.nameMaxLengthError).toBeHidden();
    await expect(createDashboardPage.descriptionField).toBeVisible();
    await expect(createDashboardPage.descriptionField).toBeEmpty();
    await expect(createDashboardPage.descriptionRequiredError).toBeHidden();
    await expect(createDashboardPage.descriptionMaxLengthError).toBeHidden();
    await expect(createDashboardPage.cancelButton).toBeVisible();
    await expect(createDashboardPage.createButton).toBeVisible();
    await expect(createDashboardPage.createButton).toBeEnabled();
  });

  test('required field errors', async ({ createDashboardPage }) => {
    await expect(createDashboardPage.nameField).toBeEmpty();
    await expect(createDashboardPage.descriptionField).toBeEmpty();

    await createDashboardPage.createButton.click();

    await expect(createDashboardPage.nameRequiredError).toBeVisible();
    await expect(createDashboardPage.descriptionRequiredError).toBeVisible();

    await createDashboardPage.nameField.fill('a');

    await expect(createDashboardPage.nameRequiredError).toBeHidden();

    await createDashboardPage.descriptionField.fill('a');

    await expect(createDashboardPage.descriptionRequiredError).toBeHidden();
  });
});
