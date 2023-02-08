import { screen } from '@testing-library/react';
import renderRouter from '../testing/routes';
import ErrorPage from './ErrorPage';

it('renders', () => {
  renderRouter('/non-resource', [
    {
      path: '/',
      element: <div>Test</div>,
      errorElement: <ErrorPage />,
    },
  ]);

  expect(screen.getByRole('heading')).toHaveTextContent('Oops!');
  expect(
    screen.getByText('Sorry, an unexpected error has occurred.'),
  ).toBeInTheDocument();
  expect(screen.getByText('Not Found')).toBeInTheDocument();
});
