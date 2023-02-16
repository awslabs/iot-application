import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderRouter from '../testing/routes';
jest.mock('src/dashboards/dashboards.module', () => ({
  __esModule: true,
  DashboardsModule: jest.fn().mockImplementation(() => ({
    http: {
      list: jest.fn().mockResolvedValue([
        {
          id: '123',
          name: 'test name',
          description: 'test description',
          definition: {
            widgets: [],
          },
        },
      ]),
      read: jest.fn().mockResolvedValue({
        id: '123',
        name: 'test name',
        description: 'test description',
        definition: {
          widgets: [],
        },
      }),
    },
  })),
}));

it('renders', async () => {
  renderRouter('/dashboards');

  await waitFor(() => {
    expect(screen.getAllByRole('link')[0]).toHaveTextContent('test name');
  });
});

it('navigates to dashboard view', async () => {
  renderRouter('/dashboards');

  const user = userEvent.setup();

  await waitFor(() => {
    expect(screen.getAllByRole('link')[0]).toHaveTextContent('test name');
  });

  await user.click(screen.getByText('test name'));

  await waitFor(() => {
    expect(screen.getByText('test name')).toBeVisible();
    expect(screen.getByText('test description')).toBeVisible();
  });
});
