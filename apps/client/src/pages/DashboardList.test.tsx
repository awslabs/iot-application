import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import renderRouter from '../testing/routes';

it('renders', () => {
  renderRouter('/dashboards');

  expect(screen.getByRole('heading')).toHaveTextContent('Dashboards');

  expect(screen.getAllByRole('link')[0]).toHaveTextContent('Dashboard 1');
});

it('navigates to dashboard view', async () => {
  renderRouter('/dashboards');

  const user = userEvent.setup();

  await user.click(screen.getByText('Dashboard 1'));

  expect(screen.getByRole('heading')).toHaveTextContent(
    'dashboard view for 56c53d6e-a599-11ed-afa1-0242ac120002',
  );
});
