import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import SignupPage from './page';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe('SignupPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the page title', () => {
    render(<SignupPage />);
    expect(screen.getByText('Analytics Pro')).toBeInTheDocument();
  });

  it('renders create account subtitle', () => {
    render(<SignupPage />);
    expect(screen.getByText('Create your account')).toBeInTheDocument();
  });

  it('renders Continue with Demo button', () => {
    render(<SignupPage />);
    expect(screen.getByText('Continue with Demo')).toBeInTheDocument();
  });

  it('renders email input', () => {
    render(<SignupPage />);
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
  });

  it('renders password input', () => {
    render(<SignupPage />);
    expect(screen.getByPlaceholderText('Create a password')).toBeInTheDocument();
  });

  it('renders Create account button', () => {
    render(<SignupPage />);
    expect(screen.getByRole('button', { name: 'Create account' })).toBeInTheDocument();
  });

  it('renders sign in link', () => {
    render(<SignupPage />);
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login');
  });

  it('navigates to dashboard on Continue with Demo click', async () => {
    const { user } = render(<SignupPage />);
    const demoButton = screen.getByText('Continue with Demo');
    await user.click(demoButton);
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('navigates to dashboard on form submit', async () => {
    const { user } = render(<SignupPage />);
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = screen.getByPlaceholderText('Create a password');
    const submitButton = screen.getByRole('button', { name: 'Create account' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password');
    await user.click(submitButton);

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('updates email input value', async () => {
    const { user } = render(<SignupPage />);
    const emailInput = screen.getByPlaceholderText('you@example.com');
    await user.type(emailInput, 'new@example.com');
    expect(emailInput).toHaveValue('new@example.com');
  });

  it('updates password input value', async () => {
    const { user } = render(<SignupPage />);
    const passwordInput = screen.getByPlaceholderText('Create a password');
    await user.type(passwordInput, 'newpassword');
    expect(passwordInput).toHaveValue('newpassword');
  });
});
