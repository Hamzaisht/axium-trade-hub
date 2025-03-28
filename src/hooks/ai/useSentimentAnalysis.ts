
import { useQuery } from '@tanstack/react-query';
import { mockAIValuationAPI } from '@/utils/mockApi';

export interface CreatorSentimentData {
  overallSentiment: number;
  positiveMentions: number;
  negativeMentions: number;
  keywords: string[];
  lastUpdated: string;
}

export interface UseSentimentAnalysisProps {
  creatorId?: string;
}

export const useSentimentAnalysis = ({ creatorId }: UseSentimentAnalysisProps) => {
  return useQuery<CreatorSentimentData, Error>({
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

// Also export as default for backward compatibility
export default useSentimentAnalysis;
