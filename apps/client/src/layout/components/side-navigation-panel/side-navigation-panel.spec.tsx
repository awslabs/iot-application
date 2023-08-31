import { vi } from 'vitest';
import { render, screen } from '~/helpers/tests/testing-library';

import { SideNavigationPanel } from './side-navigation-panel';

describe('<SideNavigationPanel />', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should render the side navigation panel with Centurion Home in the header', () => {
    render(<SideNavigationPanel />);

    const centurionHomeText = screen.getByText('Centurion Home');

    expect(centurionHomeText).toBeInTheDocument();
  });
  it('should render the side navigation panel with Dashboard link', () => {
    render(<SideNavigationPanel />);

    const dashboardsText = screen.getByText('Dashboards');

    expect(dashboardsText).toBeInTheDocument();
  });
});
