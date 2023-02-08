import { expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import renderRouter  from '../testing/routes';
import ErrorPage from './ErrorPage';

it('renders', async () => {
  renderRouter('/non-resource', [
    {
      path: '/',
      element: <div>Test</div>,
      errorElement: <ErrorPage/>,
    }
  ]);

  expect(screen.getByRole('heading')).toHaveTextContent('Oops!');
  expect(screen.getByText('Sorry, an unexpected error has occurred.')).toBeInTheDocument();
  expect(screen.getByText('Not Found')).toBeInTheDocument();
});
