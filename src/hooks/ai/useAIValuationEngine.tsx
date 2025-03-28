
import { useCallback, useEffect, useMemo } from 'react';
import { useAnomalyDetection } from './useAnomalyDetection';
import { useCreatorMarketScore } from './useCreatorMarketScore';
import { useMarketDepth } from './useMarketDepth';
import { useSocialSentiment } from './useSocialSentiment';
import { useQuery } from '@tanstack/react-query';

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

// Mock function to calculate AI valuation
const calculateAIValuation = (
  externalMetrics?: CreatorMetrics, 
  sentimentData?: any, 
  marketDepth?: MarketDepthModel,
  creatorScore?: any,
  anomalyData?: any
): AIValuationResult => {
  // Default values if data is missing
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
  const marketMetrics = marketDepth || {
    orderBookDepth: 75,
    liquidityScore: 68,
    volumeProfile: 72,
    volatilityRisk: 35,
    buyPressure: 65,
    sellPressure: 40
  };
  
  // Determine weights for each component
  const weights = {
    social: 0.25,
    brand: 0.15,
    content: 0.15,
    sentiment: 0.20,
    market: 0.25
  };
  
  // Calculate component scores (simplified)
  const socialScore = (metrics.socialFollowers / 10000000) * 100 * (metrics.socialEngagement / 10);
  const brandScore = (metrics.brandDeals / 20) * 100 * (metrics.brandValue / 1000000);
  const contentScore = (metrics.averageViews / 5000000) * 100 * (metrics.contentEngagement / 10);
  const sentimentScore = sentiment; // Already 0-100
  const marketScore = 
    (marketMetrics.orderBookDepth * 0.2) + 
    (marketMetrics.liquidityScore * 0.3) + 
    (marketMetrics.volumeProfile * 0.2) -
    (marketMetrics.volatilityRisk * 0.1) +
    (marketMetrics.buyPressure * 0.1) -
    (marketMetrics.sellPressure * 0.1);
    
  // Calculate total score
  const totalScore = (
    socialScore * weights.social +
    brandScore * weights.brand +
    contentScore * weights.content +
    sentimentScore * weights.sentiment +
    marketScore * weights.market
  ) / 100; // Normalize to 0-1 range
  
  // Map score to dollar value (simplified example)
  const baseValue = 15.0; // Base value in dollars
  const multiplier = 5.0; // Multiplier for score impact
  const calculatedValue = baseValue + (totalScore * multiplier);
  
  // Add some volatility if anomalies are detected
  const anomalyImpact = anomalyData?.detected ? 
    (anomalyData.anomalies?.reduce((acc: number, anomaly: any) => acc + (anomaly.severity / 100), 0) || 0) : 0;
  
  const valueWithVolatility = calculatedValue * (1 + (Math.random() * 0.1 - 0.05) - (anomalyImpact * 0.2));
  
  // Generate factors that affected the price
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
  // Fetch all required data sources
  const { sentimentData } = useSocialSentiment({ ipoId: ipoId || '' });
  const { data: marketDepthData } = useMarketDepth({ ipoId, enabled });
  const { score: creatorScoreData } = useCreatorMarketScore(ipoId || '');
  const { data: anomalyData } = useAnomalyDetection({ ipoId, enabled });
  
  // Use a mock for external metrics (in a real app, this would be an API call)
  const fetchExternalMetrics = useCallback(async (id: string): Promise<CreatorMetrics> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate metrics based on ipoId
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
  
  // Fetch external metrics
  const { data: externalMetrics, isLoading: isExternalMetricsLoading } = useQuery({
    queryKey: ['external-metrics', ipoId],
    queryFn: () => fetchExternalMetrics(ipoId!),
    enabled: !!ipoId && enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
  
  // Calculate valuation using AI model
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
  
  // Use query to manage caching and refetching
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['ai-valuation', ipoId, Boolean(externalMetrics), Boolean(sentimentData), Boolean(marketDepthData)],
    queryFn: calculateValuation,
    enabled: !!ipoId && enabled && !!externalMetrics,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  return {
    valuation: data,
    isLoading: isLoading || isExternalMetricsLoading,
    error,
    refetch,
    // Provide access to the underlying data sources
    dataSources: {
      externalMetrics,
      sentimentData,
      marketDepthData,
      creatorScoreData,
      anomalyData
    }
  };
};
