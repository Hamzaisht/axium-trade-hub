
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useExternalData } from '@/hooks/useExternalData';
import { useSocialSentiment } from './useSocialSentiment';
import { useMarketDepth } from './useMarketDepth';
import { useAnomalyDetection } from './useAnomalyDetection';
import { useCreatorMarketScore } from './useCreatorMarketScore';

export interface ValuationBreakdown {
  socialInfluence: {
    weight: number;
    value: number;
    breakdown: {
      twitter: number;
      instagram: number;
      tiktok: number;
      youtube: number;
      twitch: number;
    };
  };
  streamingInfluence: {
    weight: number;
    value: number;
    breakdown: {
      spotify: number;
      appleMusic: number;
      youtube: number;
    };
  };
  brandDealsInfluence: {
    weight: number;
    value: number;
  };
  sentimentInfluence: {
    weight: number;
    value: number;
  };
  financialInfluence: {
    weight: number;
    value: number;
    breakdown: {
      yearlyIncome: number;
      netWorth: number;
      ownedCompanies: number;
    };
  };
  fanEngagementInfluence: {
    weight: number;
    value: number;
  };
}

export interface AIValuationResult {
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  confidence: number;
  volatility: number;
  lastUpdated: string;
  valuationBreakdown: ValuationBreakdown;
  historicalPrices: Array<{
    timestamp: string;
    price: number;
    confidence: number;
  }>;
  marketMovers: Array<{
    factor: string;
    impact: number;
    description: string;
    timestamp: string;
  }>;
}

const calculateWeightedValue = (metrics: any, weights: Record<string, number>) => {
  if (!metrics) return 0;
  
  let total = 0;
  let weightSum = 0;
  
  Object.entries(weights).forEach(([key, weight]) => {
    if (metrics[key] !== undefined) {
      total += metrics[key] * weight;
      weightSum += weight;
    }
  });
  
  return weightSum > 0 ? total / weightSum : 0;
};

