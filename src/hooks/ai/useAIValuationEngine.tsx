
import { useCallback, useState } from 'react';
import { useAnomalyDetection } from './useAnomalyDetection';
import { useCreatorMarketScore } from './useCreatorMarketScore';
import { useMarketDepth } from './useMarketDepth';
import { useSocialSentiment } from './useSocialSentiment';
import { useQuery } from '@tanstack/react-query';
import { 
  AIModelType, 
  PredictionTimeframe,
  MarketDepthModel as EngineMarketDepthModel
} from "@/utils/mockAIModels";

export interface CreatorMetrics {
  socialFollowers: number;
  socialEngagement: number;
  brandDeals: number;
  brandValue: number;
  averageViews: number;
  contentFrequency: number;
  contentEngagement: number;
}

export interface MarketDepthModel {
  orderBookDepth: number;
  liquidityScore: number;
  volumeProfile: number;
  volatilityRisk: number;
  buyPressure: number;
  sellPressure: number;
}

export interface ValuationBreakdown {
  socialInfluence: number;
  streamingInfluence: number;
  brandDealsInfluence: number;
  sentimentInfluence: number;
  newsInfluence: number;
  marketDepthInfluence: number;
}

export interface AIValuationResult {
  currentValue: number;
  breakdown: ValuationBreakdown;
  confidence: number;
  factors: Array<{
    factor: string;
    impact: number;
    description: string;
    timestamp: string;
  }>;
  lastUpdated: string;
}

export interface UseAIValuationEngineProps {
  ipoId?: string;
  enabled?: boolean;
}

const adaptMarketDepthModel = (model: any): MarketDepthModel => {
  return {
    orderBookDepth: model?.orderBookDepth || 0,
    liquidityScore: model?.liquidityScore || 0,
    volumeProfile: model?.volumeProfile || 0,
    volatilityRisk: model?.volatilityRisk || 0,
    buyPressure: model?.buyPressure || 0,
    sellPressure: model?.sellPressure || 0
  };
};

const calculateAIValuation = (
  externalMetrics?: CreatorMetrics, 
  sentimentData?: any, 
  marketDepth?: any,
  creatorScore?: any,
  anomalyData?: any
): AIValuationResult => {
  const metrics = externalMetrics || {
    socialFollowers: 1000000,
    socialEngagement: 4.5,
    brandDeals: 12,
    brandValue: 500000,
    averageViews: 2000000,
    contentFrequency: 3,
    contentEngagement: 6.7
  };
  
  const sentiment = sentimentData?.overall || 65;
  const marketMetrics = adaptMarketDepthModel(marketDepth);
  
  const weights = {
    social: 0.25,
    brand: 0.15,
    content: 0.15,
    sentiment: 0.20,
    market: 0.25
  };
  
  const socialScore = (metrics.socialFollowers / 10000000) * 100 * (metrics.socialEngagement / 10);
  const brandScore = (metrics.brandDeals / 20) * 100 * (metrics.brandValue / 1000000);
  const contentScore = (metrics.averageViews / 5000000) * 100 * (metrics.contentEngagement / 10);
  const sentimentScore = sentiment;
  const marketScore = 
    (marketMetrics.orderBookDepth * 0.2) + 
    (marketMetrics.liquidityScore * 0.3) + 
    (marketMetrics.volumeProfile * 0.2) -
    (marketMetrics.volatilityRisk * 0.1) +
    (marketMetrics.buyPressure * 0.1) -
    (marketMetrics.sellPressure * 0.1);
    
  const totalScore = (
    socialScore * weights.social +
    brandScore * weights.brand +
    contentScore * weights.content +
    sentimentScore * weights.sentiment +
    marketScore * weights.market
  ) / 100;
  
  const baseValue = 15.0;
  const multiplier = 5.0;
  const calculatedValue = baseValue + (totalScore * multiplier);
  
  const anomalyImpact = anomalyData?.detected ? 
    (anomalyData.anomalies?.reduce((acc: number, anomaly: any) => acc + (anomaly.severity / 100), 0) || 0) : 0;
  
  const valueWithVolatility = calculatedValue * (1 + (Math.random() * 0.1 - 0.05) - (anomalyImpact * 0.2));
  
  const factors = [
    {
      factor: 'Social Media',
      impact: socialScore * weights.social / 10,
      description: 'Engagement metrics and follower growth',
      timestamp: new Date().toISOString()
    },
    {
      factor: 'Brand Deals',
      impact: brandScore * weights.brand / 10,
      description: 'Recent sponsorships and partnership value',
      timestamp: new Date().toISOString()
    },
    {
      factor: 'Content Performance',
      impact: contentScore * weights.content / 10,
      description: 'View counts and audience retention rates',
      timestamp: new Date().toISOString()
    },
    {
      factor: 'Market Sentiment',
      impact: sentimentScore * weights.sentiment / 10,
      description: 'Social sentiment and public perception',
      timestamp: new Date().toISOString()
    },
    {
      factor: 'Market Dynamics',
      impact: marketScore * weights.market / 10,
      description: 'Order book depth and trading patterns',
      timestamp: new Date().toISOString()
    }
  ].sort((a, b) => b.impact - a.impact);
  
  return {
    currentValue: parseFloat(valueWithVolatility.toFixed(2)),
    breakdown: {
      socialInfluence: socialScore * weights.social,
      streamingInfluence: contentScore * weights.content * 0.6,
      brandDealsInfluence: brandScore * weights.brand,
      sentimentInfluence: sentimentScore * weights.sentiment,
      newsInfluence: sentimentScore * weights.sentiment * 0.3,
      marketDepthInfluence: marketScore * weights.market
    },
    confidence: Math.min(95, Math.max(65, 80 + (sentiment - 50) / 10)),
    factors,
    lastUpdated: new Date().toISOString()
  };
};

