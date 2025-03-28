
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSocialSentiment } from './useSocialSentiment';

interface SocialEngagement {
  followers: number;
  engagement: number;
  growth: number;
}

interface BrandDealMetrics {
  deals: number;
  value: number;
  growth: number;
}

interface ContentMetrics {
  views: number;
  frequency: number;
  engagement: number;
}

interface CreatorMarketScore {
  overall: number;
  components: {
    social: number;
    brand: number;
    content: number;
    sentiment: number;
    stability: number;
  };
  details: {
    social: SocialEngagement;
    brand: BrandDealMetrics;
    content: ContentMetrics;
  };
  lastUpdated: string;
}

// Mock API function to get creator market score
const fetchCreatorMarketScore = async (creatorId: string): Promise<CreatorMarketScore> => {
  // Simulate API request
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate consistent but seemingly random scores based on creatorId
  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };
  
  const hash = hashCode(creatorId);
  const baseValue = (hash % 50) + 50; // Between 50-99
  const randomize = (base: number, range = 10) => Math.max(0, Math.min(100, base + (Math.sin(hash * 0.1) * range)));
  
  return {
    overall: baseValue,
    components: {
      social: randomize(baseValue, 15),
      brand: randomize(baseValue - 5, 15),
      content: randomize(baseValue + 5, 15),
      sentiment: randomize(baseValue - 10, 20),
      stability: randomize(baseValue + 10, 15),
    },
    details: {
      social: {
        followers: Math.floor(hash % 10000000) + 500000,
        engagement: randomize(baseValue, 20),
        growth: (hash % 15) + 1,
      },
      brand: {
        deals: (hash % 20) + 5,
        value: Math.floor((hash % 1000000) + 500000),
        growth: (hash % 20) - 5,
      },
      content: {
        views: Math.floor(hash % 50000000) + 1000000,
        frequency: (hash % 10) + 1,
        engagement: randomize(baseValue, 20),
      }
    },
    lastUpdated: new Date().toISOString(),
  };
};

export interface UseSocialSentimentProps {
  creatorId: string;
}

export const useCreatorMarketScore = (creatorId: string) => {
  const { sentimentData, isLoading: isSentimentLoading } = useSocialSentiment({ creatorId });
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['creatorMarketScore', creatorId],
    queryFn: () => fetchCreatorMarketScore(creatorId),
    enabled: !!creatorId,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
  
  // Calculate adjusted score based on sentiment data if available
  const adjustedScore = React.useMemo(() => {
    if (!data || !sentimentData) return null;
    
    // Blend the AI sentiment data with the market score
    const sentimentImpact = sentimentData.overall - 50; // Range: -50 to +50
    const sentimentWeight = 0.2; // 20% weight for sentiment data
    
    return {
      ...data,
      overall: Math.min(
        100, 
        Math.max(0, data.overall + (sentimentImpact * sentimentWeight))
      ),
      components: {
        ...data.components,
        sentiment: sentimentData.overall,
      }
    };
  }, [data, sentimentData]);
  
  return {
    score: adjustedScore || data,
    isLoading: isLoading || isSentimentLoading,
    error,
    refetch
  };
};

export default useCreatorMarketScore;