export const useAIValuationEngine = (ipoId?: string, timeframe: string = '1d') => {
  const [valuation, setValuation] = useState<AIValuationResult | null>(null);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  
  // Fetch external metrics
  const { metrics: externalMetrics, aggregatedMetrics } = useExternalData({
    creatorId: ipoId,
    enabled: !!ipoId
  });
  
  // Fetch sentiment data
  const { sentimentData, isLoading: isSentimentLoading } = useSocialSentiment({
    ipoId,
    enabled: !!ipoId
  });
  
  // Fetch market depth data
  const { data: marketDepth, isLoading: isMarketDepthLoading } = useMarketDepth({ ipoId });
  
  // Get creator market score
  const { 
    creatorMarketScore, 
    isLoading: isScoreLoading,
    anomalyData
  } = useCreatorMarketScore({ ipoId });
  
  // Combine all data sources to calculate valuation
  const valuationQuery = useQuery({
    queryKey: ['ai-valuation', ipoId, timeframe, externalMetrics?.lastUpdated, sentimentData?.lastUpdated],
    queryFn: async () => {
      if (!ipoId || !externalMetrics || !sentimentData) return null;
      
      try {
        // Simulate AI calculations with weighted formula
        const socialData = externalMetrics.social || [];
        const streamingData = externalMetrics.streaming || [];
        const brandDeals = externalMetrics.brandDeals || [];
        
        // Calculate social influence (20% weight in total valuation)
        const socialWeights = {
          twitter: 0.3,
          instagram: 0.25,
          tiktok: 0.25,
          youtube: 0.15,
          twitch: 0.05
        };
        
        const socialBreakdown = {
          twitter: socialData.find(p => p.platform.toLowerCase() === 'twitter')?.engagement || 0,
          instagram: socialData.find(p => p.platform.toLowerCase() === 'instagram')?.engagement || 0,
          tiktok: socialData.find(p => p.platform.toLowerCase() === 'tiktok')?.engagement || 0,
          youtube: socialData.find(p => p.platform.toLowerCase() === 'youtube')?.engagement || 0,
          twitch: socialData.find(p => p.platform.toLowerCase() === 'twitch')?.engagement || 0
        };
        
        const socialValue = calculateWeightedValue(socialBreakdown, socialWeights);
        
        // Calculate streaming influence (15% weight in total valuation)
        const streamingWeights = {
          spotify: 0.4,
          appleMusic: 0.3,
          youtube: 0.3
        };
        
        const streamingBreakdown = {
          spotify: streamingData.find(p => p.platform.toLowerCase() === 'spotify')?.streams || 0,
          appleMusic: streamingData.find(p => p.platform.toLowerCase() === 'apple music')?.streams || 0,
          youtube: streamingData.find(p => p.platform.toLowerCase() === 'youtube music')?.streams || 0
        };
        
        const streamingValue = calculateWeightedValue(streamingBreakdown, streamingWeights);
        
        // Calculate brand deals influence (25% weight in total valuation)
        const brandDealsValue = brandDeals.reduce((sum, deal) => sum + deal.dealValue, 0) / 10000;
        
        // Sentiment influence (15% weight in total valuation)
        const sentimentValue = sentimentData.overall || 0;
        
        // Financial data (mock, 15% weight in total valuation)
        const financialBreakdown = {
          yearlyIncome: Math.random() * 10000000,  // Mock yearly income
          netWorth: Math.random() * 100000000,     // Mock net worth
          ownedCompanies: Math.floor(Math.random() * 5) // Mock number of owned companies
        };
        
        const financialValue = (
          (financialBreakdown.yearlyIncome / 1000000) * 0.4 + 
          (financialBreakdown.netWorth / 10000000) * 0.4 + 
          financialBreakdown.ownedCompanies * 0.2
        );
        
        // Fan engagement (10% weight in total valuation)
        const fanEngagementValue = (
          (socialValue * 0.5) + 
          (streamingValue * 0.3) + 
          (sentimentValue * 0.2)
        );
        
        // Calculate weighted total
        const totalValue = (
          (socialValue * 0.2) + 
          (streamingValue * 0.15) + 
          (brandDealsValue * 0.25) + 
          (sentimentValue * 0.15) + 
          (financialValue * 0.15) + 
          (fanEngagementValue * 0.1)
        );
        
        // Apply volatility and confidence factors
        const volatility = 0.02 + (Math.random() * 0.08); // 2% to 10%
        const confidence = 0.7 + (Math.random() * 0.3); // 70% to 100%
        
        // Adjust price based on volatility and sentiment
        const basePrice = Math.max(5 + (totalValue * 0.01), 1);
        const adjustedPrice = basePrice * (1 + ((Math.random() - 0.5) * volatility));
        
        // Generate historical price data based on the timeframe
        const historicalPrices = generateHistoricalPrices(adjustedPrice, timeframe, volatility);
        const previousPrice = historicalPrices[historicalPrices.length - 2]?.price || adjustedPrice * 0.95;
        
        // Market movers (factors that influenced the price)
        const marketMovers = generateMarketMovers(sentimentData, socialData, streamingData);
        
        return {
          currentPrice: parseFloat(adjustedPrice.toFixed(2)),
          priceChange: parseFloat((adjustedPrice - previousPrice).toFixed(2)),
          priceChangePercent: parseFloat((((adjustedPrice - previousPrice) / previousPrice) * 100).toFixed(2)),
          confidence: parseFloat(confidence.toFixed(2)),
          volatility: parseFloat(volatility.toFixed(2)),
          lastUpdated: new Date().toISOString(),
          valuationBreakdown: {
            socialInfluence: {
              weight: 0.2,
              value: socialValue,
              breakdown: socialBreakdown
            },
            streamingInfluence: {
              weight: 0.15,
              value: streamingValue,
              breakdown: streamingBreakdown
            },
            brandDealsInfluence: {
              weight: 0.25,
              value: brandDealsValue
            },
            sentimentInfluence: {
              weight: 0.15,
              value: sentimentValue
            },
            financialInfluence: {
              weight: 0.15,
              value: financialValue,
              breakdown: financialBreakdown
            },
            fanEngagementInfluence: {
              weight: 0.1,
              value: fanEngagementValue
            }
          },
          historicalPrices,
          marketMovers
        };
      } catch (error) {
        console.error("Error calculating AI valuation:", error);
        throw error;
      }
    },
    enabled: !!ipoId && !!externalMetrics && !!sentimentData,
    refetchInterval: isRealTimeEnabled ? 10000 : false, // Real-time updates every 10 seconds if enabled
    staleTime: 5000
  });
  
  // Real-time updates
  useEffect(() => {
    if (valuationQuery.data) {
      setValuation(valuationQuery.data);
    }
  }, [valuationQuery.data]);
  
  return {
    valuation,
    isLoading: valuationQuery.isLoading || isSentimentLoading || isMarketDepthLoading || isScoreLoading,
    isError: valuationQuery.isError,
    error: valuationQuery.error,
    refetch: valuationQuery.refetch,
    toggleRealTime: () => setIsRealTimeEnabled(prev => !prev),
    isRealTimeEnabled,
    rawMetrics: {
      externalMetrics,
      sentimentData,
      marketDepth,
      creatorMarketScore,
      anomalyData
    }
  };
};

