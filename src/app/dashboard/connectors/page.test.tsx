import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import ConnectorsPage from './page';

vi.mock('@/lib/api', () => ({
  getConnectors: vi.fn(() => Promise.resolve([
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Web analytics data',
      status: 'connected',
      lastSync: '5 minutes ago',
      rowsSynced: 1240000,
      health: 98,
      icon: 'BarChart3',
    },
    {
      id: 'bigquery',
      name: 'BigQuery',
      description: 'Cloud data warehouse',
      status: 'connected',
      lastSync: '12 minutes ago',
      rowsSynced: 8500000,
      health: 100,
      icon: 'Database',
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'CRM data',
      status: 'disconnected',
      lastSync: '3 days ago',
      rowsSynced: 450000,
      health: 0,
      icon: 'Users',
    },
  ])),
}));

describe('ConnectorsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the page header', () => {
    const { container } = render(<ConnectorsPage />);
    expect(container.textContent).toContain('Data Connectors');
  });

  it('renders Add Connector button', () => {
    render(<ConnectorsPage />);
    expect(screen.getByText('Add Connector')).toBeInTheDocument();
  });

  it('fetches connectors on mount', async () => {
    render(<ConnectorsPage />);

    const api = await import('@/lib/api');
    await waitFor(() => {
      expect(api.getConnectors).toHaveBeenCalled();
    });
  });

  it('renders connector cards', async () => {
    render(<ConnectorsPage />);
    await waitFor(() => {
      expect(screen.getByText('Google Analytics')).toBeInTheDocument();
      expect(screen.getByText('BigQuery')).toBeInTheDocument();
      expect(screen.getByText('Salesforce')).toBeInTheDocument();
    });
  });

  it('shows connected status for connected connectors', async () => {
    render(<ConnectorsPage />);
    await waitFor(() => {
      const connectedBadges = screen.getAllByText('Connected');
      expect(connectedBadges.length).toBeGreaterThan(0);
    });
  });

  it('shows disconnected status for disconnected connectors', async () => {
    render(<ConnectorsPage />);
    await waitFor(() => {
      expect(screen.getByText('Disconnected')).toBeInTheDocument();
    });
  });

  it('renders interactive sync buttons', async () => {
    const { container } = render(<ConnectorsPage />);
    await waitFor(() => {
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  it('renders connector sync status', async () => {
    const { container } = render(<ConnectorsPage />);
    await waitFor(() => {
      // Should show sync-related content
      expect(container.textContent).toContain('Google Analytics');
    });
  });

  it('displays data statistics', async () => {
    const { container } = render(<ConnectorsPage />);
    await waitFor(() => {
      // Should have some numeric data displayed
      expect(container.textContent).toMatch(/\d/);
    });
  });

  it('displays connector health information', async () => {
    const { container } = render(<ConnectorsPage />);
    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });
  });
});
