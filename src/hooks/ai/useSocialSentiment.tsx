
import { useQuery } from '@tanstack/react-query';
import { mockAIValuationAPI } from '@/utils/mockApi';

interface UseSocialSentimentProps {
  ipoId?: string;
  externalMetricsLastUpdated?: string;
  enabled?: boolean;
}

export const useSocialSentiment = ({ 
  ipoId, 
  externalMetricsLastUpdated,
  enabled = true 
}: UseSocialSentimentProps) => {
  return useQuery({
    queryKey: ['social-sentiment', ipoId, externalMetricsLastUpdated],
    queryFn: async () => {
      if (!ipoId) return null;
      try {
        return await mockAIValuationAPI.getSocialSentiment(ipoId);
      } catch (error) {
        console.error('Error fetching social sentiment:', error);
        throw error;
      }
    },
    enabled: !!ipoId && enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false
  });
};
