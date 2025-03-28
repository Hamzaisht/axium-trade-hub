import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAIValuationEngine } from '@/hooks/ai/useAIValuationEngine';
import { useSocialSentiment } from '@/hooks/ai/useSocialSentiment';
import { GlassCard } from '@/components/ui/GlassCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, MessageSquare, BarChart4, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AIModelType, PredictionTimeframe } from '@/utils/mockAIModels';
import { usePricePrediction } from '@/hooks/ai/usePricePrediction';
import { Button } from '@/components/ui/button';
import { showNotification } from '@/components/notifications/ToastContainer';
import { ExternalMetricsCard } from '@/components/trading/external-metrics';
import { AnomalyDetectionCard } from '@/components/trading/AnomalyDetectionCard';
import { MarketDepthChart } from '@/components/trading/MarketDepthChart';
import { SentimentScoreBadge } from '@/components/trading/SentimentScoreBadge';
import { cn } from '@/lib/utils';

interface SentimentBoxProps {
  platform: string;
  score: number;
  engagement: number;
}

const SentimentBox = ({ platform, score, engagement }: SentimentBoxProps) => {
  return (
    <GlassCard className="p-3 flex flex-col items-center justify-center space-y-1">
      <h4 className="text-sm font-medium">{platform}</h4>
      <div className="text-xl font-semibold">{score.toFixed(1)}/100</div>
      <div className="text-axium-gray-500 text-xs">Engagement: {engagement.toFixed(1)}M</div>
    </GlassCard>
  );
};

