
import { IPO } from './mockApi';
import { faker } from '@faker-js/faker';

// Define sentiment trend types
export type SentimentTrend = 'positive' | 'negative' | 'neutral';

// Utility to generate sentiment data
export const getSocialSentiment = (ipo: IPO) => {
  // Generate random sentiment scores
  const twitterScore = faker.number.int({ min: 20, max: 100 });
  const instagramScore = faker.number.int({ min: 20, max: 100 });
  const youtubeScore = faker.number.int({ min: 20, max: 100 });
  
  // Determine trends
  const getTrend = (score: number): SentimentTrend => {
    if (score > 70) return 'positive';
    if (score < 50) return 'negative';
    return 'neutral';
  };
  
  // Calculate overall score as weighted average
  const overall = Math.round((twitterScore * 0.4 + instagramScore * 0.3 + youtubeScore * 0.3));
  
  // Generate related keywords
  const positiveKeywords = ['talented', 'inspiring', 'authentic', 'innovative', 'engaging'];
  const negativeKeywords = ['overrated', 'controversial', 'disappointing', 'declining', 'inconsistent'];
  const neutralKeywords = ['trending', 'active', 'diverse', 'traditional', 'mainstream'];
  
  let keywords;
  if (overall > 70) {
    keywords = faker.helpers.arrayElements(positiveKeywords, faker.number.int({ min: 2, max: 4 }));
  } else if (overall < 50) {
    keywords = faker.helpers.arrayElements(negativeKeywords, faker.number.int({ min: 2, max: 4 }));
  } else {
    keywords = faker.helpers.arrayElements([...positiveKeywords, ...negativeKeywords, ...neutralKeywords], 
      faker.number.int({ min: 3, max: 5 }));
  }
  
  return {
    overall: getTrend(overall),
    metrics: {
      twitter: {
        score: twitterScore.toString(),
        trend: getTrend(twitterScore),
        volume: faker.number.int({ min: 1000, max: 100000 }).toString()
      },
      instagram: {
        score: instagramScore.toString(),
        trend: getTrend(instagramScore),
        volume: faker.number.int({ min: 1000, max: 100000 }).toString()
      },
      youtube: {
        score: youtubeScore.toString(),
        trend: getTrend(youtubeScore),
        volume: faker.number.int({ min: 500, max: 50000 }).toString()
      }
    },
    keywords
  };
};
