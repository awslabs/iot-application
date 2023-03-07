import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ROOT_ROUTE } from '../routes/root';

export const renderWithRouter = (route = '/') => {
  window.history.pushState({}, 'Test page', route);

  return {
    user: userEvent.setup(),
    ...render(<RouterProvider router={createBrowserRouter([ROOT_ROUTE])} />),
  };
};
