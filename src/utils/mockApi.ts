
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
        score: Number(result.metrics.twitter.score),
        trend: result.metrics.twitter.trend,
        volume: Number(result.metrics.twitter.volume)
      },
      instagram: {
        score: Number(result.metrics.instagram.score),
        trend: result.metrics.instagram.trend,
        volume: Number(result.metrics.instagram.volume)
      },
      youtube: {
        score: Number(result.metrics.youtube.score),
        trend: result.metrics.youtube.trend,
        volume: Number(result.metrics.youtube.volume)
      }
    },
    keywords: result.keywords
  };
}
