import { expect } from '@playwright/test';
import type { Page, Locator } from '@playwright/test';

export class CreateDashboardPage {
  private readonly page: Page;
  private readonly url = 'dashboards/create';
  public readonly heading: Locator;
  public readonly nameField: Locator;
  public readonly nameRequiredError: Locator;
  public readonly nameMaxLengthError: Locator;
  public readonly descriptionField: Locator;
  public readonly descriptionRequiredError: Locator;
  public readonly descriptionMaxLengthError: Locator;
  public readonly createButton: Locator;
  public readonly cancelButton: Locator;
  public readonly maxDashboardNameLength = 256;
  public readonly maxDashboardDescriptionLength = 200;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Create dashboard' });
    this.nameField = page.getByRole('textbox', { name: 'Name' });
    this.descriptionField = page.getByRole('textbox', {
      name: 'Description',
    });
    this.createButton = page.getByRole('button', { name: 'Create' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.nameRequiredError = page.getByText('Dashboard name is required.');
    this.descriptionRequiredError = page.getByText(
      'Dashboard description is required.',
    );
    this.nameMaxLengthError = page.getByText(
      `Dashboard name must be ${this.maxDashboardNameLength} characters or less.`,
    );
    this.descriptionMaxLengthError = page.getByText(
      `Dashboard description must be ${this.maxDashboardDescriptionLength} characters or less`,
    );
  }

  async goto() {
    await this.page.goto('dashboards/create');
  }

  public async expectIsCurrentPage() {
    await expect(this.page).toHaveURL(this.url);
    await expect(this.heading).toBeVisible();
  }

  public async expectIsNotCurrentPage() {
    await expect(this.page).not.toHaveURL(this.url);
    await expect(this.heading).toBeHidden();
  }
}
