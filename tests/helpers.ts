import { test as base } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

interface AxeFixture {
  makeAxeBuilder(): AxeBuilder;
}

export const test = base.extend<AxeFixture>({
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
