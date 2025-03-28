
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Define createElement for loading-state test
beforeAll(() => {
  Object.defineProperty(window, 'HTMLElement', {
    value: class extends HTMLElement {
      dataset = {};
    }
  });
});

// Mock the GlassCard component
vi.mock('@/components/ui/GlassCard', () => ({
  GlassCard: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div data-testid="glass-card" className={className}>{children}</div>
  )
}));

// Mock loading state for PRTrendline test
vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="loading-state" className={className}></div>
  )
}));

// Mock Badge component
vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: { children: React.ReactNode, variant?: string, className?: string }) => (
    <div data-testid="badge" className={className} data-variant={variant}>{children}</div>
  )
}));
