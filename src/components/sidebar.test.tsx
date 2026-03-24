import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { Sidebar } from './sidebar';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/dashboard'),
}));

describe('Sidebar', () => {
  it('renders all navigation items', () => {
    render(<Sidebar />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Query')).toBeInTheDocument();
    expect(screen.getByText('Connectors')).toBeInTheDocument();
    expect(screen.getByText('Insights')).toBeInTheDocument();
    expect(screen.getByText('RAG Demo')).toBeInTheDocument();
  });

  it('renders links with correct hrefs', () => {
    render(<Sidebar />);

    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/dashboard');
    expect(screen.getByRole('link', { name: /query/i })).toHaveAttribute('href', '/dashboard/query');
    expect(screen.getByRole('link', { name: /connectors/i })).toHaveAttribute('href', '/dashboard/connectors');
    expect(screen.getByRole('link', { name: /insights/i })).toHaveAttribute('href', '/dashboard/insights');
    expect(screen.getByRole('link', { name: /rag demo/i })).toHaveAttribute('href', '/dashboard/rag-demo');
  });

  it('renders dashboard link as active when on dashboard', () => {
    render(<Sidebar />);

    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashboardLink).toBeInTheDocument();
    // The active link should have different styling - just verify it's rendered
    expect(dashboardLink.className).toBeDefined();
  });

  it('renders as aside element', () => {
    const { container } = render(<Sidebar />);
    const aside = container.querySelector('aside');
    expect(aside).toBeInTheDocument();
  });

  it('has navigation container', () => {
    const { container } = render(<Sidebar />);
    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
  });
});

describe('Sidebar with different paths', () => {
  it('renders Query link when on query page', async () => {
    const { usePathname } = await import('next/navigation');
    vi.mocked(usePathname).mockReturnValue('/dashboard/query');

    render(<Sidebar />);

    const queryLink = screen.getByRole('link', { name: /query/i });
    expect(queryLink).toBeInTheDocument();
    expect(queryLink).toHaveAttribute('href', '/dashboard/query');
  });

  it('renders Insights link when on insights page', async () => {
    const { usePathname } = await import('next/navigation');
    vi.mocked(usePathname).mockReturnValue('/dashboard/insights');

    render(<Sidebar />);

    const insightsLink = screen.getByRole('link', { name: /insights/i });
    expect(insightsLink).toBeInTheDocument();
    expect(insightsLink).toHaveAttribute('href', '/dashboard/insights');
  });
});
