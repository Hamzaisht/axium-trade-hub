
import { useState } from 'react';
import { usePREngine } from '@/hooks/ai/usePREngine';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';
import {
  PRTrendlineChart,
  PRTrendlineOverlay,
  PREventsList,
  SentimentScoreDisplay,
  MajorEventNotification,
  normalizeSentimentScore
} from './pr-trendline';

interface PRTrendlineProps {
  creatorId?: string;
  className?: string;
  showOverlay?: boolean;
  onMajorEvent?: (event: any) => void;
}

const PRTrendline = ({ creatorId, className, showOverlay = false, onMajorEvent }: PRTrendlineProps) => {
  const [majorEvent, setMajorEvent] = useState<any>(null);
  
  const { 
    prEvents, 
    latestScore, 
    historicalScores,
    isLoading, 
    isError, 
    refreshPREvents 
  } = usePREngine({ 
    creatorId,
    onMajorEvent: (event) => {
      setMajorEvent(event);
      if (onMajorEvent) onMajorEvent(event);
    }
  });
  
  // Format trendline data for the chart
  const formattedTrendlineData = historicalScores?.map(item => ({
    date: new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: normalizeSentimentScore(Number(item.score)),
    fullDate: new Date(item.timestamp).toISOString(),
    rawScore: Number(item.score)
  })) || [];
  
  // Add PR events as points on the chart
  const eventPoints = prEvents?.map(event => ({
    date: new Date(event.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    fullDate: event.timestamp,
    eventValue: normalizeSentimentScore(Number(event.sentimentScore)),
    eventImpact: event.impact,
    eventHeadline: event.headline,
    eventIsPositive: event.isPositive,
    eventId: event.id,
    rawScore: Number(event.sentimentScore)
  })) || [];
  
  if (showOverlay) {
    return (
      <PRTrendlineOverlay 
        trendlineData={formattedTrendlineData}
        eventPoints={eventPoints}
        prEvents={prEvents}
      />
    );
  }
  
  return (
    <GlassCard className={cn("p-4", className)}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">PR & Sentiment Analysis</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshPREvents}
          disabled={isLoading}
        >
          <RefreshCw className={cn(
            "h-4 w-4 mr-1",
            isLoading && "animate-spin"
          )} />
          Refresh
        </Button>
      </div>
      
      {isError ? (
        <div className="text-center py-6">
          <AlertTriangle className="h-8 w-8 text-axium-error mx-auto mb-2" />
          <h4 className="text-axium-error font-medium mb-1">Failed to load PR data</h4>
          <p className="text-sm text-axium-gray-600 mb-4">
            There was an error analyzing creator PR and sentiment
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshPREvents}
          >
            Retry
          </Button>
        </div>
      ) : isLoading || !latestScore ? (
        <div className="text-center py-10">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-slate-200 h-12 w-12 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
            <div className="h-3 bg-slate-200 rounded w-24"></div>
          </div>
        </div>
      ) : (
        <>
          {majorEvent && <MajorEventNotification event={majorEvent} />}
          
          <SentimentScoreDisplay 
            score={latestScore} 
            eventCount={prEvents?.length || 0} 
          />
          
          <div className="h-48">
            <PRTrendlineChart 
              trendlineData={formattedTrendlineData}
              eventPoints={eventPoints}
            />
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Recent PR Events</h4>
            <div className="max-h-40 overflow-y-auto">
              <PREventsList events={prEvents} />
            </div>
          </div>
        </>
      )}
    </GlassCard>
  );
};

export default PRTrendline;