// Helper function to generate historical prices based on timeframe
const generateHistoricalPrices = (currentPrice: number, timeframe: string, volatility: number) => {
  const now = new Date();
  const prices: Array<{ timestamp: string; price: number; confidence: number }> = [];
  
  let dataPoints = 24; // Default for 1d
  let interval = 60 * 60 * 1000; // 1 hour in milliseconds
  
  switch (timeframe) {
    case '1m':
      dataPoints = 60;
      interval = 60 * 1000; // 1 minute
      break;
    case '5m':
      dataPoints = 60;
      interval = 5 * 60 * 1000; // 5 minutes
      break;
    case '15m':
      dataPoints = 60;
      interval = 15 * 60 * 1000; // 15 minutes
      break;
    case '1h':
      dataPoints = 24;
      interval = 60 * 60 * 1000; // 1 hour
      break;
    case '1d':
      dataPoints = 24;
      interval = 60 * 60 * 1000; // 1 hour
      break;
    case '1w':
      dataPoints = 7;
      interval = 24 * 60 * 60 * 1000; // 1 day
      break;
    case '1mo':
      dataPoints = 30;
      interval = 24 * 60 * 60 * 1000; // 1 day
      break;
    default:
      dataPoints = 24;
      interval = 60 * 60 * 1000; // 1 hour
  }
  
  // Start from the past based on timeframe and data points
  let startTime = new Date(now.getTime() - (dataPoints * interval));
  
  // Create a somewhat realistic price trend (random walk with mean reversion)
  let basePrice = currentPrice * 0.85;
  let trend = Math.random() > 0.5 ? 0.001 : -0.001; // Slight upward or downward trend
  
  for (let i = 0; i < dataPoints; i++) {
    const timestamp = new Date(startTime.getTime() + (i * interval)).toISOString();
    
    // Random walk with mean reversion to create somewhat realistic price movements
    const randomWalk = (Math.random() - 0.5) * volatility * basePrice;
    const meanReversion = (currentPrice - basePrice) * 0.05; // Pull towards current price
    
    basePrice = basePrice + randomWalk + meanReversion + (basePrice * trend);
    
    // Ensure price is positive and has reasonable number of decimals
    const price = parseFloat(Math.max(basePrice, 0.01).toFixed(2));
    
    // Random confidence between 0.7 and 1.0
    const confidence = parseFloat((0.7 + Math.random() * 0.3).toFixed(2));
    
    prices.push({ timestamp, price, confidence });
  }
  
  // Ensure the last price is exactly the current price
  prices.push({
    timestamp: now.toISOString(),
    price: currentPrice,
    confidence: 0.95 // High confidence for current price
  });
  
  return prices;
};

