import { expect } from '@playwright/test';
import type { Page, Locator } from '@playwright/test';

export class DeleteDashboardDialog {
  public readonly dialog: Locator;
  public readonly deleteButton: Locator;
  public readonly cancelButton: Locator;
  public readonly xButton: Locator;

  constructor(page: Page) {
    this.dialog = page.getByRole('dialog', { name: 'Delete dashboard' });
    this.deleteButton = this.dialog.getByRole('button', {
      name: /^Delete$/,
    });
    this.cancelButton = this.dialog.getByRole('button', { name: 'Cancel' });
    this.xButton = this.dialog.getByRole('button', {
      name: 'Close delete dialog',
    });
  }

  async expectIsVisible() {
    await expect(this.dialog).toBeVisible();
  }

  async expectIsNotVisible() {
    await expect(this.dialog).toBeHidden();
  }
}

export class PreferencesDialog {
  public readonly dialog: Locator;
  public readonly cancelButton: Locator;
  public readonly xButton: Locator;
  public readonly wrapLinesCheckbox: Locator;
  public readonly stripedRowsCheckbox: Locator;
  public readonly tenDashboardsPageSizeOption: Locator;
  public readonly twentyFiveDashboardsPageSizeOption: Locator;
  public readonly oneHundredDashboardsPageSizeOption: Locator;
  public readonly idVisibleContentCheckbox: Locator;
  public readonly nameVisibleContentCheckbox: Locator;
  public readonly descriptionVisibleContentCheckbox: Locator;
  public readonly lastUpdateDateVisibleContentCheckbox: Locator;
  public readonly creationDateVisibleContentCheckbox: Locator;

  constructor(page: Page) {
    this.dialog = page.getByRole('dialog');
    this.cancelButton = this.dialog
      .getByRole('button', { name: 'Cancel' })
      .filter({ hasText: 'Cancel' });
    this.xButton = this.dialog
      .getByRole('button', { name: 'Cancel' })
      .filter({ hasText: '' });

    this.wrapLinesCheckbox = this.dialog.getByRole('checkbox', {
      name: 'Wrap lines',
    });
    this.stripedRowsCheckbox = this.dialog.getByRole('checkbox', {
      name: 'Striped rows',
    });
    this.tenDashboardsPageSizeOption = this.dialog.getByRole('radio', {
      name: '10 dashboards',
    });
    this.twentyFiveDashboardsPageSizeOption = this.dialog.getByRole('radio', {
      name: '25 dashboards',
    });
    this.oneHundredDashboardsPageSizeOption = this.dialog.getByRole('radio', {
      name: '100 dashboards',
    });
    this.idVisibleContentCheckbox = this.dialog.getByRole('checkbox', {
      name: 'ID',
    });
    this.nameVisibleContentCheckbox = this.dialog.getByRole('checkbox', {
      name: 'Name',
    });
    this.descriptionVisibleContentCheckbox = this.dialog.getByRole('checkbox', {
      name: 'Description',
    });
    this.lastUpdateDateVisibleContentCheckbox = this.dialog.getByRole(
      'checkbox',
      { name: 'Last update date' },
    );
    this.creationDateVisibleContentCheckbox = this.dialog.getByRole(
      'checkbox',
      { name: 'Creation date' },
    );
  }

  public async expectIsVisible() {
    await expect(this.dialog).toBeVisible();
  }

  public async expectIsNotVisible() {
    await expect(this.dialog).toBeHidden();
  }
}

export class DashboardsTable {
  private page: Page;
  public readonly table: Locator;
  public readonly idColumnHeader: Locator;
  public readonly nameColumnHeader: Locator;
  public readonly descriptionColumnHeader: Locator;
  public readonly lastUpdateDateColumnHeader: Locator;
  public readonly creationDateColumnHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.table = page.getByRole('table');

    this.idColumnHeader = page.getByRole('columnheader', { name: 'ID' });
    this.nameColumnHeader = page.getByRole('columnheader', { name: 'Name' });
    this.descriptionColumnHeader = page.getByRole('columnheader', {
      name: 'Description',
    });
    this.lastUpdateDateColumnHeader = page.getByRole('columnheader', {
      name: 'Last update date',
    });
    this.creationDateColumnHeader = page.getByRole('columnheader', {
      name: 'Creation date',
    });
  }

  public getCell(name: string) {
    return this.page.getByRole('cell', { name });
  }

  public getRow(dashboard: { name: string; description: string }) {
    return this.page
      .getByRole('row')
      .filter({ has: this.getCell(dashboard.name) })
      .filter({ has: this.getCell(dashboard.description) })
      .nth(0);
  }
}

export class DashboardsIndexPage {
  public readonly page: Page;
  public readonly heading: Locator;
  public readonly preferencesButton: Locator;
  public readonly createButton: Locator;
  public readonly deleteButton: Locator;
  public readonly emptyCreateButton: Locator;
  public readonly dashboardFilter: Locator;

  private readonly url = 'dashboards';

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Dashboards' });
    this.preferencesButton = page.getByRole('button', { name: 'Preferences' });
    this.createButton = page.getByRole('button', {
      name: 'Create dashboard',
    });
    this.deleteButton = page.getByRole('button', { name: 'Delete' });
    this.emptyCreateButton = page.getByRole('button', {
      name: 'Create dashboard empty',
    });
    this.dashboardFilter = page.getByRole('form', {
      name: 'Filter dashboards',
    });
  }

  public async goto() {
    await this.page.goto(this.url);
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

// Adding Getting Started section
export class GettingStartedSection {
  public readonly gettingStartedButton: Locator;

  constructor(page: Page) {
    this.gettingStartedButton = page.getByRole('button', {
      name: 'Getting Started',
    });
  }

  public async expandGettingStarted() {
    await this.gettingStartedButton.click();
  }

  public async collapseGettingStarted() {
    await this.gettingStartedButton.click();
  }

  public async isExpanded() {
    const ariaExpandedValue =
      await this.gettingStartedButton.getAttribute('aria-expanded');
    return ariaExpandedValue === 'true';
  }
  public async isGettingStartedExpandable() {
    const expand =
      await this.gettingStartedButton.getAttribute('aria-expanded');
    return expand === 'false';
  }
}
