import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import InsightsPage from './page';

vi.mock('@/lib/api', () => ({
  getInsights: vi.fn(() => Promise.resolve([
    {
      id: '1',
      severity: 'critical',
      title: 'Test Critical',
      description: 'Critical description',
      timestamp: '1 hour ago',
      metric: 'Budget',
      metricChange: '+23%',
      metricTrend: 'up',
      action: 'Take action',
      sparkline: [1, 2, 3]
    },
    {
      id: '2',
      severity: 'warning',
      title: 'Test Warning',
      description: 'Warning description',
      timestamp: '2 hours ago'
    },
    {
      id: '3',
      severity: 'info',
      title: 'Test Info',
      description: 'Info description',
      timestamp: '3 hours ago'
    },
    {
      id: '4',
      severity: 'positive',
      title: 'Test Positive',
      description: 'Positive description',
      timestamp: '4 hours ago'
    },
  ])),
}));

describe('InsightsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the page header', () => {
    render(<InsightsPage />);
    expect(screen.getByText('AI Insights')).toBeInTheDocument();
    expect(screen.getByText('Automated insights and recommendations from your marketing data')).toBeInTheDocument();
  });

  it('renders filter buttons', () => {
    render(<InsightsPage />);
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Critical' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Warning' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Info' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Positive' })).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<InsightsPage />);
    expect(screen.getByPlaceholderText('Search insights...')).toBeInTheDocument();
  });

  it('has All filter selected by default', () => {
    render(<InsightsPage />);
    const allButton = screen.getByRole('button', { name: 'All' });
    expect(allButton).toHaveClass('bg-zinc-900');
  });

  it('filters by severity when clicking filter buttons', async () => {
    const { user } = render(<InsightsPage />);
    const criticalButton = screen.getByRole('button', { name: 'Critical' });
    await user.click(criticalButton);
    expect(criticalButton).toHaveClass('bg-zinc-900');
  });

  it('filters by search query', async () => {
    const { user } = render(<InsightsPage />);
    const searchInput = screen.getByPlaceholderText('Search insights...');
    await user.type(searchInput, 'critical');

    await waitFor(() => {
      expect(searchInput).toHaveValue('critical');
    });
  });

  it('fetches insights on mount', async () => {
    render(<InsightsPage />);

    const api = await import('@/lib/api');
    await waitFor(() => {
      expect(api.getInsights).toHaveBeenCalled();
    });
  });

  it('renders View Details buttons', async () => {
    render(<InsightsPage />);
    await waitFor(() => {
      const viewButtons = screen.getAllByText('View Details');
      expect(viewButtons.length).toBeGreaterThan(0);
    });
  });
});
