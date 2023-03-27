import { expect } from '@playwright/test';
import type { Page, Locator } from '@playwright/test';

export class CreateDashboardPage {
  readonly page: Page;
  public readonly heading: Locator;
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

  private readonly url = 'dashboards/create';

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Create dashboard' });
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

  public async expectIsCurrentPage() {
    await expect(this.page).toHaveURL(this.url);
    await expect(this.heading).toBeVisible();
  }

  public async expectIsNotCurrentPage() {
    await expect(this.page).not.toHaveURL(this.url);
    await expect(this.heading).not.toBeVisible();
  }
}
