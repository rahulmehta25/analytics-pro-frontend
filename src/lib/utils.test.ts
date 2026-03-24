import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility function', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('base', true && 'included', false && 'excluded')).toBe('base included');
  });

  it('merges Tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('handles undefined and null values', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end');
  });

  it('handles empty strings', () => {
    expect(cn('base', '', 'end')).toBe('base end');
  });

  it('handles arrays of class names', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
  });

  it('handles object syntax', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
  });

  it('returns empty string for no arguments', () => {
    expect(cn()).toBe('');
  });

  it('handles complex Tailwind conflict resolution', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    expect(cn('bg-red-500 hover:bg-red-600', 'bg-blue-500')).toBe('hover:bg-red-600 bg-blue-500');
  });
});
