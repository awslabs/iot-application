import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import App from './App';

test('loads the application', async () => {
  render(<App/>);

  expect(screen.getByText('IoT Application')).toBeInTheDocument();
});
