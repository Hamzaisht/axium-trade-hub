
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PRTrendline from '../../PRTrendline';

// Mock the hooks
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
        isPositive: true
      }
    ],
    latestScore: 75,
    historicalScores: [
      { timestamp: '2023-01-01T12:00:00Z', score: 75 }
    ],
    isLoading: false,
    isError: false,
    refreshPREvents: vi.fn()
  }))
}));

// Mock the components
vi.mock('../PRTrendlineChart', () => ({
  PRTrendlineChart: () => <div data-testid="pr-trendline-chart"></div>
}));

vi.mock('../PRTrendlineOverlay', () => ({
  PRTrendlineOverlay: () => <div data-testid="pr-trendline-overlay"></div>
}));

vi.mock('../PREventsList', () => ({
  PREventsList: () => <div data-testid="pr-events-list"></div>
}));

vi.mock('../SentimentScoreDisplay', () => ({
  SentimentScoreDisplay: () => <div data-testid="sentiment-score-display"></div>
}));

vi.mock('../MajorEventNotification', () => ({
  MajorEventNotification: () => <div data-testid="major-event-notification"></div>
}));

describe('PRTrendline', () => {
  it('should render overlay mode when showOverlay is true', () => {
    render(<PRTrendline creatorId="creator1" showOverlay={true} />);
    expect(screen.getByTestId('pr-trendline-overlay')).toBeInTheDocument();
    expect(screen.queryByTestId('pr-trendline-chart')).not.toBeInTheDocument();
  });

  it('should render standard mode when showOverlay is false', () => {
    render(<PRTrendline creatorId="creator1" />);
    expect(screen.queryByTestId('pr-trendline-overlay')).not.toBeInTheDocument();
    expect(screen.getByTestId('sentiment-score-display')).toBeInTheDocument();
    expect(screen.getByTestId('pr-trendline-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pr-events-list')).toBeInTheDocument();
  });

  it('should call refreshPREvents when refresh button is clicked', () => {
    const { usePREngine } = require('@/hooks/ai/usePREngine');
    const mockRefresh = vi.fn();
    usePREngine.mockReturnValue({
      prEvents: [],
      latestScore: 0,
      historicalScores: [],
      isLoading: false,
      isError: false,
      refreshPREvents: mockRefresh
    });
    
    render(<PRTrendline creatorId="creator1" />);
    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshButton);
    
    expect(mockRefresh).toHaveBeenCalled();
  });

  it('should show loading state when isLoading is true', () => {
    const { usePREngine } = require('@/hooks/ai/usePREngine');
    usePREngine.mockReturnValue({
      prEvents: [],
      latestScore: null,
      historicalScores: [],
      isLoading: true,
      isError: false,
      refreshPREvents: vi.fn()
    });
    
    render(<PRTrendline creatorId="creator1" />);
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
  });

  it('should show error state when isError is true', () => {
    const { usePREngine } = require('@/hooks/ai/usePREngine');
    usePREngine.mockReturnValue({
      prEvents: [],
      latestScore: null,
      historicalScores: [],
      isLoading: false,
      isError: true,
      refreshPREvents: vi.fn()
    });
    
    render(<PRTrendline creatorId="creator1" />);
    expect(screen.getByText(/failed to load pr data/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });
});
