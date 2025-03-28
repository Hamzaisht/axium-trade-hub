
import { useQuery } from '@tanstack/react-query';
import { mockAIValuationAPI } from '@/utils/mockApi';

export interface SocialSentimentData {
  overallSentiment: number;
  positiveMentions: number;
  negativeMentions: number;
  keywords: string[];
  sources: Array<{
    name: string;
    sentiment: number;
    volume: number;
  }>;
  trend: Array<{
    date: string;
    sentiment: number;
  }>;
  trust: {
    score: number;
    factors: string[];
  };
  platforms: Array<{
    name: string;
    sentiment: number;
    engagement: number;
  }>;
}

export interface UseSentimentAnalysisProps {
  creatorId?: string;
}

const useSentimentAnalysis = ({ creatorId }: UseSentimentAnalysisProps) => {
  return useQuery({
    queryKey: ['sentiment-analysis', creatorId],
    queryFn: async () => {
      if (!creatorId) {
        throw new Error('Creator ID is required');
      }

      try {
        return await mockAIValuationAPI.getSentimentAnalysis(creatorId);
      } catch (error) {
        console.error('Error fetching sentiment analysis:', error);
        throw error;
      }
    },
    enabled: !!creatorId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 15, // 15 minutes
  });
};

export default useSentimentAnalysis;
