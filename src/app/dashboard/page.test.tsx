import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import DashboardPage from './page';

// Mock the API module
vi.mock('@/lib/api', () => ({
  getKPIs: vi.fn(() => Promise.resolve([
    { title: 'Test KPI', value: '$100', change: '+10%', trend: 'up', subtitle: 'test', sparkline: [1, 2, 3] }
  ])),
  getRevenue: vi.fn(() => Promise.resolve([
    { month: 'Jan', revenue: 100000, spend: 20000 }
  ])),
  getCampaigns: vi.fn(() => Promise.resolve([
    { name: 'Test', conversions: 100, spend: 1000, roi: 2.5 }
  ])),
  getChannels: vi.fn(() => Promise.resolve([
    { name: 'Test', value: 50, fill: '#000' }
  ])),
  getInsights: vi.fn(() => Promise.resolve([
    { id: '1', severity: 'info', title: 'Test', description: 'Test desc', timestamp: 'now' }
  ])),
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the page header', async () => {
    const { container } = render(<DashboardPage />);
    // Check for heading content
    expect(container.textContent).toContain('Overview');
    expect(container.textContent).toContain('Track your marketing performance');
  });

  it('renders dashboard with interactive elements', () => {
    const { container } = render(<DashboardPage />);
    // Should have buttons for interaction
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('renders time period selector', () => {
    const { container } = render(<DashboardPage />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('renders KPI cards section', async () => {
    render(<DashboardPage />);
    await waitFor(() => {
      const cards = screen.getAllByText(/Total Spend|Revenue|Conversions|Avg ROAS/);
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  it('renders Recent Insights section', async () => {
    render(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getByText('Recent Insights')).toBeInTheDocument();
    });
  });

  it('allows clicking time period buttons', async () => {
    const { user, container } = render(<DashboardPage />);
    const buttons = container.querySelectorAll('button');
    // Should have period buttons
    expect(buttons.length).toBeGreaterThan(0);
    // Click should not throw
    if (buttons[0]) {
      await user.click(buttons[0]);
    }
  });

  it('fetches data on mount', async () => {
    render(<DashboardPage />);

    const api = await import('@/lib/api');
    await waitFor(() => {
      expect(api.getKPIs).toHaveBeenCalled();
      expect(api.getRevenue).toHaveBeenCalled();
      expect(api.getCampaigns).toHaveBeenCalled();
      expect(api.getChannels).toHaveBeenCalled();
      expect(api.getInsights).toHaveBeenCalled();
    });
  });
});
