
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Setup DOM element for testing
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
  Badge: ({ children, variant, className }: { 
    children: React.ReactNode, 
    variant?: string, 
    className?: string 
  }) => (
    <div data-testid="badge" className={className} data-variant={variant}>
      {children}
    </div>
  )
}));

// Mock PR Event data
export const mockPREvents = [
  {
    id: '1',
    creatorId: 'creator1',
    platform: 'Twitter',
    headline: 'Major Announcement',
    summary: 'A major announcement was made',
    sentimentScore: 80,
    impact: 'major' as const,
    timestamp: '2023-01-01T12:00:00Z',
    isPositive: true
  },
  {
    id: '2',
    creatorId: 'creator1',
    platform: 'Instagram',
    headline: 'Minor Update',
    summary: 'A minor update was shared',
    sentimentScore: -30,
    impact: 'minor' as const,
    timestamp: '2023-01-02T12:00:00Z',
    isPositive: false
  }
];

// Mock historical scores
export const mockHistoricalScores = [
  { timestamp: '2023-01-01T12:00:00Z', score: 75 },
  { timestamp: '2023-01-02T12:00:00Z', score: 60 },
  { timestamp: '2023-01-03T12:00:00Z', score: -20 },
  { timestamp: '2023-01-04T12:00:00Z', score: 10 },
  { timestamp: '2023-01-05T12:00:00Z', score: 50 }
];

// Setup mock for PREngine hook
export const setupMockPREngine = (options = {}) => {
  const defaultPREngineData = {
    prEvents: mockPREvents,
    latestScore: 75,
    historicalScores: mockHistoricalScores,
    isLoading: false,
    isError: false,
    refreshPREvents: vi.fn()
  };

  return {
    ...defaultPREngineData,
    ...options
  };
};
