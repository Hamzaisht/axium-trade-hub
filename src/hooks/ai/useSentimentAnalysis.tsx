
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface CreatorSentimentData {
  overallSentiment: number;
  positiveMentions: number;
  negativeMentions: number;
  keywords: string[];
  lastUpdated: string;
}

interface SentimentAnalysisService {
  getCreatorSentiment: (creatorId: string) => Promise<CreatorSentimentData>;
  refreshCreatorSentiment: (creatorId: string) => Promise<void>;
}

// Mock service implementation
const sentimentAnalysisService: SentimentAnalysisService = {
  getCreatorSentiment: async (creatorId: string): Promise<CreatorSentimentData> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      overallSentiment: Math.floor(65 + Math.random() * 25), // 65-90
      positiveMentions: Math.floor(8000 + Math.random() * 10000),
      negativeMentions: Math.floor(1000 + Math.random() * 5000),
      keywords: [
        'trending', 'viral', 'growth', 'partnership', 'collaboration',
        'innovative', 'authentic', 'engaging'
      ],
      lastUpdated: new Date().toISOString()
    };
  },
  
  refreshCreatorSentiment: async (creatorId: string): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
};

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
