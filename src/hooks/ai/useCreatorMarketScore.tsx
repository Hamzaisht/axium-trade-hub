
import { useQuery } from '@tanstack/react-query';
import { mockAIValuationAPI } from '@/utils/mockApi';
import { useSentimentAnalysis } from './useSentimentAnalysis';

export interface MarketScoreFactors {
  sentiment: number;
  social: number;
  brand: number;
  content: number;
  stability: number;
  growth: number;
}

export interface CreatorMarketScore {
  overall: number;
  components: {
    sentiment: number;
    social: number;
    brand: number;
    content: number;
    stability: number;
    growth: number;
  };
  recommendation: string;
  riskLevel: 'low' | 'medium' | 'high';
  potentialUpside: number;
  insights: string[];
  lastUpdated: string;
}

export interface UseCreatorMarketScoreProps {
  creatorId?: string;
}

export const useCreatorMarketScore = (creatorId: string) => {
  const { data: sentimentData, isLoading: sentimentLoading } = useSentimentAnalysis({ creatorId });
  
  return useQuery({
    queryKey: ['creator-market-score', creatorId],
    queryFn: async () => {
      if (!creatorId) {
        throw new Error('Creator ID is required');
      }
      
      try {
        // Fetch market score data
        const marketScoreData = await mockAIValuationAPI.getCreatorMarketScore(creatorId);
        
        // Incorporate sentiment data if available
        if (sentimentData) {
          const sentimentImpact = (sentimentData.overallSentiment || 50) / 100;
          
          // Adjust overall score with sentiment data (weighted 30%)
          const adjustedScore = Math.min(
            100, 
            Math.max(
              0, 
              marketScoreData.overall * 0.7 + sentimentImpact * 30
            )
          );
          
          // Return enhanced market score with sentiment influence
          return {
            ...marketScoreData,
            overall: Math.round(adjustedScore),
            insights: [
              ...marketScoreData.insights,
              `Score adjusted by ${sentimentImpact > 0.5 ? 'positive' : 'negative'} sentiment analysis.`
            ]
          };
        }
        
        return marketScoreData;
      } catch (error) {
        console.error('Error fetching creator market score:', error);
        throw error;
      }
    },
    enabled: !!creatorId && !sentimentLoading,
    staleTime: 1000 * 60 * 15, // 15 minutes
    refetchInterval: 1000 * 60 * 30, // 30 minutes
  });
};
