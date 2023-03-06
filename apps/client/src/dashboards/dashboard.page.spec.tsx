import { screen } from '@testing-library/react';
import { renderWithRouter } from '../test/render-with-router';

describe('<DashboardPage />', () => {
  test('as a user, I want to view my dashboard', () => {
    const dashboardId = '123';
    renderWithRouter(`/dashboards/${dashboardId}`);

    expect(screen.getByRole('heading')).toHaveTextContent(
      'dashboard view for 123',
    );
  });
});
