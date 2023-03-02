import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Navigation } from './navigation';

describe('<Navigation />', () => {
  describe('location', () => {
    test('as a user, I want to see home selected when I am viewing home', () => {
      render(<Navigation location="/" setLocation={jest.fn()} />);

      expect(screen.getByRole('link', { current: 'page' })).toHaveTextContent(
        'IoT Application',
      );
    });

    test('as a user, I want to see dashboards selected when I am viewing my dashboards list', () => {
      render(<Navigation location="/dashboards" setLocation={jest.fn()} />);

      expect(screen.getByRole('link', { current: 'page' })).toHaveTextContent(
        'Dashboards',
      );
    });

    test('as a user, I do not want to see dashboards selected when I am viewing my dashboard', () => {
      render(<Navigation location="/dashboards/123" setLocation={jest.fn()} />);

      expect(
        screen.queryByRole('link', { current: 'page' }),
      ).not.toBeInTheDocument();
    });
  });

  describe('setLocation', () => {
    test('as a user, I want to navigate home', async () => {
      const setLocation = jest.fn();
      render(<Navigation location="/dashboards" setLocation={setLocation} />);
      const user = userEvent.setup();

      await user.click(screen.getByText('IoT Application'));

      expect(setLocation).toHaveBeenCalledWith('/');
    });

    test('as a user, I want to navigate home', async () => {
      const setLocation = jest.fn();
      render(<Navigation location="/" setLocation={setLocation} />);
      const user = userEvent.setup();

      await user.click(screen.getByText('Dashboards'));

      expect(setLocation).toHaveBeenCalledWith('/dashboards');
    });
  });
});
