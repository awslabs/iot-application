import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

import { Page } from './page';
import { PageCrumb } from '../breadcrumbs/page-crumb.type';
import { NonEmptyList } from '../types/non-empty-list';

const MockContent = () => <div>Content</div>;
const mockCrumbs: NonEmptyList<PageCrumb> = [{ text: 'Home', href: '/' }];

describe('<Page />', () => {
  describe('Navigation visibility', () => {
    test('as a user, I want the navigation initially closed', () => {
      render(
        <Page
          content={<MockContent />}
          crumbs={mockCrumbs}
          pageType="default"
          location="/"
          setLocation={jest.fn()}
        />,
        {
          wrapper: BrowserRouter,
        },
      );

      expect(
        screen.getByRole('button', { name: 'Open navigation' }),
      ).toBeVisible();
      expect(
        screen.queryByRole('button', { name: 'Close navigation' }),
      ).not.toBeInTheDocument();
    });

    test('as a user, I want to open the navigation', async () => {
      render(
        <Page
          content={<MockContent />}
          crumbs={mockCrumbs}
          pageType="default"
          location="/"
          setLocation={jest.fn()}
        />,
        {
          wrapper: BrowserRouter,
        },
      );
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: 'Open navigation' }));

      expect(
        screen.getByRole('button', { name: 'Close navigation' }),
      ).toBeVisible();
      expect(
        screen.queryByRole('button', { name: 'Open navigation' }),
      ).not.toBeInTheDocument();
    });

    test('as a user, I want to close the navigation', async () => {
      render(
        <Page
          content={<MockContent />}
          crumbs={mockCrumbs}
          pageType="default"
          location="/"
          setLocation={jest.fn()}
        />,
        {
          wrapper: BrowserRouter,
        },
      );
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: 'Open navigation' }));
      await user.click(
        screen.getByRole('button', { name: 'Close navigation' }),
      );

      expect(
        screen.getByRole('button', { name: 'Open navigation' }),
      ).toBeVisible();
      expect(
        screen.queryByRole('button', { name: 'Close navigation' }),
      ).not.toBeInTheDocument();
    });
  });
});
