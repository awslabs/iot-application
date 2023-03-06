import { screen } from '@testing-library/react';

import { renderWithRouter } from '../test/render-with-router';

describe('<DashboardListPage />', () => {
  test('as a user, I want to view a list of my dashboards', () => {
    renderWithRouter('/dashboards');

    expect(screen.getByRole('heading')).toHaveTextContent('Dashboards');
  });

  test('as a user, I want to navigate to my dashboard from my dashboard list', async () => {
    const { user } = renderWithRouter('/dashboards');

    await user.click(screen.getByText('Dashboard 1'));

    expect(screen.getByRole('heading')).toHaveTextContent(
      'dashboard view for 56c53d6e-a599-11ed-afa1-0242ac120002',
    );
  });
});
