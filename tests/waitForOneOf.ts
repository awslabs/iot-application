import { Locator } from '@playwright/test';

type WaitForRes = [locatorIndex: number, locator: Locator];

// taken from https://stackoverflow.com/questions/74403845/conditionally-wait-for-locators-in-playwright
export async function waitForOneOf(locators: Locator[]): Promise<WaitForRes> {
  const res = await Promise.race([
    ...locators.map(async (locator, index): Promise<WaitForRes> => {
      let timedOut = false;
      await locator
        .waitFor({ state: 'visible' })
        .catch(() => (timedOut = true));
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      return [timedOut ? -1 : index, locator];
    }),
  ]);
  if (res[0] === -1) {
    throw new Error('no locator visible before timeout');
  }
  return res;
}
