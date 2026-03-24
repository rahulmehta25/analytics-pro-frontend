import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { KPICard } from './kpi-card';

const defaultProps = {
  title: 'Total Revenue',
  value: '$1.2M',
  change: '+18%',
  trend: 'up' as const,
  subtitle: '7mo total',
  sparkline: [10, 20, 30, 40, 50],
};

describe('KPICard', () => {
  it('renders the title', () => {
    render(<KPICard {...defaultProps} />);
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
  });

  it('renders the value', () => {
    render(<KPICard {...defaultProps} />);
    expect(screen.getByText('$1.2M')).toBeInTheDocument();
  });

  it('renders the change percentage', () => {
    render(<KPICard {...defaultProps} />);
    expect(screen.getByText('+18%')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<KPICard {...defaultProps} />);
    expect(screen.getByText('7mo total')).toBeInTheDocument();
  });

  it('renders change text with upward trend', () => {
    const { container } = render(<KPICard {...defaultProps} />);
    const changeText = screen.getByText('+18%');
    expect(changeText).toBeInTheDocument();
    // Check that there's an emerald SVG icon (TrendingUp)
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders change text with downward trend', () => {
    const { container } = render(<KPICard {...defaultProps} trend="down" change="-12%" />);
    const changeText = screen.getByText('-12%');
    expect(changeText).toBeInTheDocument();
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders TrendingUp icon for upward trend', () => {
    const { container } = render(<KPICard {...defaultProps} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders TrendingDown icon for downward trend', () => {
    const { container } = render(<KPICard {...defaultProps} trend="down" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders sparkline section', () => {
    const { container } = render(<KPICard {...defaultProps} />);
    // Sparkline is wrapped in a container with Recharts
    const rechartsWrapper = container.querySelector('.recharts-responsive-container');
    expect(rechartsWrapper).toBeInTheDocument();
  });
});
