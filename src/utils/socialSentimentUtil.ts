
// Adding or updating the getSocialSentiment function to accept an ipoId parameter
export function getSocialSentiment(ipoId?: string) {
  // Generate random sentiment data
  const overall = Math.random() > 0.3 ? 
    (Math.random() > 0.5 ? 'very_positive' : 'positive') : 
    (Math.random() > 0.5 ? 'negative' : 'very_negative');
  
  // Use ipoId if needed for any specific calculations
  const useIpoSpecificData = ipoId && ipoId.includes('high');
  
  const metrics = {
    twitter: {
      trend: Math.random() > 0.5 ? 'positive' : 'negative',
      score: Math.round(Math.random() * 100),
      volume: Math.round(Math.random() * 10000) + 1000
    },
    instagram: {
      trend: Math.random() > 0.6 ? 'positive' : 'negative',
      score: Math.round(Math.random() * 100),
      volume: Math.round(Math.random() * 8000) + 2000
    },
    youtube: {
      trend: Math.random() > 0.4 ? 'positive' : 'negative',
      score: Math.round(Math.random() * 100),
      volume: Math.round(Math.random() * 5000) + 500
    }
  };
  
  const keywords = [
    'innovative',
    'creative',
    'authentic',
    'engaging',
    'trending',
    'viral'
  ];
  
  return {
    overall,
    metrics,
    keywords: keywords.sort(() => Math.random() - 0.5).slice(0, 4),
    lastUpdated: new Date().toISOString()
  };
}