const AIInsights = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedTimeframe, setSelectedTimeframe] = useState<PredictionTimeframe>("24h");
  const [selectedModel, setSelectedModel] = useState<AIModelType>(AIModelType.STANDARD);
  const [externalMetricsLastUpdated, setExternalMetricsLastUpdated] = useState<string | undefined>(undefined);
  
  const aiEngine = useAIValuationEngine({ ipoId: id });
  const { data: socialData } = useSocialSentiment({ ipoId: id });
  const { data: pricePrediction, refetch: refetchPricePrediction } = usePricePrediction({
    ipoId: id || '',
    selectedTimeframe,
    selectedModel,
    externalMetricsLastUpdated
  });
  
  const handleModelChange = (model: AIModelType) => {
    setSelectedModel(model);
    setExternalMetricsLastUpdated(new Date().toISOString());
    showNotification.info(`Switched to ${model} model`);
  };
  
  const handleTimeframeChange = (timeframe: PredictionTimeframe) => {
    setSelectedTimeframe(timeframe);
    setExternalMetricsLastUpdated(new Date().toISOString());
    showNotification.info(`Set prediction timeframe to ${timeframe}`);
  };
  
  const handleRefetch = () => {
    aiEngine.refetch();
  };
  
  const marketDepthValue = (metricName: string) => {
    if (!aiEngine.valuation || !aiEngine.dataSources.marketDepthData) return 0;

    const marketDepthData = aiEngine.dataSources.marketDepthData;

    switch (metricName) {
      case 'orderBookDepth':
        return marketDepthData.orderBookDepth;
      case 'liquidityScore':
        return marketDepthData.liquidityScore;
      case 'volumeProfile':
        return marketDepthData.volumeProfile;
      case 'volatilityRisk':
        return marketDepthData.volatilityRisk;
      case 'buyPressure':
        return marketDepthData.buyPressure;
      case 'sellPressure':
        return marketDepthData.sellPressure;
      default:
        return 0;
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-10 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">AI-Powered Insights</h2>
        <p className="text-axium-gray-500 mt-2">
          Harnessing the power of AI for in-depth creator analysis and valuation
        </p>
      </div>
      
      <GlassCard className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-axium-blue" />
            AI Valuation
          </h3>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={handleRefetch}>
              Recalculate
            </Button>
            <SentimentScoreBadge score={aiEngine.valuation?.currentValue || 0} />
          </div>
        </div>
        
        {aiEngine.isLoading ? (
          <Skeleton className="h-8 w-32" />
        ) : aiEngine.error ? (
          <p className="text-red-500">Error: {aiEngine.error.message}</p>
        ) : (
          <>
            <div className="text-4xl font-bold">${aiEngine.valuation?.currentValue}</div>
            <p className="text-axium-gray-500">
              AI-driven valuation based on real-time data and predictive analytics.
            </p>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="valuation-breakdown">
                <AccordionTrigger>Valuation Breakdown</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <GlassCard className="p-4">
                      <h4 className="text-sm font-medium">Social Influence</h4>
                      <Progress value={aiEngine.valuation?.breakdown?.socialInfluence || 0} className="h-2 mt-2" />
                      <p className="text-axium-gray-500 text-xs mt-1">
                        Impact from social media engagement and follower growth.
                      </p>
                    </GlassCard>
                    <GlassCard className="p-4">
                      <h4 className="text-sm font-medium">Streaming Influence</h4>
                      <Progress value={aiEngine.valuation?.breakdown?.streamingInfluence || 0} className="h-2 mt-2" />
                      <p className="text-axium-gray-500 text-xs mt-1">
                        Impact from streaming metrics and audience retention.
                      </p>
                    </GlassCard>
                    <GlassCard className="p-4">
                      <h4 className="text-sm font-medium">Brand Deals Influence</h4>
                      <Progress value={aiEngine.valuation?.breakdown?.brandDealsInfluence || 0} className="h-2 mt-2" />
                      <p className="text-axium-gray-500 text-xs mt-1">
                        Impact from recent sponsorships and partnership value.
                      </p>
                    </GlassCard>
                    <GlassCard className="p-4">
                      <h4 className="text-sm font-medium">Market Sentiment Influence</h4>
                      <Progress value={aiEngine.valuation?.breakdown?.sentimentInfluence || 0} className="h-2 mt-2" />
                      <p className="text-axium-gray-500 text-xs mt-1">
                        Impact from social sentiment and public perception.
                      </p>
                    </GlassCard>
                    <GlassCard className="p-4">
                      <h4 className="text-sm font-medium">News Influence</h4>
                      <Progress value={aiEngine.valuation?.breakdown?.newsInfluence || 0} className="h-2 mt-2" />
                      <p className="text-axium-gray-500 text-xs mt-1">
                        Impact from recent news coverage and media mentions.
                      </p>
                    </GlassCard>
                    <GlassCard className="p-4">
                      <h4 className="text-sm font-medium">Market Depth Influence</h4>
                      <Progress value={aiEngine.valuation?.breakdown?.marketDepthInfluence || 0} className="h-2 mt-2" />
                      <p className="text-axium-gray-500 text-xs mt-1">
                        Impact from order book depth and trading patterns.
                      </p>
                    </GlassCard>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="valuation-factors">
                <AccordionTrigger>Key Valuation Factors</AccordionTrigger>
                <AccordionContent>
                  <ul className="mt-4 space-y-3">
                    {aiEngine.valuation?.factors?.map((factor, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">{factor.factor}</h5>
                          <p className="text-axium-gray-500 text-sm">{factor.description}</p>
                        </div>
                        <Badge variant="secondary">{factor.impact.toFixed(1)}</Badge>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        )}
      </GlassCard>
      
      <GlassCard className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-axium-blue" />
            Price Prediction
          </h3>
          <div className="flex items-center space-x-3">
            <Select value={selectedTimeframe} onValueChange={handleTimeframeChange}>
              <SelectTrigger className="w-[180px] h-8 text-sm">
                <SelectValue placeholder="Select Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="6h">6 Hours</SelectItem>
                <SelectItem value="12h">12 Hours</SelectItem>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedModel} onValueChange={handleModelChange}>
              <SelectTrigger className="w-[180px] h-8 text-sm">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={AIModelType.STANDARD}>Standard</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="neural_network">Neural Network</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => {
              setExternalMetricsLastUpdated(new Date().toISOString());
              refetchPricePrediction();
            }}>
              Recalculate
            </Button>
          </div>
        </div>
        
        {aiEngine.isLoading ? (
          <Skeleton className="h-8 w-32" />
        ) : aiEngine.error ? (
          <p className="text-red-500">Error: {aiEngine.error.message}</p>
        ) : (
          <>
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-semibold">
                {pricePrediction?.prediction.direction === 'up' ? (
                  <span className="text-green-500">
                    <TrendingUp className="inline-block h-5 w-5 mr-1" />
                    Up
                  </span>
                ) : pricePrediction?.prediction.direction === 'down' ? (
                  <span className="text-red-500">
                    <TrendingDown className="inline-block h-5 w-5 mr-1" />
                    Down
                  </span>
                ) : (
                  <span>Neutral</span>
                )}
              </div>
              <div className="text-axium-gray-500">
                {pricePrediction?.prediction.percentage}% in {selectedTimeframe}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Confidence:</span>
              <Progress value={pricePrediction?.confidence || 0} className="h-2 w-48" />
              <span className="text-axium-gray-500 text-sm">{pricePrediction?.confidence || 0}%</span>
            </div>
            
            <div className="bg-axium-gray-100/50 p-4 rounded-lg mt-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Target Price:</h4>
                <span className="text-lg font-semibold">${pricePrediction?.targetPrice?.toFixed(2) || 'N/A'}</span>
              </div>
              <div className="mt-2 text-sm text-axium-gray-600">
                The AI model predicts with {pricePrediction?.confidence}% confidence that the price could reach ${pricePrediction?.targetPrice?.toFixed(2)} within the selected timeframe.
              </div>
            </div>
            
            {pricePrediction?.factors && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Key Factors:</h4>
                <ul className="grid grid-cols-2 gap-2">
                  {pricePrediction.factors.map((factor, index) => (
                    <li key={index} className="text-sm bg-axium-gray-100/50 p-2 rounded-lg">
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="text-xs text-axium-gray-500 mt-4">
              Using {pricePrediction?.modelUsed || selectedModel} model | Last updated: {pricePrediction?.timestamp ? new Date(pricePrediction.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()}
            </div>
          </>
        )}
      </GlassCard>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnomalyDetectionCard ipoId={id} />
        <ExternalMetricsCard creatorId={id} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {socialData && (
          <>
            <GlassCard className="p-6 col-span-1">
              <h3 className="text-lg font-medium flex items-center mb-4">
                <MessageSquare className="h-5 w-5 mr-2 text-axium-blue" />
                Social Sentiment
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                {socialData?.platforms && (
                  Object.entries(socialData.platforms).map(([platform, data], index) => (
                    <SentimentBox 
                      key={index}
                      platform={platform.charAt(0).toUpperCase() + platform.slice(1)}
                      score={data.sentiment}
                      engagement={data.engagement}
                    />
                  ))
                )}
              </div>
            </GlassCard>
            
            <GlassCard className="p-6 col-span-2">
              <h3 className="text-lg font-medium flex items-center mb-4">
                <BarChart4 className="h-5 w-5 mr-2 text-axium-blue" />
                Market Trust Score
              </h3>
              
              <div className="flex flex-col items-center justify-center p-6">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-32 h-32">
                    <circle
                      className="text-axium-gray-200"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="56"
                      cx="64"
                      cy="64"
                    />
                    <circle
                      className={cn(
                        "text-blue-500",
                        socialData.trust >= 80 && "text-green-500",
                        socialData.trust < 60 && "text-orange-500",
                        socialData.trust < 40 && "text-red-500"
                      )}
                      strokeWidth="8"
                      strokeDasharray={`${(socialData.trust / 100) * 2 * Math.PI * 56} ${2 * Math.PI * 56}`}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="56"
                      cx="64"
                      cy="64"
                      transform="rotate(-90 64 64)"
                    />
                  </svg>
                  <span className="absolute text-3xl font-bold">{socialData.trust}%</span>
                </div>
                
                <div className="mt-6 text-center">
                  <h4 className="text-lg font-medium">
                    {socialData.trust >= 80 ? "Excellent" : 
                     socialData.trust >= 60 ? "Good" : 
                     socialData.trust >= 40 ? "Average" : "Poor"}
                  </h4>
                  <p className="text-axium-gray-600 mt-1">
                    {socialData.trust >= 80 ? "Strong community trust and excellent brand reputation" : 
                     socialData.trust >= 60 ? "Good market reputation with solid trust signals" : 
                     socialData.trust >= 40 ? "Average trust metrics with some concerning signals" : 
                     "Significant trust issues that need addressing"}
                  </p>
                </div>
              </div>
            </GlassCard>
          </>
        )}
      </div>
    </div>
  );
};

export default AIInsights;
