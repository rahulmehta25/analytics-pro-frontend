import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getKPIs, getRevenue, getCampaigns, getChannels, getInsights, getConnectors, queryAI } from './api';
import { kpiData, revenueData, campaignData, channelData, insightsData, connectorData, queryResponses } from './mock-data';

describe('API Layer', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.useRealTimers();
  });

  describe('getKPIs', () => {
    it('returns mock data on fetch failure', async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));
      const result = await getKPIs();
      expect(result).toEqual(kpiData);
    });

    it('returns mock data on non-ok response', async () => {
      global.fetch = vi.fn(() => Promise.resolve({ ok: false, status: 500 }));
      const result = await getKPIs();
      expect(result).toEqual(kpiData);
    });

    it('returns API data on success', async () => {
      const apiData = [{ title: 'Test KPI', value: '$100' }];
      global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(apiData),
      }));
      const result = await getKPIs();
      expect(result).toEqual(apiData);
    });
  });

  describe('getRevenue', () => {
    it('returns mock data on failure', async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));
      const result = await getRevenue();
      expect(result).toEqual(revenueData);
    });

    it('returns API data on success', async () => {
      const apiData = [{ month: 'Jan', revenue: 100000 }];
      global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(apiData),
      }));
      const result = await getRevenue();
      expect(result).toEqual(apiData);
    });
  });

  describe('getCampaigns', () => {
    it('returns mock data on failure', async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));
      const result = await getCampaigns();
      expect(result).toEqual(campaignData);
    });

    it('returns API data on success', async () => {
      const apiData = [{ name: 'Test Campaign', conversions: 1000 }];
      global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(apiData),
      }));
      const result = await getCampaigns();
      expect(result).toEqual(apiData);
    });
  });

  describe('getChannels', () => {
    it('returns mock data on failure', async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));
      const result = await getChannels();
      expect(result).toEqual(channelData);
    });

    it('returns API data on success', async () => {
      const apiData = [{ name: 'Test Channel', value: 50 }];
      global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(apiData),
      }));
      const result = await getChannels();
      expect(result).toEqual(apiData);
    });
  });

  describe('getInsights', () => {
    it('returns mock data on failure', async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));
      const result = await getInsights();
      expect(result).toEqual(insightsData);
    });

    it('returns API data on success', async () => {
      const apiData = [{ id: '1', title: 'Test Insight' }];
      global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(apiData),
      }));
      const result = await getInsights();
      expect(result).toEqual(apiData);
    });
  });

  describe('getConnectors', () => {
    it('returns mock data on failure', async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));
      const result = await getConnectors();
      expect(result).toEqual(connectorData);
    });

    it('returns API data on success', async () => {
      const apiData = [{ id: 'test', name: 'Test Connector' }];
      global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(apiData),
      }));
      const result = await getConnectors();
      expect(result).toEqual(apiData);
    });
  });

  describe('queryAI', () => {
    it('returns fallback response on failure', async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));
      const result = await queryAI('Best performing campaign?');
      expect(result).toEqual(queryResponses['Best performing campaign?']);
    });

    it('returns default fallback for unknown questions', async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));
      const result = await queryAI('Unknown question that does not exist');
      expect(result).toEqual(queryResponses['Best performing campaign?']);
    });

    it('returns API response on success', async () => {
      const apiResponse = { text: 'Test response', chartType: 'bar', chartData: [], sources: [] };
      global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(apiResponse),
      }));
      const result = await queryAI('Any question');
      expect(result).toEqual(apiResponse);
    });

    it('returns fallback on non-ok response', async () => {
      global.fetch = vi.fn(() => Promise.resolve({ ok: false, status: 500 }));
      const result = await queryAI('ROI by channel');
      expect(result).toEqual(queryResponses['ROI by channel']);
    });
  });

  describe('error handling', () => {
    it('handles any error gracefully by returning fallback', async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error('Any error')));
      const result = await getKPIs();
      expect(result).toEqual(kpiData);
    });
  });
});
