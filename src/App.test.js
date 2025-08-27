import { render, screen, within } from '@testing-library/react';
import App from './App';

test('renders default Discover UI', () => {
  render(<App />);
  // Navbar shows current section (within banner)
  const banner = screen.getByRole('banner');
  expect(within(banner).getByText(/découvrir/i)).toBeInTheDocument();
  // Active bottom tab is Découvrir
  expect(screen.getByRole('button', { name: /découvrir/i })).toHaveAttribute('aria-current', 'page');
  // A sample stand appears in the list
  expect(screen.getByText(/vintage/i)).toBeInTheDocument();
});
