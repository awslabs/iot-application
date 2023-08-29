import { Footer } from './footer'
import { render, screen } from '~/helpers/tests/testing-library';

describe('footer', () => {
    it('should load footer on page render', async () => {
      render(<Footer />);
      
      expect(screen.getByTestId('footer-component')).toBeInTheDocument();
    });

    it('should have cloudshell link in the footer', async () => {
        render(<Footer />);

      expect(screen.getByTestId('cloudshell-link')).toBeInTheDocument();
    });

    it('should have Feedback link in the footer', async () => {
        render(<Footer />);

      expect(screen.getByTestId('feedback-link')).toBeInTheDocument();
    });

    it('should have Language link in the footer', async () => {
        render(<Footer />);

      expect(screen.getByTestId('language-link')).toBeInTheDocument();
    });

    it('should have Privacy link in the footer', async () => {
        render(<Footer />);

      expect(screen.getByTestId('privacy-link')).toBeInTheDocument();
    });

    it('should have Terms link in the footer', async () => {
        render(<Footer />);

      expect(screen.getByTestId('terms-link')).toBeInTheDocument();
    });

    it('should have Cookie Preferences link in the footer', async () => {
        render(<Footer />);

      expect(screen.getByTestId('cookie-link')).toBeInTheDocument();
    });
  });