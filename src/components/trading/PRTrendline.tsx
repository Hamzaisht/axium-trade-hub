
import { useEffect, useState } from 'react';
import { usePREngine } from '@/hooks/ai/usePREngine';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Label,
  Scatter,
  ReferenceArea
} from 'recharts';
import { Milestone, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';

interface PRTrendlineProps {
  creatorId?: string;
  className?: string;
  showOverlay?: boolean;
  onMajorEvent?: (event: any) => void;
}

const PRTrendline = ({ creatorId, className, showOverlay = false, onMajorEvent }: PRTrendlineProps) => {
  const [activeTab, setActiveTab] = useState('sentiment');
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
    value: normalizeSentimentScore(item.score),
    fullDate: new Date(item.timestamp).toISOString(),
    rawScore: item.score
  })) || [];
  
  // Helper function to normalize sentiment scores from -100/+100 to 0-100 scale
  function normalizeSentimentScore(score: number): number {
    return (score + 100) / 2;
  }
  
  // Helper function to get sentiment color
  const getSentimentColor = (score: number) => {
    const normalizedScore = normalizeSentimentScore(score);
    if (normalizedScore >= 75) return 'text-green-500';
    if (normalizedScore >= 50) return 'text-blue-500';
    if (normalizedScore >= 25) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  // Helper function to get sentiment label
  const getSentimentLabel = (score: number) => {
    const normalizedScore = normalizeSentimentScore(score);
    if (normalizedScore >= 75) return 'Very Positive';
    if (normalizedScore >= 50) return 'Positive';
    if (normalizedScore >= 25) return 'Neutral';
    return 'Negative';
  };
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="font-medium">{label}</p>
          <p className={getSentimentColor(data.rawScore)}>
            Sentiment: {getSentimentLabel(data.rawScore)}
          </p>
          <p className="text-sm">Raw Score: {data.rawScore}</p>
        </div>
      );
    }
    
    return null;
  };
  
  // Combine PR events with trendline data for overlay visualization
  const overlayData = [...formattedTrendlineData];
  
  // Add PR events as points on the chart
  const eventPoints = prEvents?.map(event => ({
    date: new Date(event.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    fullDate: event.timestamp,
    eventValue: normalizeSentimentScore(event.sentimentScore),
    eventImpact: event.impact,
    eventHeadline: event.headline,
    eventIsPositive: event.isPositive,
    eventId: event.id,
    rawScore: event.sentimentScore
  })) || [];
  
  if (showOverlay) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={overlayData}
          margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
        >
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#8884d8" 
            strokeWidth={2}
            dot={false}
            name="PR Sentiment"
          />
          {/* Add reference areas for major events */}
          {prEvents?.filter(e => e.impact === 'major').map(event => (
            <ReferenceArea 
              key={event.id}
              x={new Date(event.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} 
              y1={0}
              y2={100}
              stroke={event.isPositive ? "#10b981" : "#ef4444"}
              strokeOpacity={0.3}
              fillOpacity={0.1}
              fill={event.isPositive ? "#10b981" : "#ef4444"}
            />
          ))}
          {/* Add a scatter plot for PR events */}
          <Scatter 
            data={eventPoints}
            dataKey="eventValue"
            fill="#ff7300"
            shape={(props: any) => {
              const { cx, cy } = props;
              const { eventImpact, eventIsPositive } = props.payload;
              
              // Determine size based on impact
              let size = 4;
              if (eventImpact === 'moderate') size = 6;
              if (eventImpact === 'major') size = 8;
              
              // Determine color based on sentiment
              const color = eventIsPositive ? "#10b981" : "#ef4444";
              
              return (
                <circle 
                  cx={cx} 
                  cy={cy} 
                  r={size} 
                  fill={color} 
                  stroke="#fff"
                  strokeWidth={1}
                />
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>
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
          {majorEvent && (
            <div className={cn(
              "mb-4 p-3 border rounded-lg",
              majorEvent.isPositive ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
            )}>
              <div className="flex items-start gap-2">
                <div className={cn(
                  "mt-1 p-1 rounded-full",
                  majorEvent.isPositive ? "bg-green-100" : "bg-red-100"
                )}>
                  {majorEvent.isPositive ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">
                      {majorEvent.isPositive ? "Positive" : "Negative"} PR Event
                    </h4>
                    <Badge variant={majorEvent.isPositive ? "default" : "destructive"} className="text-[10px] py-0 h-4">
                      Major Impact
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{majorEvent.headline}</p>
                  <p className="text-xs text-axium-gray-600 mt-1">
                    {new Date(majorEvent.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-col items-center mb-4">
            <div className={cn(
              "text-4xl font-bold mb-1",
              getSentimentColor(latestScore)
            )}>
              {Math.round(normalizeSentimentScore(latestScore))}%
            </div>
            <Badge variant={latestScore >= 0 ? "default" : "destructive"}>
              {getSentimentLabel(latestScore)}
            </Badge>
            <p className="text-xs text-axium-gray-600 mt-1">
              Based on {prEvents?.length || 0} PR events
            </p>
          </div>
          
          <div className="h-48">
            {formattedTrendlineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={formattedTrendlineData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                  <XAxis 
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    width={25}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={50} stroke="#888" strokeDasharray="3 3">
                    <Label value="Neutral" position="insideLeft" fontSize={10} />
                  </ReferenceLine>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 5 }}
                  />
                  {/* Add a scatter plot for PR events */}
                  <Scatter 
                    data={eventPoints}
                    dataKey="eventValue"
                    fill="#ff7300"
                    shape={(props: any) => {
                      const { cx, cy } = props;
                      const { eventImpact, eventIsPositive } = props.payload;
                      
                      // Determine size based on impact
                      let size = 4;
                      if (eventImpact === 'moderate') size = 6;
                      if (eventImpact === 'major') size = 8;
                      
                      // Determine color based on sentiment
                      const color = eventIsPositive ? "#10b981" : "#ef4444";
                      
                      return (
                        <circle 
                          cx={cx} 
                          cy={cy} 
                          r={size} 
                          fill={color} 
                          stroke="#fff"
                          strokeWidth={1}
                        />
                      );
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-axium-gray-500">
                No PR trend data available
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Recent PR Events</h4>
            <div className="max-h-40 overflow-y-auto">
              {prEvents && prEvents.length > 0 ? (
                <div className="space-y-2">
                  {prEvents.slice(0, 5).map(event => (
                    <div 
                      key={event.id} 
                      className={cn(
                        "p-2 text-xs rounded border",
                        event.isPositive 
                          ? "border-green-200 bg-green-50" 
                          : "border-red-200 bg-red-50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{event.headline}</span>
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger asChild>
                              <Badge 
                                variant={event.impact === 'major' 
                                  ? (event.isPositive ? "default" : "destructive") 
                                  : "outline"
                                } 
                                className="ml-1 text-[10px]"
                              >
                                {event.impact}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Impact level: {event.impact}</p>
                              <p>Score: {event.sentimentScore}</p>
                            </TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex justify-between mt-1 text-[10px] text-axium-gray-600">
                        <span>{event.platform}</span>
                        <span>{new Date(event.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-2 text-axium-gray-500 text-sm">
                  No recent PR events detected
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </GlassCard>
  );
};

export default PRTrendline;
