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
  const socialData = useSocialSentiment({ ipoId: id }).data;
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
            <Button variant="outline" size="sm" onClick={aiEngine.refetch}>
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
                <SelectItem value={AIModelType.ADVANCED}>Advanced</SelectItem>
                <SelectItem value={AIModelType.NEURAL_NETWORK}>Neural Network</SelectItem>
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
              <span className="text-axium-gray-500 text-sm">{pricePrediction?.confidence}%</span>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="prediction-factors">
                <AccordionTrigger>Influencing Factors</AccordionTrigger>
                <AccordionContent>
                  <ul className="mt-4 space-y-3">
                    {pricePrediction?.factors?.map((factor, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">{factor}</h5>
                          <p className="text-axium-gray-500 text-sm">Details about {factor}</p>
                        </div>
                        <Badge variant="secondary">Impact</Badge>
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
        <h3 className="text-lg font-medium flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-axium-blue" />
          Social Sentiment Analysis
        </h3>
        
        {aiEngine.isLoading ? (
          <Skeleton className="h-8 w-32" />
        ) : aiEngine.error ? (
          <p className="text-red-500">Error: {aiEngine.error.message}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              <SentimentBox 
                platform="Twitter"
                score={socialData && socialData.platforms ? socialData.platforms.twitter?.sentiment || 0 : 0}
                engagement={socialData && socialData.platforms ? socialData.platforms.twitter?.engagement || 0 : 0}
              />
              <SentimentBox 
                platform="Instagram"
                score={socialData && socialData.platforms ? socialData.platforms.instagram?.sentiment || 0 : 0}
                engagement={socialData && socialData.platforms ? socialData.platforms.instagram?.engagement || 0 : 0}
              />
              <SentimentBox 
                platform="YouTube"
                score={socialData && socialData.platforms ? socialData.platforms.youtube?.sentiment || 0 : 0}
                engagement={socialData && socialData.platforms ? socialData.platforms.youtube?.engagement || 0 : 0}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-base font-medium">Trust Score</span>
              <Badge variant={
                !socialData ? "outline" :
                (socialData.trust && socialData.trust >= 80) ? "success" :
                (socialData.trust && socialData.trust >= 60) ? "warning" :
                "destructive"
              }>
                {socialData && socialData.trust ? socialData.trust : 'N/A'}/100
              </Badge>
            </div>
            <Progress 
              value={socialData && socialData.trust ? socialData.trust : 0} 
              className="h-2 mt-1" 
            />
          </>
        )}
      </GlassCard>
      
      <GlassCard className="p-6 space-y-6">
        <h3 className="text-lg font-medium flex items-center">
          <BarChart4 className="h-5 w-5 mr-2 text-axium-blue" />
          Market Depth Analysis
        </h3>
        
        {aiEngine.isLoading ? (
          <Skeleton className="h-8 w-32" />
        ) : aiEngine.error ? (
          <p className="text-red-500">Error: {aiEngine.error.message}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <GlassCard className="p-4">
                <h4 className="text-sm font-medium">Order Book Depth</h4>
                <div className="text-2xl font-semibold">{marketDepthValue('orderBookDepth').toFixed(2)}</div>
                <p className="text-axium-gray-500 text-xs mt-1">
                  Depth of buy and sell orders in the market.
                </p>
              </GlassCard>
              <GlassCard className="p-4">
                <h4 className="text-sm font-medium">Liquidity Score</h4>
                <div className="text-2xl font-semibold">{marketDepthValue('liquidityScore').toFixed(2)}</div>
                <p className="text-axium-gray-500 text-xs mt-1">
                  Overall liquidity and ease of trading.
                </p>
              </GlassCard>
              <GlassCard className="p-4">
                <h4 className="text-sm font-medium">Volatility Risk</h4>
                <div className="text-2xl font-semibold">{marketDepthValue('volatilityRisk').toFixed(2)}</div>
                <p className="text-axium-gray-500 text-xs mt-1">
                  Potential risk due to market volatility.
                </p>
              </GlassCard>
            </div>
            
            <MarketDepthChart ipoId={id || ''} />
          </>
        )}
      </GlassCard>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExternalMetricsCard creatorId={id || ''} />
        <AnomalyDetectionCard ipoId={id || ''} />
      </div>
    </div>
  );
};

export default AIInsights;
