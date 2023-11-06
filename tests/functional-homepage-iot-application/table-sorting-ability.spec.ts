import { test, expect } from '@playwright/test';
import {
  DashboardsIndexPage,
  DashboardsTable,
} from '../pages/dashboards-index.page';
import { ApplicationFrame } from '../pages/application-frame.page';
import { createDashboard } from '../pages/create.page';
import { deleteFirstRow } from '../pages/delete.page';
import { randomUUID } from 'crypto';

test.describe('Homepage For IoT Application - Verify Sorting Ability', () => {
  //Positive scenario - Verify table sorting ability for ID column header
  test(' verify table sorting ability in dashboard table for id column headers', async ({
    page,
  }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const application = new ApplicationFrame(page);
    const dashboardsTable = new DashboardsTable(page);

    // Introduce uniqueness to isolate test runs
    const dashboardDescription = `My dashboard description ${randomUUID()}`;

    await dashboardsPage.goto();
    await dashboardsPage.expectIsCurrentPage();

    // Create three dashboards
    for (let i = 0; i < 3; i++) {
      await createDashboard(page, dashboardDescription);
      await expect(application.notification).toContainText(
        'Successfully created dashboard "My Dashboard".',
      );
    }

    // Navigate to dashboards page
    await dashboardsPage.goto();

    // Test ascending sorting
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.idColumnHeader,
      'ascending',
    );
    // Verify the ascending sort state
    const ascendingSort =
      await dashboardsTable.idColumnHeader.getAttribute('aria-sort');
    // Assert that the data is sorted in ascending
    expect(ascendingSort).toBe('ascending');

    // Test descending sort
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.idColumnHeader,
      'descending',
    );
    // Verify the descending sort
    const descendingSort =
      await dashboardsTable.idColumnHeader.getAttribute('aria-sort');
    // Assert that the data is sorted in descending
    expect(descendingSort).toBe('descending');
  });

  //Positive scenario - Verify Table Sorting Ability For Name Column Header
  test(' verify table sorting ability in dashboard table for name column headers', async ({
    page,
  }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const dashboardsTable = new DashboardsTable(page);

    // Navigate to dashboards page
    await dashboardsPage.goto();

    // Test ascending sorting
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.nameColumnHeader,
      'ascending',
    );
    // Verify the ascending sort state
    const ascendingSort =
      await dashboardsTable.nameColumnHeader.getAttribute('aria-sort');
    // Assert that the data is sorted in ascending
    expect(ascendingSort).toBe('ascending');

    // Test descending sort
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.nameColumnHeader,
      'descending',
    );
    // Verift the descending sort
    const descendingSort =
      await dashboardsTable.nameColumnHeader.getAttribute('aria-sort');
    // Assert that the data is sorted in descending
    expect(descendingSort).toBe('descending');
  });

  //Positive scenario - Verify Table Sorting Ability For Description Column Header
  test(' verify table sorting ability in dashboard table for description column headers', async ({
    page,
  }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const dashboardsTable = new DashboardsTable(page);

    // Navigate to dashboards page
    await dashboardsPage.goto();

    // Test ascending sorting
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.descriptionColumnHeader,
      'ascending',
    );
    // Verify the ascending sort state
    const ascendingSort =
      await dashboardsTable.descriptionColumnHeader.getAttribute('aria-sort');
    // Assert that the data is sorted in ascending
    expect(ascendingSort).toBe('ascending');

    // Test descending sort
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.descriptionColumnHeader,
      'descending',
    );
    // Verift the descending sort
    const descendingSort =
      await dashboardsTable.descriptionColumnHeader.getAttribute('aria-sort');
    // Assert that the data is sorted in descending
    expect(descendingSort).toBe('descending');
  });

  //Positive scenario - Verify Table Sorting Ability For Date Created Column Header
  test(' verify table sorting ability in dashboard table for date created column headers', async ({
    page,
  }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const dashboardsTable = new DashboardsTable(page);

    // Navigate to dashboards page
    await dashboardsPage.goto();

    // Test ascending sorting
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.dateCreatedColumnHeader,
      'ascending',
    );
    // Verify the ascending sort state
    const ascendingSort =
      await dashboardsTable.dateCreatedColumnHeader.getAttribute('aria-sort');
    // Assert that the data is sorted in ascending
    expect(ascendingSort).toBe('ascending');

    // Test descending sort
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.dateCreatedColumnHeader,
      'descending',
    );
    // Verift the descending sort
    const descendingSort =
      await dashboardsTable.dateCreatedColumnHeader.getAttribute('aria-sort');
    // Assert that the data is sorted in descending
    expect(descendingSort).toBe('descending');
  });

  //Positive scenario - Verify Table Sorting Ability For Date Modified Column Header
  test(' verify table sorting ability in dashboard table for date modified column headers', async ({
    page,
  }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const dashboardsTable = new DashboardsTable(page);

    // Navigate to dashboards page
    await dashboardsPage.goto();

    // Test ascending sorting
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.dateModifiedColumnHeader,
      'ascending',
    );
    // Verify the ascending sort state
    const ascendingSort =
      await dashboardsTable.dateModifiedColumnHeader.getAttribute('aria-sort');
    // Assert that the data is sorted in ascending
    expect(ascendingSort).toBe('ascending');

    // Test descending sort
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.dateModifiedColumnHeader,
      'descending',
    );
    // Verift the descending sort
    const descendingSort =
      await dashboardsTable.dateModifiedColumnHeader.getAttribute('aria-sort');
    // Assert that the data is sorted in descending
    expect(descendingSort).toBe('descending');
  });

  // Negative scenario - Special Characters Sorting
  test('verify sorting special characters in ID column', async ({ page }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const dashboardsTable = new DashboardsTable(page);

    // Navigate to dashboards page
    await dashboardsPage.goto();

    // Test ascending sorting on the ID column with special characters
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.idColumnHeader,
      'ascending',
    );

    // Verify the ascending sort state
    const ascendingSort =
      await dashboardsTable.idColumnHeader.getAttribute('aria-sort');
    expect(ascendingSort).toBe('ascending');

    // Test descending sorting on the ID column with special characters
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.idColumnHeader,
      'descending',
    );

    // Verify the descending sort state
    const descendingSort =
      await dashboardsTable.idColumnHeader.getAttribute('aria-sort');
    expect(descendingSort).toBe('descending');
  });

  // Negative Scenario: Mixed Sorting Order for ID column header
  test('mixed sorting order for id column header', async ({ page }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const dashboardsTable = new DashboardsTable(page);

    // Navigate to dashboards page
    await dashboardsPage.goto();

    // Click on a column header to sort it in ascending order
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.idColumnHeader,
      'ascending',
    );

    // Click on the same column header again
    await dashboardsTable.idColumnHeader.click();

    // Ensure it toggles to descending sorting
    const descendingSort =
      await dashboardsTable.idColumnHeader.getAttribute('aria-sort');
    expect(descendingSort).toBe('descending');
  });

  // Negative Scenario: Mixed Sorting Order for Name column header
  test('mixed sorting order for name column header', async ({ page }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const dashboardsTable = new DashboardsTable(page);

    // Navigate to dashboards page
    await dashboardsPage.goto();

    // Click on a column header to sort it in ascending order
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.nameColumnHeader,
      'ascending',
    );

    // Click on the same column header again
    await dashboardsTable.nameColumnHeader.click();

    // Ensure it toggles to descending sorting
    const descendingSort =
      await dashboardsTable.nameColumnHeader.getAttribute('aria-sort');
    expect(descendingSort).toBe('descending');
  });

  // Negative Scenario: Mixed Sorting Order for Description column header
  test('mixed sorting order for description column header', async ({
    page,
  }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const dashboardsTable = new DashboardsTable(page);

    // Navigate to dashboards page
    await dashboardsPage.goto();

    // Click on a column header to sort it in ascending order
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.descriptionColumnHeader,
      'ascending',
    );

    // Click on the same column header again
    await dashboardsTable.descriptionColumnHeader.click();

    // Ensure it toggles to descending sorting
    const descendingSort =
      await dashboardsTable.descriptionColumnHeader.getAttribute('aria-sort');
    expect(descendingSort).toBe('descending');
  });

  // Negative Scenario: Mixed Sorting Order for date created column header
  test('mixed sorting order for date created column header', async ({
    page,
  }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const dashboardsTable = new DashboardsTable(page);

    // Navigate to dashboards page
    await dashboardsPage.goto();

    // Click on a column header to sort it in ascending order
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.dateCreatedColumnHeader,
      'ascending',
    );

    // Click on the same column header again
    await dashboardsTable.dateCreatedColumnHeader.click();

    // Ensure it toggles to descending sorting
    const descendingSort =
      await dashboardsTable.dateCreatedColumnHeader.getAttribute('aria-sort');
    expect(descendingSort).toBe('descending');
  });

  // Negative Scenario: Mixed Sorting Order for Date modified column header
  test('mixed sorting order for date modified column header', async ({
    page,
  }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const dashboardsTable = new DashboardsTable(page);

    // Navigate to dashboards page
    await dashboardsPage.goto();

    // Click on a column header to sort it in ascending order
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.dateModifiedColumnHeader,
      'ascending',
    );

    // Click on the same column header again
    await dashboardsTable.dateModifiedColumnHeader.click();

    // Ensure it toggles to descending sorting
    const descendingSort =
      await dashboardsTable.dateModifiedColumnHeader.getAttribute('aria-sort');
    expect(descendingSort).toBe('descending');

    // Cleanup : Delete the created dashboards
    for (let i = 0; i < 3; i++) {
      await deleteFirstRow(page);
    }
  });

  // Negative scenario - Ascending sort should toggle to descending without data and viceversa for ID column header
  test('ascending sort should toggle to descending without data and viceversa for id column header', async ({
    page,
  }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const dashboardsTable = new DashboardsTable(page);

    // Navigate to dashboards page
    await dashboardsPage.goto();

    // Test ascending sorting
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.idColumnHeader,
      'ascending',
    );
    // Ensure that ascending sort state is applied
    const ascendingSort =
      await dashboardsTable.idColumnHeader.getAttribute('aria-sort');
    expect(ascendingSort).toBe('ascending');

    // Click on the column header again, expecting it to change to descending
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.idColumnHeader,
      'descending',
    );
    // Ensure that sorting state has changed to descending
    const descendingSort =
      await dashboardsTable.idColumnHeader.getAttribute('aria-sort');
    expect(descendingSort).toBe('descending');

    // Click on the column header again, expecting it to change to ascending
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.idColumnHeader,
      'ascending',
    );
    // Ensure that sorting state has changed to ascending
    await dashboardsTable.idColumnHeader.getAttribute('aria-sort');
    expect(ascendingSort).toBe('ascending');
  });

  // Negative scenario - Ascending sort should toggle to descending without data and viceversa for Name column header
  test('ascending sort should toggle to descending without data and viceversa for name column header', async ({
    page,
  }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const dashboardsTable = new DashboardsTable(page);

    // Navigate to dashboards page
    await dashboardsPage.goto();

    // Test ascending sorting
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.nameColumnHeader,
      'ascending',
    );
    // Ensure that ascending sort state is applied
    const ascendingSort =
      await dashboardsTable.nameColumnHeader.getAttribute('aria-sort');
    expect(ascendingSort).toBe('ascending');

    // Click on the column header again, expecting it to change to descending
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.nameColumnHeader,
      'descending',
    );
    // Ensure that sorting state has changed to descending
    const descendingSort =
      await dashboardsTable.nameColumnHeader.getAttribute('aria-sort');
    expect(descendingSort).toBe('descending');

    // Click on the column header again, expecting it to change to ascending
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.nameColumnHeader,
      'ascending',
    );
    // Ensure that sorting state has changed to ascending
    await dashboardsTable.nameColumnHeader.getAttribute('aria-sort');
    expect(ascendingSort).toBe('ascending');
  });

  // Negative scenario - Ascending sort should toggle to descending without data and viceversa for Description column header
  test('ascending sort should toggle to descending without data and viceversa for description column header', async ({
    page,
  }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const dashboardsTable = new DashboardsTable(page);

    // Navigate to dashboards page
    await dashboardsPage.goto();

    // Test ascending sorting
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.descriptionColumnHeader,
      'ascending',
    );
    // Ensure that ascending sort state is applied
    const ascendingSort =
      await dashboardsTable.descriptionColumnHeader.getAttribute('aria-sort');
    expect(ascendingSort).toBe('ascending');

    // Click on the column header again, expecting it to change to descending
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.descriptionColumnHeader,
      'descending',
    );
    // Ensure that sorting state has changed to descending
    const descendingSort =
      await dashboardsTable.descriptionColumnHeader.getAttribute('aria-sort');
    expect(descendingSort).toBe('descending');

    // Click on the column header again, expecting it to change to ascending
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.descriptionColumnHeader,
      'ascending',
    );
    // Ensure that sorting state has changed to ascending
    await dashboardsTable.descriptionColumnHeader.getAttribute('aria-sort');
    expect(ascendingSort).toBe('ascending');
  });

  // Negative scenario - Ascending sort should toggle to descending without data and viceversa for Date created column header
  test('ascending sort should toggle to descending without data and viceversa for date created column header', async ({
    page,
  }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const dashboardsTable = new DashboardsTable(page);

    // Navigate to dashboards page
    await dashboardsPage.goto();

    // Test ascending sorting
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.dateCreatedColumnHeader,
      'ascending',
    );
    // Ensure that ascending sort state is applied
    const ascendingSort =
      await dashboardsTable.dateCreatedColumnHeader.getAttribute('aria-sort');
    expect(ascendingSort).toBe('ascending');

    // Click on the column header again, expecting it to change to descending
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.dateCreatedColumnHeader,
      'descending',
    );
    // Ensure that sorting state has changed to descending
    const descendingSort =
      await dashboardsTable.dateCreatedColumnHeader.getAttribute('aria-sort');
    expect(descendingSort).toBe('descending');

    // Click on the column header again, expecting it to change to ascending
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.dateCreatedColumnHeader,
      'ascending',
    );
    // Ensure that sorting state has changed to ascending
    await dashboardsTable.dateCreatedColumnHeader.getAttribute('aria-sort');
    expect(ascendingSort).toBe('ascending');
  });

  // Negative scenario - Ascending sort should toggle to descending without data and viceversa for Date modified column header
  test('ascending sort should toggle to descending without data and viceversa for date modified column header', async ({
    page,
  }) => {
    const dashboardsPage = new DashboardsIndexPage(page);
    const dashboardsTable = new DashboardsTable(page);

    // Navigate to dashboards page
    await dashboardsPage.goto();

    // Test ascending sorting
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.dateModifiedColumnHeader,
      'ascending',
    );
    // Ensure that ascending sort state is applied
    const ascendingSort =
      await dashboardsTable.dateModifiedColumnHeader.getAttribute('aria-sort');
    expect(ascendingSort).toBe('ascending');

    // Click on the column header again, expecting it to change to descending
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.dateModifiedColumnHeader,
      'descending',
    );
    // Ensure that sorting state has changed to descending
    const descendingSort =
      await dashboardsTable.dateModifiedColumnHeader.getAttribute('aria-sort');
    expect(descendingSort).toBe('descending');

    // Click on the column header again, expecting it to change to ascending
    await dashboardsTable.sortColumnAndCheck(
      dashboardsTable.dateModifiedColumnHeader,
      'ascending',
    );
    // Ensure that sorting state has changed to ascending
    await dashboardsTable.dateModifiedColumnHeader.getAttribute('aria-sort');
    expect(ascendingSort).toBe('ascending');
  });
});
