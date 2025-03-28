
async getSocialSentiment(ipoId: string): Promise<{
  overall: SentimentTrend;
  metrics: {
    twitter: { score: number; trend: SentimentTrend; volume: number };
    instagram: { score: number; trend: SentimentTrend; volume: number };
    youtube: { score: number; trend: SentimentTrend; volume: number };
  };
  keywords: string[];
}> {
  await delay(300);
  const ipo = mockIPOs.find(item => item.id === ipoId);
  if (!ipo) throw new Error(`IPO with id ${ipoId} not found`);

  // Get the result from the utility function
  const result = getSocialSentimentUtil(ipo);
  
  // Ensure all numeric values are properly typed as numbers
  return {
    overall: result.overall,
    metrics: {
      twitter: {
        score: Number(result.metrics.twitter.score), // Convert to number
        trend: result.metrics.twitter.trend,
        volume: Number(result.metrics.twitter.volume) // Convert volume to number
      },
      instagram: {
        score: Number(result.metrics.instagram.score), // Convert to number
        trend: result.metrics.instagram.trend,
        volume: Number(result.metrics.instagram.volume) // Convert volume to number
      },
      youtube: {
        score: Number(result.metrics.youtube.score), // Convert to number
        trend: result.metrics.youtube.trend,
        volume: Number(result.metrics.youtube.volume) // Convert volume to number
      }
    },
    keywords: result.keywords
  };
}
