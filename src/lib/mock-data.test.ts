import { describe, it, expect } from 'vitest';
import {
  kpiData,
  revenueData,
  campaignData,
  channelData,
  insightsData,
  recentInsights,
  connectorData,
  querySuggestions,
  queryResponses,
  type Insight,
  type InsightSeverity,
} from './mock-data';

describe('Mock Data Validation', () => {
  describe('kpiData', () => {
    it('has correct array length', () => {
      expect(kpiData).toHaveLength(4);
    });

    it('each KPI has required fields', () => {
      kpiData.forEach((kpi) => {
        expect(kpi).toHaveProperty('title');
        expect(kpi).toHaveProperty('value');
        expect(kpi).toHaveProperty('change');
        expect(kpi).toHaveProperty('trend');
        expect(kpi).toHaveProperty('subtitle');
        expect(kpi).toHaveProperty('sparkline');
      });
    });

    it('trend is either up or down', () => {
      kpiData.forEach((kpi) => {
        expect(['up', 'down']).toContain(kpi.trend);
      });
    });

    it('sparkline is an array of numbers', () => {
      kpiData.forEach((kpi) => {
        expect(Array.isArray(kpi.sparkline)).toBe(true);
        kpi.sparkline.forEach((value) => {
          expect(typeof value).toBe('number');
        });
      });
    });
  });

  describe('revenueData', () => {
    it('has correct array length', () => {
      expect(revenueData).toHaveLength(7);
    });

    it('each entry has required fields', () => {
      revenueData.forEach((entry) => {
        expect(entry).toHaveProperty('month');
        expect(entry).toHaveProperty('revenue');
        expect(entry).toHaveProperty('spend');
        expect(typeof entry.month).toBe('string');
        expect(typeof entry.revenue).toBe('number');
        expect(typeof entry.spend).toBe('number');
      });
    });

    it('revenue is always greater than spend', () => {
      revenueData.forEach((entry) => {
        expect(entry.revenue).toBeGreaterThan(entry.spend);
      });
    });
  });

  describe('campaignData', () => {
    it('has correct array length', () => {
      expect(campaignData).toHaveLength(5);
    });

    it('each campaign has required fields', () => {
      campaignData.forEach((campaign) => {
        expect(campaign).toHaveProperty('name');
        expect(campaign).toHaveProperty('conversions');
        expect(campaign).toHaveProperty('spend');
        expect(campaign).toHaveProperty('roi');
        expect(typeof campaign.name).toBe('string');
        expect(typeof campaign.conversions).toBe('number');
        expect(typeof campaign.spend).toBe('number');
        expect(typeof campaign.roi).toBe('number');
      });
    });

    it('all values are positive', () => {
      campaignData.forEach((campaign) => {
        expect(campaign.conversions).toBeGreaterThan(0);
        expect(campaign.spend).toBeGreaterThan(0);
        expect(campaign.roi).toBeGreaterThan(0);
      });
    });
  });

  describe('channelData', () => {
    it('has correct array length', () => {
      expect(channelData).toHaveLength(5);
    });

    it('each channel has required fields', () => {
      channelData.forEach((channel) => {
        expect(channel).toHaveProperty('name');
        expect(channel).toHaveProperty('value');
        expect(channel).toHaveProperty('fill');
        expect(typeof channel.name).toBe('string');
        expect(typeof channel.value).toBe('number');
        expect(typeof channel.fill).toBe('string');
      });
    });

    it('values sum to approximately 100 (percentage)', () => {
      const total = channelData.reduce((sum, channel) => sum + channel.value, 0);
      expect(total).toBeGreaterThanOrEqual(99);
      expect(total).toBeLessThanOrEqual(101);
    });

    it('fill colors are valid hex codes', () => {
      channelData.forEach((channel) => {
        expect(channel.fill).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });
  });

  describe('insightsData', () => {
    const validSeverities: InsightSeverity[] = ['critical', 'warning', 'info', 'positive'];

    it('has correct array length', () => {
      expect(insightsData.length).toBeGreaterThan(0);
    });

    it('each insight has required fields', () => {
      insightsData.forEach((insight: Insight) => {
        expect(insight).toHaveProperty('id');
        expect(insight).toHaveProperty('severity');
        expect(insight).toHaveProperty('title');
        expect(insight).toHaveProperty('description');
        expect(insight).toHaveProperty('timestamp');
      });
    });

    it('severity is a valid value', () => {
      insightsData.forEach((insight: Insight) => {
        expect(validSeverities).toContain(insight.severity);
      });
    });

    it('optional fields have correct types when present', () => {
      insightsData.forEach((insight: Insight) => {
        if (insight.metric) expect(typeof insight.metric).toBe('string');
        if (insight.metricChange) expect(typeof insight.metricChange).toBe('string');
        if (insight.metricTrend) expect(['up', 'down']).toContain(insight.metricTrend);
        if (insight.action) expect(typeof insight.action).toBe('string');
        if (insight.sparkline) {
          expect(Array.isArray(insight.sparkline)).toBe(true);
        }
      });
    });
  });

  describe('recentInsights', () => {
    it('is a subset of insightsData', () => {
      expect(recentInsights.length).toBeLessThanOrEqual(insightsData.length);
    });

    it('has first 5 insights', () => {
      expect(recentInsights).toHaveLength(5);
      expect(recentInsights).toEqual(insightsData.slice(0, 5));
    });
  });

  describe('connectorData', () => {
    it('has correct array length', () => {
      expect(connectorData).toHaveLength(4);
    });

    it('each connector has required fields', () => {
      connectorData.forEach((connector) => {
        expect(connector).toHaveProperty('id');
        expect(connector).toHaveProperty('name');
        expect(connector).toHaveProperty('description');
        expect(connector).toHaveProperty('status');
        expect(connector).toHaveProperty('lastSync');
        expect(connector).toHaveProperty('rowsSynced');
        expect(connector).toHaveProperty('health');
        expect(connector).toHaveProperty('icon');
      });
    });

    it('status is connected or disconnected', () => {
      connectorData.forEach((connector) => {
        expect(['connected', 'disconnected']).toContain(connector.status);
      });
    });

    it('health is between 0 and 100', () => {
      connectorData.forEach((connector) => {
        expect(connector.health).toBeGreaterThanOrEqual(0);
        expect(connector.health).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('querySuggestions', () => {
    it('is a non-empty array of strings', () => {
      expect(Array.isArray(querySuggestions)).toBe(true);
      expect(querySuggestions.length).toBeGreaterThan(0);
      querySuggestions.forEach((suggestion) => {
        expect(typeof suggestion).toBe('string');
        expect(suggestion.length).toBeGreaterThan(0);
      });
    });
  });

  describe('queryResponses', () => {
    it('has responses for all suggestions', () => {
      querySuggestions.forEach((suggestion) => {
        expect(queryResponses).toHaveProperty(suggestion);
      });
    });

    it('each response has required fields', () => {
      Object.values(queryResponses).forEach((response) => {
        expect(response).toHaveProperty('text');
        expect(response).toHaveProperty('chartType');
        expect(response).toHaveProperty('chartData');
        expect(response).toHaveProperty('sources');
        expect(typeof response.text).toBe('string');
        expect(typeof response.chartType).toBe('string');
        expect(Array.isArray(response.chartData)).toBe(true);
        expect(Array.isArray(response.sources)).toBe(true);
      });
    });

    it('sources have required fields', () => {
      Object.values(queryResponses).forEach((response) => {
        response.sources.forEach((source) => {
          expect(source).toHaveProperty('title');
          expect(source).toHaveProperty('rows');
          expect(source).toHaveProperty('date');
        });
      });
    });
  });
});
