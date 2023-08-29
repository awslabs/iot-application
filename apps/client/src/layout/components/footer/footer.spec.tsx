import { Footer } from './footer';
import { render, screen } from '~/helpers/tests/testing-library';

describe('footer', () => {
  it('should load footer on page render', () => {
    render(<Footer />);
    expect(screen.getByTestId('footer-component')).toBeInTheDocument();
  });

  it('should have copy right description in the footer', () => {
    render(<Footer />);

    expect(screen.getByTestId('copy-right')).toBeInTheDocument();
  });
});
