
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SentimentAlert, sentimentAnalysisService } from '@/services/ai/SentimentAnalysisService';

interface UseSentimentAnalysisParams {
  creatorId?: string;
  enabled?: boolean;
}

interface SentimentAnalysisReturn {
  sentimentData: {
    summary: {
      overallScore: number;
      previousScore: number;
      change: number;
      lastUpdated: string;
      alerts: SentimentAlert[];
    };
    platforms: {
      platform: string;
      score: number;
      change: number;
      posts: number;
      engagement: number;
    }[];
    topics: {
      name: string;
      sentiment: number;
      volume: number;
    }[];
    recentMentions: {
      source: string;
      text: string;
      sentiment: number;
      timestamp: string;
    }[];
  } | null;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}

export const useSentimentAnalysis = ({ 
  creatorId, 
  enabled = true 
}: UseSentimentAnalysisParams): SentimentAnalysisReturn => {
  const [sentimentData, setSentimentData] = useState<any>(null);

  const { isLoading, isError, error, refetch } = useQuery({
    queryKey: ['sentiment-analysis', creatorId],
    queryFn: async () => {
      if (!creatorId) return null;
      
      try {
        const data = await sentimentAnalysisService.getCreatorSentiment(creatorId);
        setSentimentData(data);
        return data;
      } catch (err) {
        console.error('Error fetching sentiment analysis:', err);
        throw err;
      }
    },
    enabled: !!creatorId && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    sentimentData,
    isLoading,
    isError,
    error,
    refetch
  };
};

export default useSentimentAnalysis;
