import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Breadcrumbs } from './breadcrumbs';

describe('<Breadcrumbs />', () => {
  describe('rendering', () => {
    test('as a user, I want to see a single breadcrumb when at home', () => {
      render(
        <Breadcrumbs
          crumbs={[{ text: 'Home', href: '/' }]}
          setLocation={jest.fn()}
        />,
      );

      expect(screen.getByText('Home')).toBeVisible();
    });

    test('as a user, I want to see multiple breadcrumbs to my current page', () => {
      render(
        <Breadcrumbs
          crumbs={[
            { text: 'Home', href: '/' },
            { text: 'Dashboards', href: '/dashboards' },
            { text: 'Dashboard Name', href: 'no-op' },
          ]}
          setLocation={jest.fn()}
        />,
      );

      expect(screen.getByText('Home')).toBeVisible();
      expect(screen.getByText('Dashboards')).toBeVisible();
      expect(screen.getByText('Dashboard Name')).toBeVisible();
    });
  });

  describe('navigation', () => {
    test('as a user, I want to navigate using breadcrumbs', async () => {
      const setLocation = jest.fn();
      render(
        <Breadcrumbs
          crumbs={[
            { text: 'Home', href: '/' },
            { text: 'Dashboards', href: '/dashboards' },
            { text: 'Dashboard Name', href: 'no-op' },
          ]}
          setLocation={setLocation}
        />,
      );
      const user = userEvent.setup();

      await user.click(screen.getByText('Dashboards'));

      expect(setLocation).toHaveBeenCalledWith('/dashboards');
    });

    test('as a user, I do not want the final breadcrumb to be a link', async () => {
      const setLocation = jest.fn();
      render(
        <Breadcrumbs
          crumbs={[
            { text: 'Home', href: '/' },
            { text: 'Dashboards', href: '/dashboards' },
            { text: 'Dashboard Name', href: 'no-op' },
          ]}
          setLocation={setLocation}
        />,
      );
      const user = userEvent.setup();

      await user.click(screen.getByText('Dashboard Name'));

      expect(setLocation).not.toHaveBeenCalled();
    });
  });
});
