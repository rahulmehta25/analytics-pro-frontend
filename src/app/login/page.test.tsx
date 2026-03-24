import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import LoginPage from './page';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the page title', () => {
    render(<LoginPage />);
    expect(screen.getByText('Analytics Pro')).toBeInTheDocument();
  });

  it('renders sign in subtitle', () => {
    render(<LoginPage />);
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
  });

  it('renders Continue with Demo button', () => {
    render(<LoginPage />);
    expect(screen.getByText('Continue with Demo')).toBeInTheDocument();
  });

  it('renders email input', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
  });

  it('renders password input', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  it('renders Sign in button', () => {
    render(<LoginPage />);
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('renders sign up link', () => {
    render(<LoginPage />);
    expect(screen.getByText('Sign up')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign up' })).toHaveAttribute('href', '/signup');
  });

  it('navigates to dashboard on Continue with Demo click', async () => {
    const { user } = render(<LoginPage />);
    const demoButton = screen.getByText('Continue with Demo');
    await user.click(demoButton);
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('navigates to dashboard on form submit', async () => {
    const { user } = render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password');
    await user.click(submitButton);

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('updates email input value', async () => {
    const { user } = render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText('you@example.com');
    await user.type(emailInput, 'test@example.com');
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('updates password input value', async () => {
    const { user } = render(<LoginPage />);
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    await user.type(passwordInput, 'mypassword');
    expect(passwordInput).toHaveValue('mypassword');
  });
});
