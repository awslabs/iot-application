import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ROUTES } from '../router/routes';

export const renderWithRouter = (route = '/') => {
  window.history.pushState({}, 'Test page', route);

  return {
    user: userEvent.setup(),
    ...render(<RouterProvider router={createBrowserRouter(ROUTES)} />),
  };
};
