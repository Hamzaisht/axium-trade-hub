
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, TrendingDown, TrendingUp, AlertCircle, BarChart, MessageSquare } from "lucide-react";
import { getMockInsights, AIInsight } from "@/mock/insights";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface AIInsightsCardProps {
  creatorId: string;
  limit?: number;
}

export function AIInsightsCard({ creatorId, limit = 5 }: AIInsightsCardProps) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(limit);

  useEffect(() => {
    if (!creatorId) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setInsights(getMockInsights(creatorId, 10));
      setIsLoading(false);
    }, 1200);
    
    // Simulate new insights coming in
    const interval = setInterval(() => {
      setInsights(prev => {
        if (Math.random() > 0.7) { // Only sometimes add new insights
          const newInsight = getMockInsights(creatorId, 1)[0];
          return [newInsight, ...prev];
        }
        return prev;
      });
    }, 30000);
    
    return () => clearInterval(interval);
  }, [creatorId]);

  // Format time relative to now
  const formatTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'sentiment':
        return <MessageSquare className="h-4 w-4" />;
      case 'engagement':
        return <BarChart className="h-4 w-4" />;
      case 'prediction':
        return <TrendingUp className="h-4 w-4" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4" />;
      case 'news':
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getImpactColor = (impact: AIInsight['impact']) => {
    switch (impact) {
      case 'positive':
        return 'bg-axium-positive/10 text-axium-positive border-axium-positive/20';
      case 'negative':
        return 'bg-axium-negative/10 text-axium-negative border-axium-negative/20';
      case 'neutral':
      default:
        return 'bg-muted text-muted-foreground border-muted-foreground/20';
    }
  };

  const renderLoadingSkeleton = () => (
    <div className="space-y-3">
      {[...Array(limit)].map((_, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );

  const showMoreInsights = () => {
    setVisibleCount(prev => prev + 5);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          renderLoadingSkeleton()
        ) : insights.length > 0 ? (
          <div className="space-y-4">
            {insights.slice(0, visibleCount).map((insight, index) => (
              <div 
                key={insight.id}
                className="space-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1 text-sm font-medium">
                    {getInsightIcon(insight.type)}
                    <span className="capitalize">{insight.type}</span>
                    {insight.confidence && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        {insight.confidence}% confidence
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatTime(insight.timestamp)}
                  </div>
                </div>
                <div className={`p-3 rounded-md border ${getImpactColor(insight.impact)}`}>
                  {insight.message}
                </div>
              </div>
            ))}
            
            {insights.length > visibleCount && (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={showMoreInsights}
              >
                Show More Insights
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No AI insights available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
