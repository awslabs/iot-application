import { screen, waitFor } from '@testing-library/react';
import renderRouter from '../testing/routes';
jest.mock('src/dashboards/dashboards.module', () => ({
  __esModule: true,
  DashboardsModule: jest.fn().mockImplementation(() => ({
    http: {
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
  renderRouter('/dashboards/123');

  await waitFor(() => {
    expect(screen.getByText('test name')).toBeVisible();
    expect(screen.getByText('test description')).toBeVisible();
  });
});
