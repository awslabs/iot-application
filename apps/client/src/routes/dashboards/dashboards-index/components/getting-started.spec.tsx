import { render, screen } from '~/helpers/tests/testing-library';

import GettingStarted from './getting-started';

describe('getting started', () => {
  test('updated getting started sections description', () => {
    render(<GettingStarted />);

    expect(
      screen.getByText(
        'Create a dashboard in AWS IoT SiteWise Monitor. The dashboard provides a shared view of asset properties.',
      ),
    ).toBeVisible();
    expect(
      screen.getByText('Drag the desired widgets to the dashboard.'),
    ).toBeVisible();
    expect(
      screen.getByText('Add asset properties to your dashboard.'),
    ).toBeVisible();
  });
});
