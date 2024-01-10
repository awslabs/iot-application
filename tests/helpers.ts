import { Page, test as base } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// TODO: Use type from core
interface CreateDashboardDto {
  name: string;
  description: string;
  definition: unknown;
}

// TODO: Use type from core
interface Dashboard {
  id: string;
  name: string;
  description: string;
  definition: unknown;
}

interface DeleteDashboardsDto {
  ids: string[];
}

interface Fixtures {
  makeAxeBuilder(): AxeBuilder;
  createDashboard({
    name,
    description,
    definition,
  }: CreateDashboardDto): Promise<Dashboard>;
  deleteDashboards({ ids }: DeleteDashboardsDto): Promise<void>;
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
    async function createDashboard({
      name,
      description,
      definition,
    }: CreateDashboardDto) {
      const headersWithAuthorization =
        await createHeadersWithAuthorization(page);

      const response = await page.request.post(
        'http://localhost:3000/api/dashboards',
        {
          headers: {
            ...headersWithAuthorization,
          },
          data: {
            name,
            description,
            definition,
          },
        },
      );

      const dashboard = (await response.json()) as unknown as Dashboard;

      return dashboard;
    }

    await use(createDashboard);
  },
  deleteDashboards: async ({ page }, use) => {
    async function deleteDashboards({ ids }: DeleteDashboardsDto) {
      const headersWithAuthorization =
        await createHeadersWithAuthorization(page);

      await page.request.delete(`http://localhost:3000/api/dashboards/bulk`, {
        headers: {
          ...headersWithAuthorization,
        },
        data: {
          ids,
        },
      });
    }

    await use(deleteDashboards);
  },
});

export { expect } from '@playwright/test';

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
