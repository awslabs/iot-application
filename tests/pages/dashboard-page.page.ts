import { type Page, type Locator } from '@playwright/test';
import { expect, type Dashboard } from '../helpers';

export class DashboardPage {
  readonly #page: Page;
  readonly #dashboard: Dashboard;
  public readonly heading: Locator;

  constructor({ page, dashboard }: { page: Page; dashboard: Dashboard }) {
    this.#page = page;
    this.#dashboard = dashboard;
    this.heading = page.getByRole('heading', { name: dashboard.name });
  }

  public async goto() {
    await this.#page.goto(`dashboards/${this.#dashboard.id}`);
  }

  public async expectIsCurrentPage() {
    await expect(this.#page).toHaveURL(`dashboards/${this.#dashboard.id}`);
    await expect(this.heading).toBeVisible();
  }
}