export const useAIValuationEngine = ({
  ipoId,
  enabled = true
}: UseAIValuationEngineProps) => {
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);
  
  const { data: sentimentData } = useSocialSentiment({ ipoId: ipoId || '' });
  const { data: marketDepthData } = useMarketDepth({ ipoId, enabled });
  // Fix the type issue by passing an object instead of a string
  const { data: creatorScoreData } = useCreatorMarketScore({ creatorId: ipoId || '' });
  const { data: anomalyData } = useAnomalyDetection({ ipoId, enabled });
  
  const toggleRealTime = useCallback(() => {
    setIsRealTimeEnabled(prev => !prev);
  }, []);
  
  const fetchExternalMetrics = useCallback(async (id: string): Promise<CreatorMetrics> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const hashCode = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash);
    };
    
    const hash = hashCode(id);
    
    return {
      socialFollowers: 500000 + (hash % 9500000),
      socialEngagement: 1 + (hash % 9),
      brandDeals: 1 + (hash % 30),
      brandValue: 50000 + (hash % 2000000),
      averageViews: 100000 + (hash % 4900000),
      contentFrequency: 1 + (hash % 7),
      contentEngagement: 1 + (hash % 9)
    };
  }, []);
  
  const { data: externalMetrics, isLoading: isExternalMetricsLoading } = useQuery({
    queryKey: ['external-metrics', ipoId],
    queryFn: () => fetchExternalMetrics(ipoId!),
    enabled: !!ipoId && enabled,
    staleTime: 1000 * 60 * 10,
  });
  
  const calculateValuation = useCallback(() => {
    if (!ipoId) return null;
    
    return calculateAIValuation(
      externalMetrics,
      sentimentData,
      marketDepthData,
      creatorScoreData,
      anomalyData
    );
  }, [ipoId, externalMetrics, sentimentData, marketDepthData, creatorScoreData, anomalyData]);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['ai-valuation', ipoId, Boolean(externalMetrics), Boolean(sentimentData), Boolean(marketDepthData)],
    queryFn: calculateValuation,
    enabled: !!ipoId && enabled && !!externalMetrics,
    staleTime: 1000 * 60 * 5,
  });
  
  return {
    valuation: data,
    data, // Add the data property to fix missing data error
    isLoading: isLoading || isExternalMetricsLoading,
    error,
    refetch,
    toggleRealTime,
    isRealTimeEnabled,
    rawMetrics: data?.breakdown,
    dataSources: {
      externalMetrics,
      sentimentData,
      marketDepthData,
      creatorScoreData,
      anomalyData
    }
  };
};
