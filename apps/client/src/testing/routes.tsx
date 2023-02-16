import { render } from '@testing-library/react';
import {
  createMemoryRouter,
  RouterProvider,
  RouteObject,
} from 'react-router-dom';
import routes from '../routes/routes';

const renderRouter = (route: string, routesOverride?: RouteObject[]) => {
  const router = createMemoryRouter(routesOverride ?? routes, {
    initialEntries: [route],
  });

  const { container } = render(<RouterProvider router={router} />);

  return { container, router };
};

export default renderRouter;
