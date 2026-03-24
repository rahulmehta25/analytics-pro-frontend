import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { InsightCard } from './insight-card';

const defaultProps = {
  severity: 'warning' as const,
  title: 'Budget Alert',
  description: 'Campaign spending is above target.',
  timestamp: '2 hours ago',
};

describe('InsightCard', () => {
  it('renders the title', () => {
    render(<InsightCard {...defaultProps} />);
    expect(screen.getByText('Budget Alert')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<InsightCard {...defaultProps} />);
    expect(screen.getByText('Campaign spending is above target.')).toBeInTheDocument();
  });

  it('renders the timestamp', () => {
    render(<InsightCard {...defaultProps} />);
    expect(screen.getByText('2 hours ago')).toBeInTheDocument();
  });

  it('renders warning badge with correct styling', () => {
    render(<InsightCard {...defaultProps} />);
    const badge = screen.getByText('Warning');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-amber-50');
    expect(badge).toHaveClass('text-amber-600');
  });

  it('renders critical badge with correct styling', () => {
    render(<InsightCard {...defaultProps} severity="critical" />);
    const badge = screen.getByText('Critical');
    expect(badge).toHaveClass('bg-red-50');
    expect(badge).toHaveClass('text-red-600');
  });

  it('renders info badge with correct styling', () => {
    render(<InsightCard {...defaultProps} severity="info" />);
    const badge = screen.getByText('Info');
    expect(badge).toHaveClass('bg-blue-50');
    expect(badge).toHaveClass('text-blue-600');
  });

  it('renders positive badge with correct styling', () => {
    render(<InsightCard {...defaultProps} severity="positive" />);
    const badge = screen.getByText('Positive');
    expect(badge).toHaveClass('bg-emerald-50');
    expect(badge).toHaveClass('text-emerald-600');
  });

  it('truncates long descriptions', () => {
    const { container } = render(<InsightCard {...defaultProps} />);
    const description = container.querySelector('.line-clamp-2');
    expect(description).toBeInTheDocument();
  });
});
