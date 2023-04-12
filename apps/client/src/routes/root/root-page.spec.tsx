import { render, screen } from '~/helpers/tests/testing-library';

import { RootPage } from './root-page';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

describe('<RootPage />', () => {
  it('should render outlet', () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route element={<RootPage />}>
            <Route index element={<div>test page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('test page')).toBeVisible();
  });
});
