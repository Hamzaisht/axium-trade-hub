
import { useState, useMemo, useEffect } from 'react';
import { AIModelType, PredictionTimeframe } from '@/utils/mockAIModels';
import { toast } from 'sonner';
import useExternalData from '@/hooks/useExternalData';
import { usePricePrediction } from './usePricePrediction';
import { useMarketDepth } from './useMarketDepth';
import { useSocialSentiment } from './useSocialSentiment';
import { useDividendInfo } from './useDividendInfo';
import { useVestingRules } from './useVestingRules';
import { useLiquidationRules } from './useLiquidationRules';
import { useAnomalyDetection, useAnomalyAlerts } from './useAnomalyDetection';
import { useCreatorMarketScore } from './useCreatorMarketScore';
import { useMarketData } from '@/hooks/useMarketData';
import { useSentimentAnalysis } from './useSentimentAnalysis';

interface UseAIValuationProps {
  ipoId?: string;
}

export const useAIValuation = ({ ipoId }: UseAIValuationProps) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<PredictionTimeframe>('24h');
  const [selectedModel, setSelectedModel] = useState<AIModelType>(AIModelType.HYBRID);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Fetch external data for this creator
  const { metrics: externalMetrics, aggregatedMetrics } = useExternalData({ 
    creatorId: ipoId,
    enabled: !!ipoId 
  });

  // Get market data including recent trades for anomaly detection
  const { recentTrades } = useMarketData(ipoId);

  // Use individual hooks for each data type
  const pricePredictionQuery = usePricePrediction({
    ipoId,
    selectedTimeframe,
    selectedModel,
    externalMetricsLastUpdated: externalMetrics?.lastUpdated
  });
  
  const marketDepthQuery = useMarketDepth({ ipoId });
  
  const socialSentimentQuery = useSocialSentiment({
    ipoId,
    externalMetricsLastUpdated: externalMetrics?.lastUpdated
  });
  
  const dividendInfoQuery = useDividendInfo({ ipoId });
  const vestingRulesQuery = useVestingRules({ ipoId });
  const liquidationRulesQuery = useLiquidationRules({ ipoId });
  
  // Add anomaly detection
  const anomalyDetectionQuery = useAnomalyDetection({
    ipoId,
    recentTrades,
    enabled: !!ipoId && recentTrades.length > 0
  });
  
  // Add Creator Market Score calculation
  const creatorMarketScoreQuery = useCreatorMarketScore({
    ipoId,
    enabled: !!ipoId
  });
  
  // Add sentiment analysis
  const sentimentAnalysisQuery = useSentimentAnalysis({
    creatorId: ipoId,
    enabled: !!ipoId
  });
  
  // Setup anomaly alerts
  useAnomalyAlerts({
    anomalyData: anomalyDetectionQuery.data,
    enabled: !anomalyDetectionQuery.isLoading && !anomalyDetectionQuery.isError
  });

  // Auto-refresh setup
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    
    if (autoRefresh && ipoId) {
      // Refresh data every 15 seconds when auto-refresh is enabled
      intervalId = setInterval(() => {
        console.log('Auto-refreshing AI valuation data');
        refetchAll();
      }, 15000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh, ipoId]);

  // Determine if there's any loading happening
  const isLoading = useMemo(() => {
    return (
      pricePredictionQuery.isLoading ||
      marketDepthQuery.isLoading ||
      socialSentimentQuery.isLoading ||
      dividendInfoQuery.isLoading ||
      vestingRulesQuery.isLoading ||
      liquidationRulesQuery.isLoading ||
      anomalyDetectionQuery.isLoading ||
      creatorMarketScoreQuery.isLoading ||
      sentimentAnalysisQuery.isLoading
    );
  }, [
    pricePredictionQuery.isLoading,
    marketDepthQuery.isLoading,
    socialSentimentQuery.isLoading,
    dividendInfoQuery.isLoading,
    vestingRulesQuery.isLoading,
    liquidationRulesQuery.isLoading,
    anomalyDetectionQuery.isLoading,
    creatorMarketScoreQuery.isLoading,
    sentimentAnalysisQuery.isLoading
  ]);

  // Handle any errors from the queries
  useEffect(() => {
    const queries = [
      pricePredictionQuery,
      marketDepthQuery,
      socialSentimentQuery,
      dividendInfoQuery,
      vestingRulesQuery,
      liquidationRulesQuery,
      anomalyDetectionQuery,
      creatorMarketScoreQuery,
      sentimentAnalysisQuery
    ];

    for (const query of queries) {
      if (query.error) {
        toast.error(`Error fetching AI data: ${query.error instanceof Error ? query.error.message : 'Unknown error'}`);
        console.error('AI data fetch error:', query.error);
        break;
      }
    }
  }, [
    pricePredictionQuery.error,
    marketDepthQuery.error,
    socialSentimentQuery.error,
    dividendInfoQuery.error,
    vestingRulesQuery.error,
    liquidationRulesQuery.error,
    anomalyDetectionQuery.error,
    creatorMarketScoreQuery.error,
    sentimentAnalysisQuery.error
  ]);

  // Helper function to refresh all data
  const refetchAll = () => {
    pricePredictionQuery.refetch();
    marketDepthQuery.refetch();
    socialSentimentQuery.refetch();
    dividendInfoQuery.refetch();
    vestingRulesQuery.refetch();
    liquidationRulesQuery.refetch();
    anomalyDetectionQuery.refetch();
    creatorMarketScoreQuery.refetch();
    sentimentAnalysisQuery.refetch();
  };

  return {
    // Data
    pricePrediction: pricePredictionQuery.data,
    marketDepth: marketDepthQuery.data,
    socialSentiment: socialSentimentQuery.data,
    dividendInfo: dividendInfoQuery.data,
    vestingRules: vestingRulesQuery.data,
    liquidationRules: liquidationRulesQuery.data,
    anomalyData: anomalyDetectionQuery.data,
    creatorMarketScore: creatorMarketScoreQuery.creatorMarketScore,
    sentimentData: sentimentAnalysisQuery.sentimentData,
    externalMetrics,
    aggregatedMetrics,
    
    // Auto-refresh control
    autoRefresh,
    setAutoRefresh,
    
    // Loading states
    isLoading,
    isPredictionLoading: pricePredictionQuery.isLoading,
    isMarketDepthLoading: marketDepthQuery.isLoading,
    isSocialSentimentLoading: socialSentimentQuery.isLoading,
    isDividendInfoLoading: dividendInfoQuery.isLoading,
    isVestingRulesLoading: vestingRulesQuery.isLoading,
    isLiquidationRulesLoading: liquidationRulesQuery.isLoading,
    isAnomalyDetectionLoading: anomalyDetectionQuery.isLoading,
    isCreatorMarketScoreLoading: creatorMarketScoreQuery.isLoading,
    isSentimentAnalysisLoading: sentimentAnalysisQuery.isLoading,
    
    // Errors
    hasErrors: pricePredictionQuery.error || marketDepthQuery.error || socialSentimentQuery.error ||
               dividendInfoQuery.error || vestingRulesQuery.error || liquidationRulesQuery.error ||
               anomalyDetectionQuery.error || creatorMarketScoreQuery.isError || sentimentAnalysisQuery.isError,
    
    // Controls
    selectedTimeframe,
    setSelectedTimeframe,
    selectedModel,
    setSelectedModel,
    
    // Refetch functions
    refetchAll,
    refetchPricePrediction: () => pricePredictionQuery.refetch(),
    refetchMarketDepth: () => marketDepthQuery.refetch(),
    refetchSocialSentiment: () => socialSentimentQuery.refetch(),
    refetchDividendInfo: () => dividendInfoQuery.refetch(),
    refetchVestingRules: () => vestingRulesQuery.refetch(),
    refetchLiquidationRules: () => liquidationRulesQuery.refetch(),
    refetchAnomalyDetection: () => anomalyDetectionQuery.refetch(),
    refetchCreatorMarketScore: () => creatorMarketScoreQuery.refetch(),
    refetchSentimentAnalysis: () => sentimentAnalysisQuery.refetch()
  };
};
