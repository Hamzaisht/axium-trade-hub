
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
        // Since getSentimentAnalysis doesn't exist in the mockAIValuationAPI, 
        // we'll use getSocialSentiment and transform the data
        const socialData = await mockAIValuationAPI.getSocialSentiment(creatorId);
        
        // Transform the social sentiment data into the CreatorSentimentData shape
        return {
          overallSentiment: Math.round((socialData.metrics.twitter.score + 
                                       socialData.metrics.instagram.score + 
                                       socialData.metrics.youtube.score) / 3 * 100),
          positiveMentions: 12458, // Mock data
          negativeMentions: 3241,  // Mock data
          keywords: socialData.keywords,
          lastUpdated: new Date().toISOString()
        };
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
