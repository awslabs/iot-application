import { it, expect } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import renderRouter  from '../testing/routes';

it('renders', async () => {
  renderRouter('/dashboards/123');

  expect(screen.getByRole('heading')).toHaveTextContent('dashboard view for 123');
});

it('navigates to dashboard list', async () => {
  renderRouter('/dashboards/123');

  fireEvent.click(screen.getByText('Dashboard list'));

  expect(screen.getByRole('heading')).toHaveTextContent('Dashboards');
});
