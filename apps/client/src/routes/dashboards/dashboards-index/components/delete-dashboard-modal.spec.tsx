import { vi } from 'vitest';
import { render, screen } from '~/helpers/tests/testing-library';
import userEvent from '@testing-library/user-event';

import { DeleteDashboardModal } from './delete-dashboard-modal';
import type { DeleteDashboardModalProps } from './delete-dashboard-modal';

const mockDelete = vi.fn();
vi.mock('../hooks/use-delete-dashboard-mutation', () => ({
  useDeleteDashboardMutation: () => ({
    mutate: mockDelete,
  }),
}));

const getDeleteButton = () =>
  screen.getByRole('button', { name: 'Delete dashboard' });
const getConsentInput = () =>
  screen.getByLabelText(/^To confirm this deletion/);

describe('DeleteDashboardModal', () => {
  const defaultProps = {
    dashboards: [
      {
        id: '1',
        name: 'Dashboard 1',
        description: 'description',
        lastUpdateDate: new Date('2000-01-01').toLocaleDateString(),
        creationDate: new Date('2000-01-01').toLocaleDateString(),
      },
    ],
    isVisible: true,
    onClose: vi.fn(),
  } as const satisfies DeleteDashboardModalProps;

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('single dashboard', () => {
    test('delete button is enabled with consent given', async () => {
      render(<DeleteDashboardModal {...defaultProps} />);
      const user = userEvent.setup();

      await user.type(getConsentInput(), 'confirm');
      expect(getConsentInput()).toBeEnabled();
      await user.click(getDeleteButton());
      expect(mockDelete).toHaveBeenCalledWith(
        {
          ids: [defaultProps.dashboards[0].id],
        },
        expect.anything(),
      );
    });
  });

  describe('multiple dashboards', () => {
    const multipleDashboardsProps = {
      ...defaultProps,
      dashboards: [
        ...defaultProps.dashboards,
        {
          id: '2',
          name: 'Dashboard 2',
          description: 'description',
          lastUpdateDate: new Date('2000-01-01').toLocaleDateString(),
          creationDate: new Date('2000-01-01').toLocaleDateString(),
        },
      ],
    } as const satisfies DeleteDashboardModalProps;

    test('delete button is enabled with consent given', async () => {
      render(<DeleteDashboardModal {...multipleDashboardsProps} />);
      const user = userEvent.setup();

      await user.type(getConsentInput(), 'confirm');
      expect(getConsentInput()).toBeEnabled();
      await user.click(getDeleteButton());
      expect(mockDelete).toHaveBeenCalledWith(
        {
          ids: multipleDashboardsProps.dashboards.map(
            (dashboard) => dashboard.id,
          ),
        },
        expect.anything(),
      );
    });
  });

  describe('invalid consent', () => {
    test('delete button is disabled without consent given', async () => {
      render(<DeleteDashboardModal {...defaultProps} />);
      const user = userEvent.setup();

      expect(getDeleteButton()).toBeDisabled();
      await user.click(getDeleteButton());
      expect(mockDelete).not.toHaveBeenCalled();
    });

    test('delete button is disabled with consent is removed', async () => {
      render(<DeleteDashboardModal {...defaultProps} />);
      const user = userEvent.setup();

      await user.type(getConsentInput(), 'confirm');
      await user.clear(getConsentInput());
      expect(getDeleteButton()).toBeDisabled();
      await user.click(getDeleteButton());
      expect(mockDelete).not.toHaveBeenCalled();
    });

    test('delete button is disabled when consent text is incorrect', async () => {
      render(<DeleteDashboardModal {...defaultProps} />);
      const user = userEvent.setup();

      await user.type(getConsentInput(), 'incorrect');
      expect(getDeleteButton()).toBeDisabled();
      await user.click(getDeleteButton());
      expect(mockDelete).not.toHaveBeenCalled();
    });

    test('delete button is disabled when consent text is incomplete', async () => {
      render(<DeleteDashboardModal {...defaultProps} />);
      const user = userEvent.setup();

      await user.type(getConsentInput(), 'conf');
      expect(getDeleteButton()).toBeDisabled();
      await user.click(getDeleteButton());
      expect(mockDelete).not.toHaveBeenCalled();
    });
  });
});
