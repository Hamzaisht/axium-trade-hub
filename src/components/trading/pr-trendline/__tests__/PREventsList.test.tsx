
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PREventsList } from '../PREventsList';
import { PREvent } from '../utils';

// Mock the tooltip component since it uses radix UI
vi.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Tooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('PREventsList', () => {
  it('should display message when no events are available', () => {
    render(<PREventsList events={[]} />);
    expect(screen.getByText('No recent PR events detected')).toBeInTheDocument();
  });

  it('should display message when events is undefined', () => {
    render(<PREventsList />);
    expect(screen.getByText('No recent PR events detected')).toBeInTheDocument();
  });

  it('should display events when provided', () => {
    const mockEvents: PREvent[] = [
      {
        id: '1',
        creatorId: 'creator1',
        platform: 'Twitter',
        headline: 'Big Announcement',
        summary: 'Creator made a big announcement',
        sentimentScore: 80,
        impact: 'major',
        timestamp: '2023-06-01T12:00:00Z',
        isPositive: true
      },
      {
        id: '2',
        creatorId: 'creator1',
        platform: 'Instagram',
        headline: 'Minor Update',
        summary: 'Creator shared a minor update',
        sentimentScore: -30,
        impact: 'minor',
        timestamp: '2023-06-02T12:00:00Z',
        isPositive: false
      }
    ];
    
    render(<PREventsList events={mockEvents} />);
    
    expect(screen.getByText('Big Announcement')).toBeInTheDocument();
    expect(screen.getByText('Minor Update')).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('Instagram')).toBeInTheDocument();
    expect(screen.getByText('major')).toBeInTheDocument();
    expect(screen.getByText('minor')).toBeInTheDocument();
  });

  it('should only display the first 5 events when more are provided', () => {
    const mockEvents: PREvent[] = Array(10).fill(0).map((_, i) => ({
      id: `${i}`,
      creatorId: 'creator1',
      platform: `Platform ${i}`,
      headline: `Event ${i}`,
      summary: `Summary ${i}`,
      sentimentScore: i % 2 === 0 ? 50 : -50,
      impact: i % 3 === 0 ? 'major' : i % 3 === 1 ? 'moderate' : 'minor',
      timestamp: `2023-06-0${i+1}T12:00:00Z`,
      isPositive: i % 2 === 0
    }));
    
    render(<PREventsList events={mockEvents} />);
    
    // Check first 5 events are displayed
    for (let i = 0; i < 5; i++) {
      expect(screen.getByText(`Event ${i}`)).toBeInTheDocument();
    }
    
    // Check events beyond 5 are not displayed
    for (let i = 5; i < 10; i++) {
      expect(screen.queryByText(`Event ${i}`)).not.toBeInTheDocument();
    }
  });
});
