
import { useQuery } from '@tanstack/react-query';
import { mockAIValuationAPI } from '@/utils/mockApi';
import { useExternalData } from '@/hooks/useExternalData';
import { useSocialSentiment } from './useSocialSentiment';
import { useAnomalyDetection } from './useAnomalyDetection';

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
        // Get the raw CMS data from our API
        const cmsData = await mockAIValuationAPI.getCreatorMarketScore(
          ipoId, 
          externalMetrics, 
          socialSentimentQuery.data,
          anomalyDetectionQuery.data
        );
        
        // Apply anomaly adjustments if needed
        if (anomalyDetectionQuery.data?.detected && anomalyDetectionQuery.data.riskScore > 50) {
          // Calculate anomaly impact percentage (negative impact up to -30% for severe anomalies)
          const anomalyImpact = -(anomalyDetectionQuery.data.riskScore / 100) * 0.3;
          
          // Adjust the price based on detected anomalies
          const adjustedPrice = cmsData.priceImpact.recommendedPrice * (1 + anomalyImpact);
          
          return {
            ...cmsData,
            anomalyDetection: {
              hasAnomalies: true,
              anomalyImpact,
              adjustedPrice
            },
            priceImpact: {
              ...cmsData.priceImpact,
              recommendedPrice: adjustedPrice
            }
          };
        }
        
        return cmsData;
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
