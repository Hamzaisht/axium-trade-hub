
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PRTrendlineChart } from '../PRTrendlineChart';

// Mock Recharts components
vi.mock('recharts', () => ({
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line"></div>,
  XAxis: () => <div data-testid="x-axis"></div>,
  YAxis: () => <div data-testid="y-axis"></div>,
  Tooltip: () => <div data-testid="tooltip"></div>,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  ReferenceLine: () => <div data-testid="reference-line"></div>,
  Label: () => <div data-testid="label"></div>,
  Scatter: () => <div data-testid="scatter"></div>
}));

// Mock the CustomTooltip component
vi.mock('../CustomTooltip', () => ({
  __esModule: true,
  default: () => <div data-testid="custom-tooltip"></div>,
  CustomTooltip: () => <div data-testid="custom-tooltip"></div>
}));

describe('PRTrendlineChart', () => {
  it('should show a message when no data is available', () => {
    render(<PRTrendlineChart trendlineData={[]} eventPoints={[]} />);
    expect(screen.getByText('No PR trend data available')).toBeInTheDocument();
  });

  it('should render chart components when data is available', () => {
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
    
    render(<PRTrendlineChart trendlineData={trendlineData} eventPoints={eventPoints} />);
    
    expect(screen.queryByText('No PR trend data available')).not.toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('reference-line')).toBeInTheDocument();
    expect(screen.getByTestId('scatter')).toBeInTheDocument();
  });
});
