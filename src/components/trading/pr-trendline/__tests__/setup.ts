
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import the component to test
import PRTrendline from '../../PRTrendline';

// Mock the usePREngine hook
vi.mock('@/hooks/ai/usePREngine', () => ({
  usePREngine: vi.fn(() => ({
    prEvents: [
      {
        id: '1',
        creatorId: 'creator1',
        platform: 'Twitter',
        headline: 'Major Announcement',
        summary: 'A major announcement was made',
        sentimentScore: 80,
        impact: 'major',
        timestamp: '2023-01-01T12:00:00Z',
        isPositive: true,
        url: 'https://example.com'
      },
      {
        id: '2',
        creatorId: 'creator1',
        platform: 'Instagram',
        headline: 'Minor Update',
        summary: 'A minor update was shared',
        sentimentScore: -30,
        impact: 'minor',
        timestamp: '2023-01-02T12:00:00Z',
        isPositive: false,
        url: 'https://example.com'
      }
    ],
    latestScore: 75,
    historicalScores: [
      { timestamp: '2023-01-01T12:00:00Z', score: 75 },
      { timestamp: '2023-01-02T12:00:00Z', score: 60 },
      { timestamp: '2023-01-03T12:00:00Z', score: -20 },
      { timestamp: '2023-01-04T12:00:00Z', score: 10 },
      { timestamp: '2023-01-05T12:00:00Z', score: 50 }
    ],
    isLoading: false,
    isError: false,
    refreshPREvents: vi.fn(),
    refetch: vi.fn()
  }))
}));

// Mock child components
vi.mock('../../pr-trendline/PRTrendlineChart', () => ({
  default: () => <div data-testid="pr-trendline-chart">PRTrendlineChart</div>
}));

vi.mock('../../pr-trendline/PRTrendlineOverlay', () => ({
  default: () => <div data-testid="pr-trendline-overlay">PRTrendlineOverlay</div>
}));

vi.mock('../../pr-trendline/PREventsList', () => ({
  default: () => <div data-testid="pr-events-list">PR Events List</div>
}));

vi.mock('../../pr-trendline/SentimentScoreDisplay', () => ({
  default: () => <div data-testid="sentiment-score">Sentiment Score</div>
}));

vi.mock('../../pr-trendline/MajorEventNotification', () => ({
  default: () => <div data-testid="major-event-notification">Major Event</div>
}));

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }) => (
    <button onClick={onClick} data-testid="refresh-button">{children}</button>
  )
}));

vi.mock('@/components/ui/GlassCard', () => ({
  GlassCard: ({ children, className }) => (
    <div data-testid="glass-card" className={className}>{children}</div>
  )
}));

vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className }) => (
    <div data-testid="loading-state" className={className}>Loading...</div>
  )
}));

describe('PRTrendline', () => {
  it('renders the overlay when showOverlay is true', () => {
    render(<PRTrendline creatorId="123" showOverlay={true} />);
    expect(screen.getByTestId('pr-trendline-overlay')).toBeInTheDocument();
    expect(screen.queryByTestId('pr-trendline-chart')).not.toBeInTheDocument();
  });

  it('renders the chart when showOverlay is false', () => {
    render(<PRTrendline creatorId="123" showOverlay={false} />);
    expect(screen.getByTestId('pr-trendline-chart')).toBeInTheDocument();
    expect(screen.getByTestId('sentiment-score')).toBeInTheDocument();
    expect(screen.queryByTestId('pr-trendline-overlay')).not.toBeInTheDocument();
  });

  it('renders the PR events list', () => {
    render(<PRTrendline creatorId="123" />);
    expect(screen.getByTestId('pr-events-list')).toBeInTheDocument();
  });

  it('shows the refresh button', () => {
    render(<PRTrendline creatorId="123" />);
    expect(screen.getByTestId('refresh-button')).toBeInTheDocument();
  });
});
