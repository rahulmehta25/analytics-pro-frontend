import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { RevenueChart } from './revenue-chart';

const mockData = [
  { month: 'Jan', revenue: 100000, spend: 20000 },
  { month: 'Feb', revenue: 120000, spend: 25000 },
  { month: 'Mar', revenue: 150000, spend: 30000 },
];

describe('RevenueChart', () => {
  it('renders without crashing', () => {
    const { container } = render(<RevenueChart data={mockData} />);
    expect(container).toBeInTheDocument();
  });

  it('renders the chart title', () => {
    render(<RevenueChart data={mockData} />);
    expect(screen.getByText('Revenue vs Spend')).toBeInTheDocument();
  });

  it('renders the legend', () => {
    render(<RevenueChart data={mockData} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Spend')).toBeInTheDocument();
  });

  it('renders card container', () => {
    const { container } = render(<RevenueChart data={mockData} />);
    const card = container.querySelector('.rounded-xl');
    expect(card).toBeInTheDocument();
  });

  it('handles empty data', () => {
    const { container } = render(<RevenueChart data={[]} />);
    expect(container).toBeInTheDocument();
  });

  it('renders legend items', () => {
    const { container } = render(<RevenueChart data={mockData} />);
    // Legend items exist with dots
    const dots = container.querySelectorAll('.rounded-full');
    expect(dots.length).toBeGreaterThan(0);
  });
});
