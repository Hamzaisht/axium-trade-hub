
import { useQuery } from '@tanstack/react-query';
import { mockAIValuationAPI } from '@/utils/mockApi';

export interface SocialSentimentData {
  overall: number;
  overallSentiment?: number;
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
  trust: number;
  platforms: {
    [key: string]: {
      sentiment: number;
      engagement: number;
    };
  };
}

export interface UseSocialSentimentProps {
  ipoId?: string;
  creatorId?: string;
}

export const useSocialSentiment = ({ ipoId, creatorId }: UseSocialSentimentProps) => {
  const id = ipoId || creatorId;
  
  return useQuery<SocialSentimentData, Error>({
    queryKey: ['social-sentiment', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('ID is required');
      }
      
      try {
        const data = await mockAIValuationAPI.getSocialSentiment(id);
        // Ensure required fields are present
        return {
          ...data,
          positiveMentions: data.positiveMentions || 0,
          negativeMentions: data.negativeMentions || 0,
          sources: data.sources || [],
          trend: data.trend || [],
          trust: data.trust || 0,
          platforms: data.platforms || {}
        };
      } catch (error) {
        console.error('Error fetching social sentiment:', error);
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
