import type { Page, Locator } from '@playwright/test';

export class ApplicationFrame {
  public readonly notification: Locator;
  public readonly dismissNotificationButton: Locator;

  constructor(page: Page) {
    this.notification = page
      .getByRole('region', { name: 'Notifications' })
      .getByRole('listitem');
    this.dismissNotificationButton = this.notification.getByRole('button', {
      name: 'Dismiss notification',
    });
  }
}

export class TopNavigation {
  public readonly navigationBar: Locator;
  public readonly homeLink: Locator;
  public readonly dropdownMenu: Locator;
  public readonly openDropdownButton: Locator;
  public readonly documentationLink: Locator;
  public readonly feedbackLink: Locator;

  constructor(page: Page) {
    this.navigationBar = page.getByRole('navigation', { exact: true });
    this.homeLink = this.navigationBar.getByRole('link', {
      name: 'IoT Application',
    });
    this.dropdownMenu = page.getByRole('menu');
    this.openDropdownButton = page.getByRole('button', { name: 'test-user' });
    this.documentationLink = page.getByRole('menuitem', {
      name: 'Documentation',
    });
    this.feedbackLink = page.getByRole('menuitem', { name: 'Feedback' });
  }
}

export class Breadcrumbs {
  public readonly breadcrumbs: Locator;
  public readonly homeLink: Locator;

  constructor(page: Page) {
    this.breadcrumbs = page.getByRole('navigation', { name: 'Breadcrumbs' });
    this.homeLink = this.breadcrumbs.getByRole('link', {
      name: 'IoT Application',
    });
  }
}
