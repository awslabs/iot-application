import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import renderRouter from '../testing/routes';

it('renders', () => {
  renderRouter('/dashboards/123');

  expect(screen.getByRole('heading')).toHaveTextContent(
    'dashboard view for 123',
  );
});

it('navigates to dashboard list', async () => {
  const user = userEvent.setup();
  renderRouter('/dashboards/123');

  await user.click(screen.getByText('Dashboard list'));

  expect(screen.getByRole('heading')).toHaveTextContent('Dashboards');
});
