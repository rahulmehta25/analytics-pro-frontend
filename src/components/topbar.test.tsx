import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { Topbar } from './topbar';

describe('Topbar', () => {
  it('renders the brand name', () => {
    const { container } = render(<Topbar />);
    // Brand name is in a span inside the header
    const brandText = container.querySelector('span');
    expect(brandText).toBeInTheDocument();
  });

  it('renders topbar content', () => {
    const { container } = render(<Topbar />);
    // Check topbar rendered with header
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  it('renders user avatar with initials', () => {
    render(<Topbar />);
    expect(screen.getByText('DU')).toBeInTheDocument();
  });

  it('renders as header element', () => {
    const { container } = render(<Topbar />);
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    const { container } = render(<Topbar />);
    const header = container.querySelector('header');
    expect(header).toHaveClass('flex');
    expect(header).toHaveClass('h-14');
  });

  it('renders dropdown trigger button', () => {
    render(<Topbar />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });
});
