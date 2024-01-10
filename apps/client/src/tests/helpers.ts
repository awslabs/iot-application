import { Page, test as base } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { DashboardsIndexPage } from './pages/dashboards-index.page';
import { ApplicationFrame } from './pages/application-frame.page';
import { CreateDashboardPage } from './pages/create-dashboard.page';
import {
  type Dashboard,
  type CreateDashboardDto,
  type BulkDeleteDashboardDto,
} from '~/services';

interface Fixtures {
  makeAxeBuilder(): AxeBuilder;
  createDashboard({
    name,
    description,
    definition,
  }: CreateDashboardDto): Promise<Dashboard>;
  deleteDashboards({ ids }: BulkDeleteDashboardDto): Promise<void>;
  applicationFrame: ApplicationFrame;
  createDashboardPage: CreateDashboardPage;
  dashboardListPage: DashboardsIndexPage;
  dashboardListPageWithDashboards: {
    dashboardListPage: DashboardsIndexPage;
    dashboard1: Dashboard;
    dashboard2: Dashboard;
  };
}

export const test = base.extend<Fixtures>({
  makeAxeBuilder: async ({ page }, use) => {
    function makeAxeBuilder() {
      const axeBuilder = new AxeBuilder({ page }).withTags([
        'wcag2a',
        'wcag2aa',
        'wcag21a',
        'wcag21aa',
        'wcag22a',
        'wcag22aa',
        'best-practice',
      ]);

      return axeBuilder;
    }

    await use(makeAxeBuilder);
  },
  createDashboard: async ({ page }, use) => {
    const createDashboard = createCreateDashboard(page);

    await use(createDashboard);
  },
  deleteDashboards: async ({ page }, use) => {
    const deleteDashboards = createDeleteDashboards(page);

    await use(deleteDashboards);
  },
  applicationFrame: async ({ page }, use) => {
    const applicationFrame = new ApplicationFrame(page);

    await use(applicationFrame);
  },
  createDashboardPage: async ({ page }, use) => {
    const createDashboardPage = new CreateDashboardPage(page);

    await createDashboardPage.goto();

    await use(createDashboardPage);
  },
  dashboardListPage: async ({ page }, use) => {
    const dashboardListPage = new DashboardsIndexPage(page);

    await dashboardListPage.goto();

    await use(dashboardListPage);
  },
  dashboardListPageWithDashboards: async ({ page }, use) => {
    const dashboardListPage = new DashboardsIndexPage(page);
    const createDashboard = createCreateDashboard(page);
    const deleteDashboards = createDeleteDashboards(page);

    const dashboard1 = await createDashboard({
      name: 'test dashboard name 1',
      description: 'test dashboard description 1',
      definition: {
        widgets: [],
      },
    });

    const dashboard2 = await createDashboard({
      name: 'test dashboard name 2',
      description: 'test dashboard description 2',
      definition: {
        widgets: [],
      },
    });

    await dashboardListPage.goto();

    await use({
      dashboardListPage,
      dashboard1,
      dashboard2,
    });

    await deleteDashboards({ ids: [dashboard1.id, dashboard2.id] });
  },
});

export { expect } from '@playwright/test';

// TODO: Reuse generated service (not immediately possible due to Amplify lifecycle - token not set)
function createCreateDashboard(page: Page) {
  return async function createDashboard({
    name,
    description,
    definition,
  }: CreateDashboardDto) {
    const headersWithAuthorization = await createHeadersWithAuthorization(page);

    const response = await page.request.post('/api/dashboards', {
      headers: {
        ...headersWithAuthorization,
      },
      data: {
        name,
        description,
        definition,
      },
    });

    const dashboard = (await response.json()) as unknown as Dashboard;

    return dashboard;
  };
}

// TODO: Reuse generated service (not immediately possible due to Amplify lifecycle - token not set)
function createDeleteDashboards(page: Page) {
  return async function deleteDashboards({ ids }: BulkDeleteDashboardDto) {
    const headersWithAuthorization = await createHeadersWithAuthorization(page);

    await page.request.delete(`/api/dashboards/bulk`, {
      headers: {
        ...headersWithAuthorization,
      },
      data: {
        ids,
      },
    });
  };
}

type AccessibilityScanResults = Awaited<ReturnType<AxeBuilder['analyze']>>;

// https://playwright.dev/docs/accessibility-testing#using-snapshots-to-allow-specific-known-issues
export function violationFingerprints(
  accessibilityScanResults: AccessibilityScanResults,
) {
  const violationFingerprints = accessibilityScanResults.violations.map(
    (violation) => ({
      rule: violation.id,
      // These are CSS selectors which uniquely identify each element with
      // a violation of the rule in question.
      targets: violation.nodes.map((node) => node.target),
    }),
  );

  return JSON.stringify(violationFingerprints, null, 2);
}

async function createHeadersWithAuthorization(page: Page) {
  const accessToken = await getAccessToken(page);
  const headersWithAuthorization = {
    authorization: `Bearer ${accessToken ?? ''}`,
  };

  return headersWithAuthorization;
}

async function getAccessToken(page: Page): Promise<string | undefined> {
  const storageState = await page.context().storageState();
  const accessToken = storageState.origins[0]?.localStorage.find(({ name }) =>
    name.includes('accessToken'),
  )?.value;

  return accessToken;
}
