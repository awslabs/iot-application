import { Features, featureEnabled } from './featureFlag';

describe('featureFlag', () => {
  test('Migration feature is disabled', () => {
    const isMigrationEnabled = featureEnabled(Features.MIGRATION);
    expect(isMigrationEnabled).toEqual(false);
  });
});
