import { test, expect, violationFingerprints } from './helpers';

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

  test('dashboard creation', async ({
    page,
    applicationFrame,
    createDashboardPage,
    deleteDashboards,
  }) => {
    await createDashboardPage.nameField.fill('test dashboard name');
    await createDashboardPage.descriptionField.fill(
      'test dashboard description',
    );
    await createDashboardPage.createButton.click();
    await createDashboardPage.expectIsNotCurrentPage();
    await expect(applicationFrame.notification).toContainText(
      'Successfully created dashboard "test dashboard name".',
    );
    // Clean up to not impact other tests
    const url = page.url();
    const dashboardId = url.split('/').at(-1);
    await deleteDashboards({ ids: [dashboardId ?? ''] });
  });

  test('dashboard name is required', async ({ createDashboardPage }) => {
    await expect(createDashboardPage.nameField).toBeEmpty();

    // The error appears when create is clicked
    await createDashboardPage.createButton.click();
    await expect(createDashboardPage.nameRequiredError).toBeVisible();
    await createDashboardPage.expectIsCurrentPage();

    // The error goes away when a single character is added
    await createDashboardPage.nameField.fill('a');
    await expect(createDashboardPage.nameRequiredError).toBeHidden();

    // The error reappears without clicking the create button again when rule is violated
    await createDashboardPage.nameField.clear();
    await expect(createDashboardPage.nameRequiredError).toBeVisible();
  });

  test('dashboard name cannot be longer than max length', async ({
    createDashboardPage,
  }) => {
    const nameTooLong = Array(createDashboardPage.maxDashboardNameLength + 1)
      .fill('a')
      .join('');

    // The error is not immediately visible
    await createDashboardPage.nameField.fill(nameTooLong);
    await expect(createDashboardPage.nameMaxLengthError).toBeHidden();

    // The error appears when create is clicked
    await createDashboardPage.createButton.click();
    await expect(createDashboardPage.nameMaxLengthError).toBeVisible();
    await createDashboardPage.expectIsCurrentPage();

    // The error goes away after the max length is no longer exceeded
    await createDashboardPage.nameField.focus();
    await createDashboardPage.nameField.press('Backspace');
    await expect(createDashboardPage.nameMaxLengthError).toBeHidden();

    // The error reappears without clicking the create button again when rule is violated
    await createDashboardPage.nameField.focus();
    await createDashboardPage.nameField.press('a');
    await expect(createDashboardPage.nameMaxLengthError).toBeVisible();
  });

  test('dashboard description is required', async ({ createDashboardPage }) => {
    await expect(createDashboardPage.descriptionField).toBeEmpty();

    // The error appears when create is clicked
    await createDashboardPage.createButton.click();
    await expect(createDashboardPage.descriptionRequiredError).toBeVisible();
    await createDashboardPage.expectIsCurrentPage();

    // The error goes away when a single character is added
    await createDashboardPage.descriptionField.fill('a');
    await expect(createDashboardPage.descriptionRequiredError).toBeHidden();

    // The error reappears without clicking the create button again when rule is violated
    await createDashboardPage.descriptionField.clear();
    await expect(createDashboardPage.descriptionRequiredError).toBeVisible();
  });

  test('dashboard description cannot be longer than max length', async ({
    createDashboardPage,
  }) => {
    const descriptionTooLong = Array(
      createDashboardPage.maxDashboardDescriptionLength + 1,
    )
      .fill('a')
      .join('');

    // The error is not immediately visible
    await createDashboardPage.descriptionField.fill(descriptionTooLong);
    await expect(createDashboardPage.descriptionMaxLengthError).toBeHidden();

    // The error appears when create is clicked
    await createDashboardPage.createButton.click();
    await expect(createDashboardPage.descriptionMaxLengthError).toBeVisible();
    await createDashboardPage.expectIsCurrentPage();

    // The error goes away after the max length is no longer exceeded
    await createDashboardPage.descriptionField.focus();
    await createDashboardPage.descriptionField.press('Backspace');
    await expect(createDashboardPage.descriptionMaxLengthError).toBeHidden();

    // The error reappears without clicking the create button again when rule is violated
    await createDashboardPage.descriptionField.focus();
    await createDashboardPage.descriptionField.press('a');
    await expect(createDashboardPage.descriptionMaxLengthError).toBeVisible();
  });

  test('empty page screenshot', async ({
    page,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createDashboardPage: _createDashboardPage,
  }) => {
    await expect(page).toHaveScreenshot('empty-page.png');
  });

  test('filled fields screenshot', async ({ page, createDashboardPage }) => {
    await createDashboardPage.nameField.fill('test dashboard name');
    await createDashboardPage.descriptionField.fill(
      'test dashboard description',
    );

    await expect(page).toHaveScreenshot('filled-fields.png');
  });

  test('required field errors screenshot', async ({
    page,
    createDashboardPage,
  }) => {
    await createDashboardPage.createButton.click();

    await expect(page).toHaveScreenshot('required-field-errors.png');
  });

  test('max length errors screenshot', async ({
    page,
    createDashboardPage,
  }) => {
    const nameTooLong = Array(createDashboardPage.maxDashboardNameLength + 1)
      .fill('a')
      .join('');
    const descriptionTooLong = Array(
      createDashboardPage.maxDashboardDescriptionLength + 1,
    )
      .fill('a')
      .join('');

    await createDashboardPage.nameField.fill(nameTooLong);
    await createDashboardPage.descriptionField.fill(descriptionTooLong);
    await createDashboardPage.createButton.click();

    await expect(page).toHaveScreenshot('max-length-errors.png');
  });

  test('empty page accessibility', async ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createDashboardPage: _createDashboardPage,
    makeAxeBuilder,
  }) => {
    const accessibilityScanResults = await makeAxeBuilder().analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('filled fields accessibility', async ({
    createDashboardPage,
    makeAxeBuilder,
  }) => {
    await createDashboardPage.nameField.fill('test dashboard name');
    await createDashboardPage.descriptionField.fill(
      'test dashboard description',
    );
    const accessibilityScanResults = await makeAxeBuilder().analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('required field errors accessibility', async ({
    createDashboardPage,
    makeAxeBuilder,
  }) => {
    await createDashboardPage.createButton.click();
    const accessibilityScanResults = await makeAxeBuilder().analyze();

    expect(violationFingerprints(accessibilityScanResults)).toMatchSnapshot(
      'required-field-errors',
    );
  });

  test('max length errors accessibility', async ({
    createDashboardPage,
    makeAxeBuilder,
  }) => {
    const nameTooLong = Array(createDashboardPage.maxDashboardNameLength + 1)
      .fill('a')
      .join('');
    const descriptionTooLong = Array(
      createDashboardPage.maxDashboardDescriptionLength + 1,
    )
      .fill('a')
      .join('');

    await createDashboardPage.nameField.fill(nameTooLong);
    await createDashboardPage.descriptionField.fill(descriptionTooLong);
    await createDashboardPage.createButton.click();
    const accessibilityScanResults = await makeAxeBuilder().analyze();

    expect(violationFingerprints(accessibilityScanResults)).toMatchSnapshot(
      'max-length-errors',
    );
  });
});
