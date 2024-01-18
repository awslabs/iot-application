import { expect, test } from './helpers';

test.describe('dashboard page', () => {
  test('page', async ({ dashboardPage }) => {
    await dashboardPage.expectIsCurrentPage();

    // Temporary to silence ESLint
    expect(true).toBe(true);
  });
});
