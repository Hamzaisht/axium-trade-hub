import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Lightbulb, TrendingUp, TrendingDown, AlertCircle, BarChart, MessageSquare } from "lucide-react";
import { ClaudeInsight, getClaudeInsights, Creator } from "@/utils/ClaudeInsights";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { getMockTradeHistory } from "@/mock/tradeHistory";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { getCreatorById } from "@/mock/creatorData";

interface ClaudeInsightsCardProps {
  creator?: Creator;
  creatorId?: string;
  className?: string;
  limit?: number;
}

export function ClaudeInsightsCard({ creator, creatorId, className, limit = 3 }: ClaudeInsightsCardProps) {
  const [insights, setInsights] = useState<ClaudeInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDemo } = useDemoMode();

  useEffect(() => {
    if (!creator && !creatorId) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(async () => {
      try {
        // Get recent trades for additional context
        const recentTrades = getMockTradeHistory(creatorId, 10);
        
        // For demo mode, always use mock creator data
        let creatorData = creator;
        if (isDemo || !creatorData) {
          creatorData = getCreatorById(creatorId);
        }
        
        // Get insights
        const claudeInsights = await getClaudeInsights(creatorData, recentTrades);
        setInsights(claudeInsights);
      } catch (error) {
        console.error("Error fetching Claude insights:", error);
      } finally {
        setIsLoading(false);
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [creator, creatorId, isDemo]);

  const formatTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const getInsightIcon = (insight: ClaudeInsight) => {
    switch (insight.category) {
      case 'engagement':
        return <BarChart className="h-4 w-4" />;
      case 'valuation':
        return <Lightbulb className="h-4 w-4" />;
      case 'trend':
        return insight.impact === 'positive' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
      case 'prediction':
        return <Lightbulb className="h-4 w-4" />;
      case 'risk':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getImpactColor = (impact: ClaudeInsight['impact']) => {
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
    <div className="space-y-4">
      {[...Array(limit)].map((_, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-16 w-full" />
        </div>
      ))}
    </div>
  );

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Claude AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          renderLoadingSkeleton()
        ) : insights.length > 0 ? (
          <div className="space-y-4">
            {insights.slice(0, limit).map((insight, index) => (
              <div 
                key={insight.id}
                className="space-y-1 animate-in fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1 text-sm font-medium">
                    {getInsightIcon(insight)}
                    <span className="capitalize">{insight.category}</span>
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
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No AI insights available
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-3 flex justify-center">
        <div className="flex items-center text-xs text-muted-foreground">
          <div className="w-4 h-4 mr-1.5 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full"></div>
          Powered by Claude AI
        </div>
      </CardFooter>
    </Card>
  );
}

export default ClaudeInsightsCard;
