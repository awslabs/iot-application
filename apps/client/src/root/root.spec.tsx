import { screen } from '@testing-library/react';
import { renderWithRouter } from '../test/render-with-router';

test('loads the application', () => {
  renderWithRouter('/');

  expect(screen.getByText('IoT Application')).toBeInTheDocument();
});
