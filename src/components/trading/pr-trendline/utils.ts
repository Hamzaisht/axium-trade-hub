
/**
 * Normalize sentiment scores from -100/+100 to 0-100 scale
 */
export const normalizeSentimentScore = (score: number): number => {
  return (score + 100) / 2;
};

/**
 * Get sentiment color based on score
 */
export const getSentimentColor = (score: number): string => {
  const normalizedScore = normalizeSentimentScore(score);
  if (normalizedScore >= 75) return 'text-green-500';
  if (normalizedScore >= 50) return 'text-blue-500';
  if (normalizedScore >= 25) return 'text-yellow-500';
  return 'text-red-500';
};

/**
 * Get sentiment label based on score
 */
export const getSentimentLabel = (score: number): string => {
  const normalizedScore = normalizeSentimentScore(score);
  if (normalizedScore >= 75) return 'Very Positive';
  if (normalizedScore >= 50) return 'Positive';
  if (normalizedScore >= 25) return 'Neutral';
  return 'Negative';
};
