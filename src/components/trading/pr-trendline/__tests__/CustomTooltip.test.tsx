
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CustomTooltip from '../CustomTooltip';

describe('CustomTooltip', () => {
  it('should render null when not active', () => {
    const { container } = render(<CustomTooltip active={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render null when payload is missing', () => {
    const { container } = render(<CustomTooltip active={true} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render null when payload is empty', () => {
    const { container } = render(<CustomTooltip active={true} payload={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render tooltip content when active with payload', () => {
    const mockPayload = [{
      payload: {
        date: 'Jan 1',
        rawScore: 75,
      }
    }];
    
    render(<CustomTooltip active={true} payload={mockPayload} label="Jan 1" />);
    
    expect(screen.getByText('Jan 1')).toBeInTheDocument();
    expect(screen.getByText(/Sentiment:/)).toBeInTheDocument();
    expect(screen.getByText(/Raw Score: 75/)).toBeInTheDocument();
  });

  it('should display the correct sentiment label based on score', () => {
    const mockPayload = [{
      payload: {
        date: 'Jan 1',
        rawScore: 75,
      }
    }];
    
    render(<CustomTooltip active={true} payload={mockPayload} label="Jan 1" />);
    expect(screen.getByText(/Very Positive/)).toBeInTheDocument();
    
    const mockNegativePayload = [{
      payload: {
        date: 'Jan 1',
        rawScore: -75,
      }
    }];
    
    render(<CustomTooltip active={true} payload={mockNegativePayload} label="Jan 1" />);
    expect(screen.getByText(/Negative/)).toBeInTheDocument();
  });
});
