
import { useQuery } from '@tanstack/react-query';
import { sentimentAnalysisService, CreatorSentimentData } from '@/services/ai/SentimentAnalysisService';
import { toast } from 'sonner';

interface UseSentimentAnalysisProps {
  creatorId?: string;
  enabled?: boolean;
}

export const useSentimentAnalysis = ({ creatorId, enabled = true }: UseSentimentAnalysisProps) => {
  // Fetch sentiment data using react-query
  const sentimentQuery = useQuery({
    queryKey: ['creator-sentiment', creatorId],
    queryFn: async () => {
      if (!creatorId) return null;
      try {
        return await sentimentAnalysisService.getCreatorSentiment(creatorId);
      } catch (error) {
        console.error('Error fetching sentiment data:', error);
        throw new Error('Failed to fetch sentiment data');
      }
    },
    enabled: !!creatorId && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    meta: {
      errorMessage: "Could not fetch creator's sentiment data"
    }
  });

  // Refresh sentiment data
  const refreshSentiment = async () => {
    if (!creatorId) return;
    
    try {
      await sentimentAnalysisService.refreshCreatorSentiment(creatorId);
      await sentimentQuery.refetch();
      toast.success('Sentiment data refreshed');
    } catch (error) {
      toast.error('Failed to refresh sentiment data');
      console.error('Error refreshing sentiment data:', error);
    }
  };

  return {
    sentimentData: sentimentQuery.data as CreatorSentimentData | null | undefined,
    isLoading: sentimentQuery.isLoading,
    isError: sentimentQuery.isError,
    error: sentimentQuery.error,
    refreshSentiment,
    refetch: sentimentQuery.refetch
  };
};

export default useSentimentAnalysis;
