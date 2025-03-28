
import { useAIValuation } from '@/hooks/ai';
import { GlassCard } from '@/components/ui/GlassCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, LineChart, PieChart, TrendingUp, AlertTriangle, InfoIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ErrorBoundary from '@/components/common/ErrorBoundary';

import AIValuationCard from '@/components/ai/AIValuationCard';
import MarketDepthChart from '@/components/trading/MarketDepthChart';
import SentimentAnalysis from '@/components/ai/SentimentAnalysis';
import PricePredictionCard from '@/components/ai/PricePredictionCard';

interface DashboardInsightsProps {
  ipoId?: string;
  symbol?: string;
}

export const DashboardInsights = ({ ipoId, symbol }: DashboardInsightsProps) => {
  // Use AI valuation hook to get all AI insights
  const {
    pricePrediction,
    marketDepth,
    socialSentiment,
    anomalyData,
    creatorMarketScore,
    isLoading,
    isPredictionLoading,
    isMarketDepthLoading,
    isSocialSentimentLoading,
    hasErrors,
    refetchAll
  } = useAIValuation({ ipoId });

  // Handle missing data scenarios
  if (!ipoId) {
    return (
      <GlassCard className="p-4">
        <Alert>
          <InfoIcon className="h-4 w-4 mr-2" />
          <AlertDescription>
            Select a creator asset to view AI insights
          </AlertDescription>
        </Alert>
      </GlassCard>
    );
  }

  // Anomaly detection alert
  const showAnomalyAlert = anomalyData?.detected && anomalyData.riskScore > 65;

  return (
    <ErrorBoundary>
      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-medium flex items-center">
              AI Market Insights
              {symbol && <Badge variant="outline" className="ml-2">{symbol}</Badge>}
            </h2>
            <p className="text-sm text-gray-500">Powered by deep learning models</p>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetchAll()}
            disabled={isLoading}
          >
            <LineChart className="h-4 w-4 mr-2" />
            Refresh Insights
          </Button>
        </div>
        
        {/* Anomaly Alert Banner */}
        {showAnomalyAlert && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Unusual trading pattern detected! Risk score: {anomalyData.riskScore}/100. 
              {anomalyData.anomalies?.[0]?.description && (
                <span className="block mt-1">{anomalyData.anomalies[0].description}</span>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Market Score Overview */}
        {creatorMarketScore && !isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Creator Market Score</p>
              <h3 className="text-2xl font-bold">{creatorMarketScore.totalScore.toFixed(1)}/100</h3>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Social Engagement</p>
              <h3 className="text-2xl font-bold">
                {creatorMarketScore.socialEngagementInfluence.score.toFixed(1)}/100
              </h3>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Revenue Influence</p>
              <h3 className="text-2xl font-bold">
                {creatorMarketScore.revenueInfluence.score.toFixed(1)}/100
              </h3>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        )}
        
        {/* Tabs for different insights */}
        <Tabs defaultValue="prediction">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="prediction">
              <TrendingUp className="h-4 w-4 mr-2" />
              Prediction
            </TabsTrigger>
            <TabsTrigger value="market-depth">
              <BarChart3 className="h-4 w-4 mr-2" />
              Market Depth
            </TabsTrigger>
            <TabsTrigger value="sentiment">
              <PieChart className="h-4 w-4 mr-2" />
              Sentiment
            </TabsTrigger>
            <TabsTrigger value="valuation">
              <LineChart className="h-4 w-4 mr-2" />
              Valuation
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="prediction" className="mt-0">
            <ErrorBoundary>
              <PricePredictionCard 
                prediction={pricePrediction} 
                isLoading={isPredictionLoading}
                symbol={symbol}
              />
            </ErrorBoundary>
          </TabsContent>
          
          <TabsContent value="market-depth" className="mt-0">
            <ErrorBoundary>
              <MarketDepthChart 
                marketDepth={marketDepth} 
                isLoading={isMarketDepthLoading} 
              />
            </ErrorBoundary>
          </TabsContent>
          
          <TabsContent value="sentiment" className="mt-0">
            <ErrorBoundary>
              <SentimentAnalysis 
                sentimentData={socialSentiment} 
                isLoading={isSocialSentimentLoading} 
              />
            </ErrorBoundary>
          </TabsContent>
          
          <TabsContent value="valuation" className="mt-0">
            <ErrorBoundary>
              <AIValuationCard 
                creatorId={ipoId} 
                symbol={symbol} 
              />
            </ErrorBoundary>
          </TabsContent>
        </Tabs>
      </GlassCard>
    </ErrorBoundary>
  );
};

export default DashboardInsights;
