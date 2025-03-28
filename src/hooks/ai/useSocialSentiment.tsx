
import { useQuery } from '@tanstack/react-query';
import { mockAIValuationAPI } from '@/utils/mockApi';
import { SocialSentimentData } from '@/types';

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
        const result = await mockAIValuationAPI.getSocialSentiment(id);
        
        // Transform the API result to match the SocialSentimentData interface
        return {
          overall: 75, // Default score as number for overall sentiment
          overallSentiment: 75, // Provide this for backward compatibility
          positiveMentions: 1200,
          negativeMentions: 300,
          keywords: result.keywords || [],
          sources: [
            { name: 'Twitter', sentiment: 78, volume: 3500 },
            { name: 'Instagram', sentiment: 82, volume: 5200 },
            { name: 'Youtube', sentiment: 71, volume: 2100 }
          ],
          trend: [
            { date: '2023-01-01', sentiment: 68 },
            { date: '2023-02-01', sentiment: 72 },
            { date: '2023-03-01', sentiment: 75 }
          ],
          trust: 82,
          metrics: {
            twitter: { score: result.metrics.twitter.score * 100, volume: result.metrics.twitter.volume },
            instagram: { score: result.metrics.instagram.score * 100, volume: result.metrics.instagram.volume },
            youtube: { score: result.metrics.youtube.score * 100, volume: result.metrics.youtube.volume }
          },
          platforms: {
            twitter: { sentiment: result.metrics.twitter.score * 100, engagement: 7.2 },
            instagram: { sentiment: result.metrics.instagram.score * 100, engagement: 8.4 },
            youtube: { sentiment: result.metrics.youtube.score * 100, engagement: 6.5 }
          }
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
