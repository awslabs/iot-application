import { expect } from '@playwright/test';
import type { Page, Locator } from '@playwright/test';

export class DashboardPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(dashboardId: string) {
    await this.page.goto(`dashboards/${dashboardId}`);
  }
}
