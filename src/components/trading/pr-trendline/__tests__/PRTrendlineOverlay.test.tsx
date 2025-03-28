
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PRTrendlineOverlay } from '../PRTrendlineOverlay';
import { PREvent } from '../utils';

// Mock Recharts components
vi.mock('recharts', () => ({
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line"></div>,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  ReferenceArea: ({ x }: { x: string }) => <div data-testid={`reference-area-${x}`}></div>,
  Scatter: () => <div data-testid="scatter"></div>
}));

describe('PRTrendlineOverlay', () => {
  const trendlineData = [
    { date: 'Jan 1', value: 50, fullDate: '2023-01-01', rawScore: 0 },
    { date: 'Jan 2', value: 60, fullDate: '2023-01-02', rawScore: 20 }
  ];
  
  const eventPoints = [
    { 
      date: 'Jan 1', 
      fullDate: '2023-01-01', 
      eventValue: 50, 
      eventImpact: 'major' as const, 
      eventHeadline: 'Event 1', 
      eventIsPositive: true, 
      eventId: '1',
      rawScore: 0
    }
  ];
  
  const prEvents: PREvent[] = [
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
      isPositive: false
    }
  ];

  it('should render overlay components correctly', () => {
    render(
      <PRTrendlineOverlay 
        trendlineData={trendlineData} 
        eventPoints={eventPoints}
        prEvents={prEvents}
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line')).toBeInTheDocument();
    
    // Only major events get reference areas
    const majorEvent = prEvents.find(e => e.impact === 'major');
    if (majorEvent) {
      const dateStr = new Date(majorEvent.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      expect(screen.getByTestId(`reference-area-${dateStr}`)).toBeInTheDocument();
    }
    
    expect(screen.getByTestId('scatter')).toBeInTheDocument();
  });

  it('should handle empty prEvents gracefully', () => {
    render(
      <PRTrendlineOverlay 
        trendlineData={trendlineData} 
        eventPoints={eventPoints}
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line')).toBeInTheDocument();
    expect(screen.getByTestId('scatter')).toBeInTheDocument();
  });
});
