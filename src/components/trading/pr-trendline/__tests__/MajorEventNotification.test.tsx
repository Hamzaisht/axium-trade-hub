
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MajorEventNotification from '../MajorEventNotification';

describe('MajorEventNotification', () => {
  it('should render null when event is not provided', () => {
    // @ts-ignore - Testing null case
    const { container } = render(<MajorEventNotification />);
    expect(container.firstChild).toBeNull();
  });

  it('should render positive event notification correctly', () => {
    const positiveEvent = {
      isPositive: true,
      headline: 'Great news for fans!',
      timestamp: '2023-06-01T12:00:00Z'
    };
    
    render(<MajorEventNotification event={positiveEvent} />);
    
    expect(screen.getByText('Positive PR Event')).toBeInTheDocument();
    expect(screen.getByText('Major Impact')).toBeInTheDocument();
    expect(screen.getByText('Great news for fans!')).toBeInTheDocument();
    
    // Check for positive styling
    const notificationDiv = screen.getByText('Positive PR Event').closest('div')?.parentElement;
    expect(notificationDiv).toHaveClass('border-green-200');
    expect(notificationDiv).toHaveClass('bg-green-50');
  });

  it('should render negative event notification correctly', () => {
    const negativeEvent = {
      isPositive: false,
      headline: 'Controversy erupts!',
      timestamp: '2023-06-01T12:00:00Z'
    };
    
    render(<MajorEventNotification event={negativeEvent} />);
    
    expect(screen.getByText('Negative PR Event')).toBeInTheDocument();
    expect(screen.getByText('Major Impact')).toBeInTheDocument();
    expect(screen.getByText('Controversy erupts!')).toBeInTheDocument();
    
    // Check for negative styling
    const notificationDiv = screen.getByText('Negative PR Event').closest('div')?.parentElement;
    expect(notificationDiv).toHaveClass('border-red-200');
    expect(notificationDiv).toHaveClass('bg-red-50');
  });

  it('should format the timestamp correctly', () => {
    const event = {
      isPositive: true,
      headline: 'Sample headline',
      timestamp: '2023-06-01T12:00:00Z'
    };
    
    render(<MajorEventNotification event={event} />);
    
    // This will depend on the user's locale, so we just check for presence of timestamp
    expect(screen.getByText(/6\/1\/2023/)).toBeInTheDocument();
  });
});
