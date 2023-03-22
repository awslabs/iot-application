import { test, expect, Page, Locator } from '@playwright/test';

class Application {
  readonly page: Page;
  readonly notifications: Locator;
  readonly notification: Locator;

  constructor(page: Page) {
    this.page = page;
    this.notifications = page.getByRole('region', { name: 'Notifications' });
    this.notification = this.notifications.getByRole('listitem');
  }
}

class CreateDashboardPage {
  readonly page: Page;
  readonly nameField: Locator;
  readonly descriptionField: Locator;
  readonly createButton: Locator;
  readonly cancelButton: Locator;
  readonly nameRequiredError: Locator;
  readonly descriptionRequiredError: Locator;
  readonly nameMaxLengthError: Locator;
  readonly descriptionMaxLengthError: Locator;
  readonly nameMaxLength = 40;
  readonly descriptionMaxLength = 200;

  constructor(page: Page) {
    this.page = page;
    this.nameField = page.getByLabel('Dashboard name');
    this.descriptionField = page.getByLabel('Dashboard description');
    this.createButton = page.getByRole('button', { name: 'Create' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.nameRequiredError = page.getByText('Dashboard name is required.');
    this.descriptionRequiredError = page.getByText(
      'Dashboard description is required.',
    );
    this.nameMaxLengthError = page.getByText(
      'Dashboard name must be 40 characters or less.',
    );
    this.descriptionMaxLengthError = page.getByText(
      'Dashboard description must be 200 characters or less',
    );
  }

  async goto() {
    await this.page.goto('dashboards/create');
  }

  async typeName(name: string) {
    await this.nameField.type(name);
  }

  async typeMaxLengthName() {
    await this.typeName(Array(this.nameMaxLength).fill('a').join(''));
  }

  async clearName() {
    await this.nameField.clear();
  }

  async typeDescription(description: string) {
    await this.descriptionField.type(description);
  }

  async typeMaxLengthDescription() {
    await this.typeDescription(
      Array(this.descriptionMaxLength).fill('a').join(''),
    );
  }

  async clearDescription() {
    await this.descriptionField.clear();
  }

  async clickCreate() {
    await this.createButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }
}

test.describe('Dashboard Creation', () => {
  test('as a user, I can create a dashboard', async ({ page }) => {
    const application = new Application(page);
    const createPage = new CreateDashboardPage(page);
    const dashboardName = 'Wind Farm 5';
    const dashboardDescription = '40.047050, -105.272148';

    // user goes to create dashboard page directly
    await createPage.goto();

    // user enters a dashboard name and description
    await createPage.typeName(dashboardName);
    await createPage.typeDescription(dashboardDescription);

    // user creates their dashboard
    await createPage.clickCreate();

    // user is redirected to the dashboards page
    await expect(page).toHaveURL('dashboards');
    await expect(page).not.toHaveURL('dashboards/create');

    // user sees their dashboard in the dashboards table
    await expect(
      page
        .getByRole('row')
        .filter({ has: page.getByRole('cell', { name: dashboardName }) })
        .filter({ has: page.getByRole('cell', { name: dashboardDescription }) })
        .nth(0),
    ).toBeVisible();

    // user sees a create dashboard success notification
    await expect(application.notifications).toBeVisible();
    await expect(application.notification).toHaveText(
      /Successfully created dashboard/,
    );
    await expect(application.notification).toContainText(dashboardName);

    // user goes to their new dashboard page using the notification action
    await application.notification
      .getByRole('button', { name: 'View dashboard' })
      .click();

    // user is redirected to their dashboard page
    await expect(page).not.toHaveURL('dashboards');
    await expect(page).toHaveURL(/dashboards\/[\w\d-]{12}$/);
  });

  test('as a user, I cannot create an invalid dashboard', async ({ page }) => {
    const createPage = new CreateDashboardPage(page);
    const application = new Application(page);

    // user goes to create dashboard page directly
    await createPage.goto();

    // user does not initial see errors
    await expect(createPage.nameRequiredError).not.toBeVisible();
    await expect(createPage.descriptionRequiredError).not.toBeVisible();

    // user tries to create a dashboard without entering name or description
    await createPage.clickCreate();

    // user is not redirected to dashboards page
    await expect(page).toHaveURL('dashboards/create');
    await expect(page).not.toHaveURL('dashboards');

    // user sees validation errors for name and description
    await expect(createPage.nameRequiredError).toBeVisible();
    await expect(createPage.descriptionRequiredError).toBeVisible();

    // user types a single character for the name
    await createPage.typeName('a');

    // user sees the name required validation error immediately disappear
    await expect(createPage.nameRequiredError).not.toBeVisible();

    // user tries and fails to create a dashboard without a description
    await createPage.clickCreate();
    await expect(page).toHaveURL('dashboards/create');
    await expect(page).not.toHaveURL('dashboards');
    await expect(application.notification).not.toBeVisible();

    // user types a single character for the description
    await createPage.typeDescription('a');

    // user sees the description required validation error immediately disappear
    await expect(createPage.descriptionRequiredError).not.toBeVisible();

    // user deletes name
    await createPage.clearName();

    // user tries and fails to create a dashboard without a name
    await createPage.clickCreate();
    await expect(page).toHaveURL('dashboards/create');
    await expect(page).not.toHaveURL('dashboards');
    await expect(application.notification).not.toBeVisible();

    // user enters the max length name
    await createPage.clearName();
    await createPage.typeMaxLengthName();

    // user does not see a name validation error
    await expect(createPage.nameMaxLengthError).not.toBeVisible();

    // user enters the max length description
    await createPage.clearDescription();
    await createPage.typeMaxLengthDescription();

    // user does not see a description validation error
    await expect(createPage.descriptionMaxLengthError).not.toBeVisible();

    // user adds an extra character to name
    await createPage.typeName('a');

    // user sees a max length name validation error
    await expect(createPage.nameMaxLengthError).toBeVisible();

    // user tries and fails to create a dashboard with a name too long
    await createPage.clickCreate();
    await expect(page).toHaveURL('dashboards/create');
    await expect(page).not.toHaveURL('dashboards');
    await expect(application.notification).not.toBeVisible();

    // user removes a character from name
    await createPage.nameField.press('Delete');

    // user does not see a max length name validation error
    await expect(createPage.nameMaxLengthError).not.toBeVisible();

    // user adds an extra character to description
    await createPage.typeDescription('a');

    // user sees a max length description validation error
    await expect(createPage.descriptionMaxLengthError).toBeVisible();

    // user tries and files to create a dashboard with a description too long
    await createPage.clickCreate();
    await expect(page).toHaveURL('dashboards/create');
    await expect(page).not.toHaveURL('dashboards');
    await expect(application.notification).not.toBeVisible();

    // user removes a character from description
    await createPage.descriptionField.press('Backspace');

    // user does not see a max length description validation error
    await expect(createPage.descriptionMaxLengthError).not.toBeVisible();

    // user successfully creates their dashboard
    await createPage.clickCreate();
    await expect(page).not.toHaveURL('dashboards/create');
    await expect(page).toHaveURL('dashboards');
    await expect(application.notification).toBeVisible();
  });

  test('as a user, I cancel creating a dashboard', async ({ page }) => {
    const createPage = new CreateDashboardPage(page);
    const application = new Application(page);

    // user goes to create dashboard page directly
    await createPage.goto();

    // user enters a dashboard name and description
    await createPage.typeName('name');
    await createPage.typeDescription('description');

    // user backs out of creating a dashboard
    await createPage.clickCancel();

    // user is back on the dashboards page without a new dashboard created
    await expect(page).toHaveURL('dashboards');
    await expect(page).not.toHaveURL('dashboards/create');
    await expect(application.notification).not.toBeVisible();
  });

  test('as a user, I see a error notification when creation of a valid dashboard fails', async ({
    page,
  }) => {
    const createPage = new CreateDashboardPage(page);
    const application = new Application(page);

    await page.route('http://localhost:3000/dashboards', async (route) => {
      route.fulfill({
        status: 500,
      });
    });

    // user goes to create dashboard page directly
    await createPage.goto();

    // user enters a dashboard name and description
    await createPage.typeName('name');
    await createPage.typeDescription('description');

    // user attempts to create dashboard
    await createPage.clickCreate();

    // user sees error notification
    await expect(application.notification).toBeVisible();
    await expect(application.notification).toHaveText('Internal Server Error');
    await expect(page).toHaveURL('dashboards/create');
    await expect(page).not.toHaveURL('dashboards');
  });

  const errors = [
    { status: 400, message: 'Bad Request' },
    { status: 401, message: 'Unauthorized' },
    { status: 403, message: 'Forbidden' },
  ];

  for (const { status, message } of errors) {
    test(`as a user, I see a form error when dashboard creation fails for status: ${status}`, async ({
      page,
    }) => {
      const createPage = new CreateDashboardPage(page);
      const application = new Application(page);

      await page.route('http://localhost:3000/dashboards', async (route) => {
        route.fulfill({
          status: status,
        });
      });

      // user goes to create dashboard page directly
      await createPage.goto();

      // user enters a dashboard name and description
      await createPage.typeName('name');
      await createPage.typeDescription('description');

      // user attempts to create dashboard
      await createPage.clickCreate();

      // user sees form error
      await expect(page.getByText(message).nth(0)).toBeVisible();
      await expect(application.notification).not.toBeVisible();
      await expect(page).toHaveURL('dashboards/create');
      await expect(page).not.toHaveURL('dashboards');
    });
  }
});
