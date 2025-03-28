
import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  MessageSquare, 
  TrendingUp,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { useSentimentAnalysis } from '@/hooks/ai/useSentimentAnalysis';
import { cn } from '@/lib/utils';

interface SentimentInsightsProps {
  creatorId?: string;
  className?: string;
}

const SentimentInsights = ({ creatorId, className }: SentimentInsightsProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const { 
    sentimentData, 
    isLoading, 
    isError, 
    refreshSentiment 
  } = useSentimentAnalysis({ creatorId });
  
  // Format the sentiment history for the chart - using summary history data if available
  const formattedSentimentHistory = sentimentData?.summary?.alerts?.map(item => ({
    date: new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: item.change > 0 ? 75 : 25, // Simplified positive/negative value
    fullDate: new Date(item.timestamp).toISOString()
  })) || [];
  
  // Format the sentiment by platform for the bar chart
  const formattedPlatformSentiment = sentimentData?.platforms?.map(platform => ({
    name: platform.platform,
    value: platform.score,
    volume: platform.score // Using score as volume since it's available
  })) || [];
  
  // Helper function to get sentiment color
  const getSentimentColor = (score: number) => {
    if (score >= 75) return 'text-green-500';
    if (score >= 50) return 'text-blue-500';
    if (score >= 25) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  // Helper function to get sentiment label
  const getSentimentLabel = (score: number) => {
    if (score >= 75) return 'Very Positive';
    if (score >= 50) return 'Positive';
    if (score >= 25) return 'Neutral';
    return 'Negative';
  };
  
  // Get color for bar chart
  const getBarColor = (score: number) => {
    if (score >= 75) return '#10b981';
    if (score >= 50) return '#3b82f6';
    if (score >= 25) return '#f59e0b';
    return '#ef4444';
  };
  
  return (
    <GlassCard className={cn("p-4", className)}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Sentiment Analysis</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshSentiment}
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
          <h4 className="text-axium-error font-medium mb-1">Failed to load sentiment data</h4>
          <p className="text-sm text-axium-gray-600 mb-4">
            There was an error analyzing creator sentiment
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshSentiment}
          >
            Retry
          </Button>
        </div>
      ) : isLoading || !sentimentData ? (
        <div className="text-center py-10">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-slate-200 h-12 w-12 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
            <div className="h-3 bg-slate-200 rounded w-24"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center mb-4">
            <div className={cn(
              "text-4xl font-bold mb-1",
              getSentimentColor(sentimentData.summary.overallScore)
            )}>
              {Math.round(sentimentData.summary.overallScore)}%
            </div>
            <Badge variant={sentimentData.summary.overallScore >= 50 ? "default" : "destructive"}>
              {getSentimentLabel(sentimentData.summary.overallScore)}
            </Badge>
            <p className="text-xs text-axium-gray-600 mt-1">
              Based on {sentimentData.platforms.length} sources
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 h-8">
              <TabsTrigger value="overview" className="text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trend
              </TabsTrigger>
              <TabsTrigger value="platforms" className="text-xs">
                <MessageSquare className="h-3 w-3 mr-1" />
                Platforms
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="pt-2">
              <div className="h-32">
                {formattedSentimentHistory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={formattedSentimentHistory}
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
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Sentiment']}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-axium-gray-500">
                    No trend data available
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="platforms" className="pt-2">
              <div className="h-32">
                {formattedPlatformSentiment.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={formattedPlatformSentiment}
                      margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                    >
                      <XAxis 
                        dataKey="name"
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                      />
                      <YAxis 
                        domain={[0, 100]} 
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                        width={25}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Sentiment']}
                        labelFormatter={(label) => `Platform: ${label}`}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {formattedPlatformSentiment.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getBarColor(entry.value)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-axium-gray-500">
                    No platform data available
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-2 pt-2 border-t border-axium-gray-200">
            <div className="flex flex-wrap gap-2 justify-around">
              {sentimentData.platforms.slice(0, 4).map((platform, index) => (
                <Badge 
                  key={index} 
                  variant="outline"
                  className="text-xs py-0 px-2"
                >
                  {platform.platform}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}
    </GlassCard>
  );
};

export default SentimentInsights;
