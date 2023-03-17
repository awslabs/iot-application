import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ROUTES } from '../router/routes';

/**
 * @see {@link https://testing-library.com/docs/example-react-router | react-router}
 * @see {@link https://testing-library.com/docs/example-react-intl/ | react-intl}
 */
export const renderWithRouter = (route = '/') => {
  window.history.pushState({}, 'Test page', route);

  return {
    user: userEvent.setup(),
    ...render(
      <IntlProvider locale="en">
        <RouterProvider router={createBrowserRouter(ROUTES)} />
      </IntlProvider>,
    ),
  };
};
