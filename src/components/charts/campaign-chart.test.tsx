import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { CampaignChart } from './campaign-chart';

const mockData = [
  { name: 'Campaign A', conversions: 1000, spend: 5000, roi: 3.5 },
  { name: 'Campaign B', conversions: 800, spend: 4000, roi: 2.8 },
  { name: 'Campaign C', conversions: 600, spend: 3000, roi: 2.2 },
];

describe('CampaignChart', () => {
  it('renders without crashing', () => {
    const { container } = render(<CampaignChart data={mockData} />);
    expect(container).toBeInTheDocument();
  });

  it('renders the chart title', () => {
    render(<CampaignChart data={mockData} />);
    expect(screen.getByText('Top Campaigns by Conversions')).toBeInTheDocument();
  });

  it('renders card container', () => {
    const { container } = render(<CampaignChart data={mockData} />);
    const card = container.querySelector('.rounded-xl');
    expect(card).toBeInTheDocument();
  });

  it('handles empty data', () => {
    const { container } = render(<CampaignChart data={[]} />);
    expect(container).toBeInTheDocument();
  });

  it('renders chart content area', () => {
    const { container } = render(<CampaignChart data={mockData} />);
    const chartContainer = container.querySelector('[class*="recharts"]');
    expect(chartContainer).toBeInTheDocument();
  });
});
