import { render, screen } from '@testing-library/react';

import App from './App';

test('loads the application', () => {
  render(<App />);

  expect(screen.getByText('IoT Application')).toBeInTheDocument();
});
