import { describe, it, expect } from 'vitest';
import { render } from '@/test/test-utils';
import { KPICard } from './kpi-card';
import { InsightCard } from './insight-card';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

describe('Component Snapshots', () => {
  describe('KPICard', () => {
    it('matches snapshot with upward trend', () => {
      const { container } = render(
        <KPICard
          title="Revenue"
          value="$1.2M"
          change="+18%"
          trend="up"
          subtitle="7mo total"
          sparkline={[100, 200, 300, 400, 500]}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with downward trend', () => {
      const { container } = render(
        <KPICard
          title="Conversions"
          value="1.5K"
          change="-5%"
          trend="down"
          subtitle="30d"
          sparkline={[500, 400, 350, 300, 280]}
        />
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('InsightCard', () => {
    it('matches snapshot for critical severity', () => {
      const { container } = render(
        <InsightCard
          severity="critical"
          title="Budget Exceeded"
          description="Campaign #7 has exceeded its budget by 23%"
          timestamp="2 hours ago"
        />
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot for warning severity', () => {
      const { container } = render(
        <InsightCard
          severity="warning"
          title="Email Rates Dropping"
          description="Open rates have decreased 15% this week"
          timestamp="5 hours ago"
        />
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot for info severity', () => {
      const { container } = render(
        <InsightCard
          severity="info"
          title="New Segment Identified"
          description="AI has identified a high-converting audience segment"
          timestamp="1 day ago"
        />
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot for positive severity', () => {
      const { container } = render(
        <InsightCard
          severity="positive"
          title="ROI Improvement"
          description="LinkedIn ads showing 4.2x ROI improvement"
          timestamp="1 day ago"
        />
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('Sidebar', () => {
    it('matches snapshot', () => {
      const { container } = render(<Sidebar />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('Topbar', () => {
    it('matches snapshot', () => {
      const { container } = render(<Topbar />);
      expect(container).toMatchSnapshot();
    });
  });
});
