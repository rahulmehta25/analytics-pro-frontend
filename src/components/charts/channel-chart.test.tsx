import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { ChannelChart } from './channel-chart';

const mockData = [
  { name: 'Google Ads', value: 45, fill: '#2563eb' },
  { name: 'Meta', value: 30, fill: '#7c3aed' },
  { name: 'Email', value: 15, fill: '#059669' },
  { name: 'Organic', value: 10, fill: '#d97706' },
];

describe('ChannelChart', () => {
  it('renders without crashing', () => {
    const { container } = render(<ChannelChart data={mockData} />);
    expect(container).toBeInTheDocument();
  });

  it('renders the chart title', () => {
    render(<ChannelChart data={mockData} />);
    expect(screen.getByText('Channel Attribution')).toBeInTheDocument();
  });

  it('renders legend items', () => {
    render(<ChannelChart data={mockData} />);
    expect(screen.getByText('Google Ads')).toBeInTheDocument();
    expect(screen.getByText('Meta')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Organic')).toBeInTheDocument();
  });

  it('renders percentage values', () => {
    render(<ChannelChart data={mockData} />);
    expect(screen.getByText('45%')).toBeInTheDocument();
    expect(screen.getByText('30%')).toBeInTheDocument();
    expect(screen.getByText('15%')).toBeInTheDocument();
    expect(screen.getByText('10%')).toBeInTheDocument();
  });

  it('renders card container', () => {
    const { container } = render(<ChannelChart data={mockData} />);
    const card = container.querySelector('.rounded-xl');
    expect(card).toBeInTheDocument();
  });

  it('handles empty data', () => {
    const { container } = render(<ChannelChart data={[]} />);
    expect(container).toBeInTheDocument();
  });

  it('renders colored dots for legend', () => {
    const { container } = render(<ChannelChart data={mockData} />);
    const dots = container.querySelectorAll('.rounded-full');
    expect(dots.length).toBeGreaterThan(0);
  });
});
