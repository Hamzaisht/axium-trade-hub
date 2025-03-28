
import { useQuery } from '@tanstack/react-query';

export interface SocialSentimentData {
  overall: number;
  positive: number;
  negative: number;
  neutral: number;
  trending: 'up' | 'down' | 'stable';
  lastUpdated: string;
  sources: Array<{
    platform: string;
    sentiment: number;
    volume: number;
  }>;
}

// Mock function to simulate social sentiment API call
const fetchSocialSentiment = async (ipoId: string): Promise<SocialSentimentData> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Generate consistent but seemingly random data based on creatorId
  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };
  
  const hash = hashCode(ipoId);
  
  // Base sentiment (40-80)
  const baseSentiment = 40 + (hash % 40);
  
  // Trending direction
  const trendDirections: ['up', 'down', 'stable'] = ['up', 'down', 'stable'];
  const trendIndex = hash % 3;
  
  // Calculate distribution
  const positiveRatio = baseSentiment / 100;
  const remainingRatio = 1 - positiveRatio;
  const negativeRatio = remainingRatio * 0.7;
  const neutralRatio = remainingRatio * 0.3;
  
  // Social platforms
  const platforms = [
    {name: 'Twitter', baseSentiment: (hash % 30) + 40},
    {name: 'Instagram', baseSentiment: (hash % 20) + 50},
    {name: 'TikTok', baseSentiment: (hash % 25) + 55},
    {name: 'YouTube', baseSentiment: (hash % 15) + 60},
    {name: 'Reddit', baseSentiment: (hash % 40) + 30},
  ];
  
  return {
    overall: baseSentiment,
    positive: Math.round(positiveRatio * 100),
    negative: Math.round(negativeRatio * 100),
    neutral: Math.round(neutralRatio * 100),
    trending: trendDirections[trendIndex],
    lastUpdated: new Date().toISOString(),
    sources: platforms.map(platform => ({
      platform: platform.name,
      sentiment: platform.baseSentiment,
      volume: (hash % 1000) * (platforms.indexOf(platform) + 1)
    }))
  };
};

export interface UseSocialSentimentProps {
  ipoId: string;
}

export const useSocialSentiment = ({ ipoId }: UseSocialSentimentProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['social-sentiment', ipoId],
    queryFn: () => fetchSocialSentiment(ipoId),
    enabled: !!ipoId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
  
  return {
    sentimentData: data,
    isLoading,
    error
  };
};
