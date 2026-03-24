import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import RAGDemoPage from './page';

describe('RAGDemoPage', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the page header', () => {
    render(<RAGDemoPage />);
    expect(screen.getByText('RAG Pipeline Explorer')).toBeInTheDocument();
    expect(screen.getByText(/Watch how Analytics Pro retrieves/)).toBeInTheDocument();
  });

  it('renders Interactive Demo badge', () => {
    render(<RAGDemoPage />);
    expect(screen.getByText('Interactive Demo')).toBeInTheDocument();
  });

  it('renders sample queries', () => {
    render(<RAGDemoPage />);
    expect(screen.getByText('Which campaign had the best ROAS last quarter?')).toBeInTheDocument();
    expect(screen.getByText('How does email compare to paid ads for conversions?')).toBeInTheDocument();
    expect(screen.getByText("What's our current blended CPA across channels?")).toBeInTheDocument();
  });

  it('renders pipeline progress stages', () => {
    render(<RAGDemoPage />);
    expect(screen.getByText('Ingesting Sources')).toBeInTheDocument();
    expect(screen.getByText('Chunking Documents')).toBeInTheDocument();
    expect(screen.getByText('Generating Embeddings')).toBeInTheDocument();
    expect(screen.getByText('Retrieving Context')).toBeInTheDocument();
    expect(screen.getByText('Generating Response')).toBeInTheDocument();
  });

  it('shows query selection prompt initially', () => {
    render(<RAGDemoPage />);
    expect(screen.getByText('Select a marketing question to see the full RAG pipeline:')).toBeInTheDocument();
  });

  it('has clickable query buttons', () => {
    const { container } = render(<RAGDemoPage />);
    const buttons = container.querySelectorAll('button');
    // Should have sample query buttons
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('renders pipeline stage labels', () => {
    const { container } = render(<RAGDemoPage />);
    // Check for pipeline stages
    expect(container.textContent).toContain('Ingesting Sources');
  });

  it('renders in idle state initially', () => {
    const { container } = render(<RAGDemoPage />);
    // In idle state, should show query selection prompt
    expect(container.textContent).toContain('Select a marketing question');
  });
});
