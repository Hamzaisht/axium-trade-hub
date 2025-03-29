
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SentimentScoreDisplay from '../SentimentScoreDisplay';

describe('SentimentScoreDisplay', () => {
  it('should render the normalized score correctly', () => {
    render(<SentimentScoreDisplay score={50} eventCount={10} />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('should render the correct sentiment label for positive score', () => {
    render(<SentimentScoreDisplay score={80} eventCount={10} />);
    expect(screen.getByText('Very Positive')).toBeInTheDocument();
  });

  it('should render the correct sentiment label for negative score', () => {
    render(<SentimentScoreDisplay score={-80} eventCount={10} />);
    expect(screen.getByText('Negative')).toBeInTheDocument();
  });

  it('should render the event count correctly', () => {
    render(<SentimentScoreDisplay score={0} eventCount={5} />);
    expect(screen.getByText('Based on 5 PR events')).toBeInTheDocument();
  });

  it('should apply the correct color class based on sentiment', () => {
    // Positive sentiment
    render(<SentimentScoreDisplay score={80} eventCount={10} />);
    const scoreElement = screen.getByText('90%');
    expect(scoreElement).toHaveClass('text-green-500');

    // Render again with negative sentiment
    render(<SentimentScoreDisplay score={-80} eventCount={10} />);
    const negativeScoreElement = screen.getByText('10%');
    expect(negativeScoreElement).toHaveClass('text-red-500');
  });
});