// Helper function to generate market movers
const generateMarketMovers = (
  sentimentData: any,
  socialData: any[],
  streamingData: any[]
) => {
  const marketMovers = [];
  const now = new Date();
  
  // Add sentiment-based market mover
  if (sentimentData && sentimentData.overall) {
    const sentiment = sentimentData.overall > 70 ? 'positive' : sentimentData.overall < 40 ? 'negative' : 'neutral';
    const impact = ((sentimentData.overall - 50) / 50) * 5; // Scale to -5% to +5%
    
    marketMovers.push({
      factor: 'Social Sentiment',
      impact: parseFloat(impact.toFixed(2)),
      description: `${sentiment.charAt(0).toUpperCase() + sentiment.slice(1)} sentiment in social media ${impact > 0 ? 'boosted' : 'decreased'} creator value`,
      timestamp: new Date(now.getTime() - Math.random() * 60 * 60 * 1000).toISOString() // Random time in last hour
    });
  }
  
  // Add social media based market mover
  if (socialData && socialData.length > 0) {
    const randomPlatform = socialData[Math.floor(Math.random() * socialData.length)];
    if (randomPlatform) {
      const growth = randomPlatform.growth || Math.random() * 10 - 2; // -2% to +8% growth
      const impact = growth * 0.3; // Scale growth to price impact
      
      marketMovers.push({
        factor: `${randomPlatform.platform} Growth`,
        impact: parseFloat(impact.toFixed(2)),
        description: `${Math.abs(growth).toFixed(1)}% ${growth > 0 ? 'increase' : 'decrease'} in ${randomPlatform.platform} followers`,
        timestamp: new Date(now.getTime() - Math.random() * 120 * 60 * 1000).toISOString() // Random time in last 2 hours
      });
    }
  }
  
  // Add streaming based market mover
  if (streamingData && streamingData.length > 0) {
    const randomPlatform = streamingData[Math.floor(Math.random() * streamingData.length)];
    if (randomPlatform) {
      const streamChange = (Math.random() * 20) - 5; // -5% to +15% in streaming
      const impact = streamChange * 0.2; // Scale to price impact
      
      marketMovers.push({
        factor: `${randomPlatform.platform} Streams`,
        impact: parseFloat(impact.toFixed(2)),
        description: `${Math.abs(streamChange).toFixed(1)}% ${streamChange > 0 ? 'increase' : 'decrease'} in ${randomPlatform.platform} streaming activity`,
        timestamp: new Date(now.getTime() - Math.random() * 180 * 60 * 1000).toISOString() // Random time in last 3 hours
      });
    }
  }
  
  // Add brand deal market mover (random)
  if (Math.random() > 0.5) {
    const brands = ['Nike', 'Adidas', 'Puma', 'Coca-Cola', 'Pepsi', 'Apple', 'Samsung', 'Google', 'Amazon', 'Microsoft'];
    const randomBrand = brands[Math.floor(Math.random() * brands.length)];
    const dealImpact = 2 + Math.random() * 8; // 2% to 10% impact
    
    marketMovers.push({
      factor: 'Brand Deal',
      impact: parseFloat(dealImpact.toFixed(2)),
      description: `New brand partnership with ${randomBrand} announced`,
      timestamp: new Date(now.getTime() - Math.random() * 240 * 60 * 1000).toISOString() // Random time in last 4 hours
    });
  }
  
  // Add news event market mover (random)
  if (Math.random() > 0.7) {
    const newsEvents = [
      { event: 'TV Appearance', impact: 3.5 },
      { event: 'Viral Social Post', impact: 2.8 },
      { event: 'Award Nomination', impact: 4.2 },
      { event: 'Charity Event', impact: 1.5 },
      { event: 'Product Launch', impact: 5.1 },
      { event: 'Controversy', impact: -3.2 },
      { event: 'Collaboration Announcement', impact: 2.9 }
    ];
    
    const randomNews = newsEvents[Math.floor(Math.random() * newsEvents.length)];
    
    marketMovers.push({
      factor: 'News Event',
      impact: randomNews.impact,
      description: `${randomNews.event} ${randomNews.impact > 0 ? 'positively' : 'negatively'} impacted creator value`,
      timestamp: new Date(now.getTime() - Math.random() * 300 * 60 * 1000).toISOString() // Random time in last 5 hours
    });
  }
  
  return marketMovers.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact)); // Sort by absolute impact
};

export default useAIValuationEngine;
