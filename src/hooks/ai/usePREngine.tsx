
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { sentimentAnalysisService } from '@/services/ai/SentimentAnalysisService';
import { useEffect } from 'react';

interface PREvent {
  id: string;
  creatorId: string;
  platform: string;
  headline: string;
  summary: string;
  sentimentScore: number;
  impact: 'minor' | 'moderate' | 'major';
  timestamp: string;
  url?: string;
  isPositive: boolean;
}

interface UsePREngineProps {
  creatorId?: string;
  enabled?: boolean;
  onMajorEvent?: (event: PREvent) => void;
}

export const usePREngine = ({ creatorId, enabled = true, onMajorEvent }: UsePREngineProps) => {
  // Fetch PR events using react-query
  const prEventsQuery = useQuery({
    queryKey: ['creator-pr-events', creatorId],
    queryFn: async () => {
      if (!creatorId) return { events: [], latestScore: 0, historicalScores: [] };
      try {
        return await sentimentAnalysisService.getCreatorPREvents(creatorId);
      } catch (error) {
        console.error('Error fetching PR events:', error);
        throw new Error('Failed to fetch PR events');
      }
    },
    enabled: !!creatorId && enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    meta: {
      errorMessage: "Could not fetch creator's PR events"
    }
  });

  // Check for major events and notify if needed
  useEffect(() => {
    if (prEventsQuery.data?.events && onMajorEvent) {
      const majorEvents = prEventsQuery.data.events.filter(
        event => event.impact === 'major' && 
        // Only alert for events in the last hour
        new Date(event.timestamp).getTime() > Date.now() - 60 * 60 * 1000
      );
      
      if (majorEvents.length > 0) {
        // Notify about the most recent major event
        const latestEvent = majorEvents[0];
        onMajorEvent(latestEvent);
        
        // Display toast notification
        if (latestEvent.isPositive) {
          toast.success(`Major positive event: ${latestEvent.headline}`);
        } else {
          toast.error(`Major negative event: ${latestEvent.headline}`);
        }
      }
    }
  }, [prEventsQuery.data, onMajorEvent]);

  // Refresh PR events
  const refreshPREvents = async () => {
    if (!creatorId) return;
    
    try {
      await sentimentAnalysisService.refreshCreatorPREvents(creatorId);
      await prEventsQuery.refetch();
      toast.success('PR events refreshed');
    } catch (error) {
      toast.error('Failed to refresh PR events');
      console.error('Error refreshing PR events:', error);
    }
  };

  return {
    prEvents: prEventsQuery.data?.events as PREvent[] | undefined,
    latestScore: prEventsQuery.data?.latestScore as number | undefined,
    historicalScores: prEventsQuery.data?.historicalScores as {timestamp: string, score: number}[] | undefined,
    isLoading: prEventsQuery.isLoading,
    isError: prEventsQuery.isError,
    error: prEventsQuery.error,
    refreshPREvents,
    refetch: prEventsQuery.refetch
  };
};

export default usePREngine;
