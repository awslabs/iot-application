import { screen } from '@testing-library/react';

import { renderWithRouter } from '../test/render-with-router';

describe('<LoginForm />', () => {
  test('as a user, I want to login to my application', () => {
    renderWithRouter('/login');

    expect(screen.getByRole('heading')).toHaveTextContent('Login');
  });
});
