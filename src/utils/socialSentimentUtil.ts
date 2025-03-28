
import { IPO, SentimentTrend } from './mockApi';

export const getSocialSentiment = (ipo: IPO): {
  overall: SentimentTrend;
  metrics: {
    twitter: { score: number; trend: SentimentTrend; volume: number };
    instagram: { score: number; trend: SentimentTrend; volume: number };
    youtube: { score: number; trend: SentimentTrend; volume: number };
  };
  keywords: string[];
} => {
  // Base sentiment (for mock data, we'll generate this randomly)
  const sentimentScores = {
    twitter: Math.random() * 2 - 1, // Between -1 and 1
    instagram: Math.random() * 2 - 1,
    youtube: Math.random() * 2 - 1
  };
  
  // Convert scores to trend categories
  const scoreToTrend = (score: number): SentimentTrend => {
    if (score > 0.3) return "positive";
    if (score < -0.3) return "negative";
    return "neutral";
  };
  
  // Calculate overall trend (weighted average)
  const overallScore = (
    sentimentScores.twitter * 0.35 + 
    sentimentScores.instagram * 0.4 + 
    sentimentScores.youtube * 0.25
  );
  const overallTrend = scoreToTrend(overallScore);
  
  // Generate random volumes
  const volumes = {
    twitter: Math.floor(5000 + Math.random() * 45000),
    instagram: Math.floor(8000 + Math.random() * 92000),
    youtube: Math.floor(3000 + Math.random() * 27000)
  };
  
  // Generate trending keywords
  const positiveKeywords = ['viral', 'trending', 'collaboration', 'launch', 'exclusive'];
  const neutralKeywords = ['announcement', 'update', 'content', 'release', 'feature'];
  const negativeKeywords = ['controversy', 'delay', 'criticism', 'issue', 'problem'];
  
  let keywordPool = [...neutralKeywords];
  if (overallScore > 0.3) {
    keywordPool = [...keywordPool, ...positiveKeywords];
  } else if (overallScore < -0.3) {
    keywordPool = [...keywordPool, ...negativeKeywords];
  }
  
  // Randomly select 3-5 keywords
  const keywords = keywordPool
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 3) + 3);
  
  return {
    overall: overallTrend,
    metrics: {
      twitter: {
        score: sentimentScores.twitter,
        trend: scoreToTrend(sentimentScores.twitter),
        volume: volumes.twitter
      },
      instagram: {
        score: sentimentScores.instagram,
        trend: scoreToTrend(sentimentScores.instagram),
        volume: volumes.instagram
      },
      youtube: {
        score: sentimentScores.youtube,
        trend: scoreToTrend(sentimentScores.youtube),
        volume: volumes.youtube
      }
    },
    keywords
  };
};
