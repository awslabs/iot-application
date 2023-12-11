import { featureEnabled } from './featureFlag';

describe('featureFlag', () => {
  test('Migration feature is disabled', () => {
    const isMigrationEnabled = featureEnabled('Migration');
    expect(isMigrationEnabled).toEqual(false);
  });
});
