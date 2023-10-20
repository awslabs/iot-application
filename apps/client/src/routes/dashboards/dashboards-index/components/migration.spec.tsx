import { render, screen } from '~/helpers/tests/testing-library';

import Migration from './migration';

describe('Migration', () => {
  test('Migration form loads', () => {
    render(<Migration />);

    expect(screen.getByText('Dashboard migration')).toBeVisible();
  });
});
