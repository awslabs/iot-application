import { expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export async function accessibilityTest(page: Page) {
  //WCAG 2.1 AA Acceesibility test
  //Create the AxeBuilder object with specified tags
  await page.waitForLoadState('load');
  const axeBuilder = new AxeBuilder({ page }).withTags([
    'wcag2a',
    'wcag2aa',
    'wcag21a',
    'wcag21aa',
  ]);

  //Run the accessibility scan
  const accessibility = await axeBuilder.analyze();

  //No. of violations occured length
  //Once ES lint rules are updated can use console.log
  /*
  console.log(
    'WCAG 2.1 AA - Accessibility Violations : ',
    acc.violations.length,
  );
  // To view Attachments link in the Error Report and giving Passed in terminal
  const violations = acc.violations;
  console.log(`Total violations: ${violations.length}`);
  // Iterate through violations and inspect affected elements
  for (const violation of acc.violations) {
    console.log(`Violation: ${violation.description}`);
    for (const node of violation.nodes) {
      console.log(`Affected Node: ${node.html}`);
    }
  }
*/
  //Verifies that there are no accessibility violations. If find issues reports them in terminal
  expect(accessibility.violations).toEqual([]);
}
