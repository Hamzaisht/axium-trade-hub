
import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MessageSquare, TrendingUp, BarChart4, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import useSentimentAnalysis from '@/hooks/ai/useSentimentAnalysis';
import { cn } from '@/lib/utils';

interface SentimentInsightsProps {
  ipoId: string;
  className?: string;
}

export const SentimentInsights = ({ ipoId, className }: SentimentInsightsProps) => {
  const { sentimentData, isLoading, error } = useSentimentAnalysis({ creatorId: ipoId });
  const [timeFrame, setTimeFrame] = useState("7d");

  // Mock engagement data for charts
  const engagementData = [
    { date: "Jan", value: 65 },
    { date: "Feb", value: 72 },
    { date: "Mar", value: 78 },
    { date: "Apr", value: 74 },
    { date: "May", value: 82 },
    { date: "Jun", value: 87 },
  ];

  // Mock sentiment data for charts
  const sentimentChartData = [
    { date: "Jan", positive: 65, negative: 35 },
    { date: "Feb", positive: 72, negative: 28 },
    { date: "Mar", positive: 58, negative: 42 },
    { date: "Apr", positive: 74, negative: 26 },
    { date: "May", positive: 82, negative: 18 },
    { date: "Jun", positive: 77, negative: 23 },
  ];

  return (
    <GlassCard className={cn("flex flex-col", className)}>
      <Tabs defaultValue="overview" className="w-full">
        <div className="flex items-center justify-between p-4">
          <h3 className="text-lg font-semibold">Sentiment Insights</h3>
          <TabsList className="bg-axium-gray-100">
            <TabsTrigger value="overview" className="data-[state=active]:bg-axium-blue data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-axium-blue data-[state=active]:text-white">
              Details
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4 p-4">
          {isLoading ? (
            <p className="text-axium-gray-500">Loading sentiment data...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error.message}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-axium-gray-100/50 rounded-lg">
                  <div className="text-axium-gray-600 text-sm mb-1">Overall Sentiment</div>
                  <div className="text-2xl font-semibold">{sentimentData?.overallSentiment || 77}%</div>
                  <div className="text-green-500 text-xs flex items-center">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    5.3% this month
                  </div>
                </div>
                <div className="p-4 bg-axium-gray-100/50 rounded-lg">
                  <div className="text-axium-gray-600 text-sm mb-1">Positive Mentions</div>
                  <div className="text-2xl font-semibold">{sentimentData?.positiveMentions || 12458}</div>
                  <div className="text-green-500 text-xs flex items-center">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    15.8% this month
                  </div>
                </div>
                <div className="p-4 bg-axium-gray-100/50 rounded-lg">
                  <div className="text-axium-gray-600 text-sm mb-1">Negative Mentions</div>
                  <div className="text-2xl font-semibold">{sentimentData?.negativeMentions || 3241}</div>
                  <div className="text-red-500 text-xs flex items-center">
                    <ArrowDown className="h-3 w-3 mr-1" />
                    2.1% this month
                  </div>
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={sentimentChartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="positive"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#10b981" }}
                      activeDot={{ r: 6 }}
                      name="Positive"
                    />
                    <Line
                      type="monotone"
                      dataKey="negative"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#ef4444" }}
                      activeDot={{ r: 6 }}
                      name="Negative"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="details" className="space-y-4 p-4">
          {isLoading ? (
            <p className="text-axium-gray-500">Loading detailed sentiment data...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error.message}</p>
          ) : (
            <>
              <div className="mb-4">
                <h4 className="text-base font-medium mb-2">Key Sentiment Drivers</h4>
                <div className="flex flex-wrap gap-2">
                  {sentimentData?.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-base font-medium mb-2">Recent Social Activity</h4>
                <p className="text-axium-gray-600 text-sm">
                  Analyzing recent posts, comments, and mentions across social platforms.
                </p>
                {/* Add social activity feed or summary here */}
              </div>

              <div>
                <h4 className="text-base font-medium mb-2">Sentiment Over Time</h4>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={timeFrame === "7d" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeFrame("7d")}
                    className={timeFrame === "7d" ? "bg-axium-blue text-white" : "bg-white"}
                  >
                    7D
                  </Button>
                  <Button
                    variant={timeFrame === "30d" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeFrame("30d")}
                    className={timeFrame === "30d" ? "bg-axium-blue text-white" : "bg-white"}
                  >
                    30D
                  </Button>
                  <Button
                    variant={timeFrame === "90d" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeFrame("90d")}
                    className={timeFrame === "90d" ? "bg-axium-blue text-white" : "bg-white"}
                  >
                    90D
                  </Button>
                </div>
                {/* Add sentiment over time chart here */}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </GlassCard>
  );
};

export default SentimentInsights;
