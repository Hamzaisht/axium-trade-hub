
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

export const useCreatorMarketScore = ({ creatorId }: UseCreatorMarketScoreProps) => {
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
              marketScoreData.totalScore * 0.7 + sentimentImpact * 30
            )
          );
          
          // Return enhanced market score with sentiment influence
          return {
            overall: Math.round(adjustedScore),
            components: {
              sentiment: sentimentData.overallSentiment || 50,
              social: 75,  // Mock values
              brand: 82,
              content: 68,
              stability: 77,
              growth: 85
            },
            recommendation: "Strong Hold",
            riskLevel: "low" as const,
            potentialUpside: 18.5,
            insights: [
              "Strong social media engagement trends",
              "Growing audience demographics",
              "Recent content performing above average",
              `Score adjusted by ${sentimentImpact > 0.5 ? 'positive' : 'negative'} sentiment analysis.`
            ],
            lastUpdated: new Date().toISOString()
          };
        }
        
        // Default return if no sentiment data available
        return {
          overall: marketScoreData.totalScore,
          components: {
            sentiment: 65,  // Mock values
            social: 75,
            brand: 80,
            content: 70,
            stability: 75,
            growth: 82
          },
          recommendation: "Buy",
          riskLevel: "low" as const,
          potentialUpside: 15.5,
          insights: [
            "Strong social media presence",
            "Consistent content schedule",
            "Positive audience growth trends"
          ],
          lastUpdated: new Date().toISOString()
        };
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
