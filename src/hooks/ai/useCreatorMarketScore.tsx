
import { useQuery } from '@tanstack/react-query';
import { useExternalData } from '@/hooks/useExternalData';
import { useSocialSentiment } from './useSocialSentiment';
import { useAnomalyDetection } from './useAnomalyDetection';
import { faker } from '@faker-js/faker';

interface CreatorMarketScoreParams {
  ipoId?: string;
  enabled?: boolean;
}

export interface CreatorMarketScore {
  totalScore: number;
  revenueInfluence: {
    score: number;
    weight: number;
    rawScore: number;
    factors: Array<{name: string, impact: number, description: string}>;
  };
  socialEngagementInfluence: {
    score: number;
    weight: number;
    rawScore: number;
    factors: Array<{name: string, impact: number, description: string}>;
  };
  aiSentimentScore: {
    score: number;
    weight: number;
    rawScore: number;
    factors: Array<{name: string, impact: number, description: string}>;
  };
  priceImpact: {
    recommendedPrice: number;
    priceChange: number;
    priceChangePercent: number;
    confidence: number;
  };
  anomalyDetection: {
    hasAnomalies: boolean;
    anomalyImpact: number;
    adjustedPrice?: number;
  };
  lastUpdated: string;
}

// Mock function to generate Creator Market Score
const mockGetCreatorMarketScore = async (
  ipoId: string,
  externalMetrics: any,
  socialSentiment: any,
  anomalyData: any
): Promise<CreatorMarketScore> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Base score components
  const revenueRawScore = faker.number.int({ min: 50, max: 95 });
  const socialRawScore = faker.number.int({ min: 50, max: 95 });
  const sentimentRawScore = faker.number.int({ min: 40, max: 95 });
  
  // Weights
  const revenueWeight = 0.5; // 50%
  const socialWeight = 0.3;  // 30%
  const sentimentWeight = 0.2; // 20%
  
  // Calculate weighted scores
  const revenueScore = revenueRawScore * revenueWeight;
  const socialScore = socialRawScore * socialWeight;
  const sentimentScore = sentimentRawScore * sentimentWeight;
  
  // Total score
  const totalScore = revenueScore + socialScore + sentimentScore;
  
  // Calculate price impact
  const basePrice = 25.00; // Base token price
  const priceMultiplier = totalScore / 70; // Adjust based on total score
  const recommendedPrice = parseFloat((basePrice * priceMultiplier).toFixed(2));
  const priceChange = parseFloat((recommendedPrice - basePrice).toFixed(2));
  const priceChangePercent = parseFloat(((priceChange / basePrice) * 100).toFixed(2));
  
  return {
    totalScore: parseFloat(totalScore.toFixed(2)),
    revenueInfluence: {
      score: parseFloat(revenueScore.toFixed(2)),
      weight: revenueWeight,
      rawScore: revenueRawScore,
      factors: [
        {
          name: "Annual Revenue",
          impact: faker.number.float({ min: 2, max: 5, fractionDigits: 1 }),
          description: "Strong annual revenue growth"
        },
        {
          name: "Diversification",
          impact: faker.number.float({ min: 1, max: 4, fractionDigits: 1 }),
          description: "Multiple revenue streams show stability"
        },
        {
          name: "Brand Deal Growth",
          impact: faker.number.float({ min: 0.5, max: 3, fractionDigits: 1 }),
          description: "Increasing brand partnership value"
        }
      ]
    },
    socialEngagementInfluence: {
      score: parseFloat(socialScore.toFixed(2)),
      weight: socialWeight,
      rawScore: socialRawScore,
      factors: [
        {
          name: "Engagement Rate",
          impact: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
          description: "Above average engagement across platforms"
        },
        {
          name: "Audience Growth",
          impact: faker.number.float({ min: 0.5, max: 4, fractionDigits: 1 }),
          description: "Steady follower growth on key platforms"
        },
        {
          name: "Content Performance",
          impact: faker.number.float({ min: 0.5, max: 3, fractionDigits: 1 }),
          description: "Recent content performing well"
        }
      ]
    },
    aiSentimentScore: {
      score: parseFloat(sentimentScore.toFixed(2)),
      weight: sentimentWeight,
      rawScore: sentimentRawScore,
      factors: [
        {
          name: "Public Sentiment",
          impact: faker.number.float({ min: 1, max: 4, fractionDigits: 1 }),
          description: "Generally positive public perception"
        },
        {
          name: "Media Coverage",
          impact: faker.number.float({ min: 0.5, max: 3, fractionDigits: 1 }),
          description: "Favorable recent media mentions"
        },
        {
          name: "Controversy Index",
          impact: faker.number.float({ min: -2, max: 2, fractionDigits: 1 }),
          description: "Low controversy levels in past 30 days"
        }
      ]
    },
    priceImpact: {
      recommendedPrice,
      priceChange,
      priceChangePercent,
      confidence: faker.number.int({ min: 75, max: 95 })
    },
    anomalyDetection: {
      hasAnomalies: anomalyData?.detected || false,
      anomalyImpact: anomalyData?.detected ? -0.05 : 0, // 5% negative impact if anomalies detected
      adjustedPrice: anomalyData?.detected ? recommendedPrice * 0.95 : undefined
    },
    lastUpdated: new Date().toISOString()
  };
};

/**
 * Hook to fetch and calculate the Creator Market Score (CMS)
 * CMS = (Revenue Influence * 50%) + (Social Engagement Influence * 30%) + (AI Sentiment Score * 20%)
 */
export const useCreatorMarketScore = ({ ipoId, enabled = true }: CreatorMarketScoreParams) => {
  // Fetch external metrics data (for revenue information)
  const { metrics: externalMetrics, aggregatedMetrics } = useExternalData({
    creatorId: ipoId,
    enabled: !!ipoId && enabled
  });
  
  // Get social sentiment data
  const socialSentimentQuery = useSocialSentiment({
    ipoId,
    enabled: !!ipoId && enabled
  });
  
  // Get anomaly detection data
  const anomalyDetectionQuery = useAnomalyDetection({
    ipoId,
    enabled: !!ipoId && enabled
  });
  
  // The main CMS calculation query
  const cmsQuery = useQuery({
    queryKey: ['creator-market-score', ipoId, externalMetrics?.lastUpdated, socialSentimentQuery.data?.overall],
    queryFn: async () => {
      if (!ipoId) return null;
      
      try {
        // Get the CMS data using our mock function
        return mockGetCreatorMarketScore(
          ipoId, 
          externalMetrics, 
          socialSentimentQuery.data,
          anomalyDetectionQuery.data
        );
      } catch (error) {
        console.error('Error calculating Creator Market Score:', error);
        throw error;
      }
    },
    enabled: !!ipoId && enabled && !!externalMetrics && !!socialSentimentQuery.data,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });
  
  return {
    creatorMarketScore: cmsQuery.data,
    isLoading: cmsQuery.isLoading || socialSentimentQuery.isLoading,
    isError: cmsQuery.isError,
    error: cmsQuery.error,
    refetch: cmsQuery.refetch,
    socialSentiment: socialSentimentQuery.data,
    externalMetrics,
    aggregatedMetrics,
    anomalyData: anomalyDetectionQuery.data
  };
};
