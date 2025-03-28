
import { describe, it, expect } from 'vitest';
import { 
  normalizeSentimentScore, 
  getSentimentColor, 
  getSentimentLabel 
} from '../utils';

describe('PR Trendline Utils', () => {
  describe('normalizeSentimentScore', () => {
    it('should normalize -100 to 0', () => {
      expect(normalizeSentimentScore(-100)).toBe(0);
    });

    it('should normalize 0 to 50', () => {
      expect(normalizeSentimentScore(0)).toBe(50);
    });

    it('should normalize 100 to 100', () => {
      expect(normalizeSentimentScore(100)).toBe(100);
    });

    it('should handle intermediate values correctly', () => {
      expect(normalizeSentimentScore(-50)).toBe(25);
      expect(normalizeSentimentScore(50)).toBe(75);
    });
  });

  describe('getSentimentColor', () => {
    it('should return red for very negative scores', () => {
      expect(getSentimentColor(-90)).toBe('text-red-500');
    });

    it('should return yellow for neutral-negative scores', () => {
      expect(getSentimentColor(-40)).toBe('text-yellow-500');
    });

    it('should return blue for neutral-positive scores', () => {
      expect(getSentimentColor(20)).toBe('text-blue-500');
    });

    it('should return green for very positive scores', () => {
      expect(getSentimentColor(80)).toBe('text-green-500');
    });
  });

  describe('getSentimentLabel', () => {
    it('should return "Negative" for very negative scores', () => {
      expect(getSentimentLabel(-90)).toBe('Negative');
    });

    it('should return "Neutral" for neutral-negative scores', () => {
      expect(getSentimentLabel(-40)).toBe('Neutral');
    });

    it('should return "Positive" for neutral-positive scores', () => {
      expect(getSentimentLabel(20)).toBe('Positive');
    });

    it('should return "Very Positive" for very positive scores', () => {
      expect(getSentimentLabel(80)).toBe('Very Positive');
    });
  });
});
