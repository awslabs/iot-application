import { expect } from '@playwright/test';
import type { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Home' });
  }

  async goto() {
    await this.page.goto('');
  }

  async expectIsCurrentPage() {
    await expect(this.page).toHaveURL('/');
    await expect(this.heading).toBeVisible();
  }

  async expectIsNotCurrentPage() {
    await expect(this.page).not.toHaveURL('/');
    await expect(this.heading).toBeHidden();
  }
}
