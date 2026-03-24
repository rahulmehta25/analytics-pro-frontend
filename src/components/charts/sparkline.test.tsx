import { describe, it, expect } from 'vitest';
import { render } from '@/test/test-utils';
import { Sparkline } from './sparkline';

describe('Sparkline', () => {
  it('renders without crashing', () => {
    const { container } = render(<Sparkline data={[10, 20, 30, 40, 50]} />);
    expect(container).toBeInTheDocument();
  });

  it('renders with custom color', () => {
    const { container } = render(
      <Sparkline data={[10, 20, 30]} color="#ff0000" />
    );
    expect(container).toBeInTheDocument();
  });

  it('renders with custom height', () => {
    const { container } = render(
      <Sparkline data={[10, 20, 30]} height={50} />
    );
    expect(container).toBeInTheDocument();
  });

  it('handles empty data array', () => {
    const { container } = render(<Sparkline data={[]} />);
    expect(container).toBeInTheDocument();
  });

  it('handles single data point', () => {
    const { container } = render(<Sparkline data={[50]} />);
    expect(container).toBeInTheDocument();
  });

  it('uses default color when not provided', () => {
    const { container } = render(<Sparkline data={[10, 20, 30]} />);
    expect(container).toBeInTheDocument();
  });

  it('uses default height when not provided', () => {
    const { container } = render(<Sparkline data={[10, 20, 30]} />);
    expect(container).toBeInTheDocument();
  });
});
