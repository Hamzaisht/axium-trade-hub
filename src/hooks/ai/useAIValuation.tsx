
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

interface UseAIValuationProps {
  ipoId?: string;
}

export const useAIValuation = ({ ipoId }: UseAIValuationProps) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<PredictionTimeframe>('24h');
  const [selectedModel, setSelectedModel] = useState<AIModelType>(AIModelType.HYBRID);

  // Fetch external data for this creator
  const { metrics: externalMetrics, aggregatedMetrics } = useExternalData({ 
    creatorId: ipoId,
    enabled: !!ipoId 
  });

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

  // Determine if there's any loading happening
  const isLoading = useMemo(() => {
    return (
      pricePredictionQuery.isLoading ||
      marketDepthQuery.isLoading ||
      socialSentimentQuery.isLoading ||
      dividendInfoQuery.isLoading ||
      vestingRulesQuery.isLoading ||
      liquidationRulesQuery.isLoading
    );
  }, [
    pricePredictionQuery.isLoading,
    marketDepthQuery.isLoading,
    socialSentimentQuery.isLoading,
    dividendInfoQuery.isLoading,
    vestingRulesQuery.isLoading,
    liquidationRulesQuery.isLoading
  ]);

  // Handle any errors from the queries
  useEffect(() => {
    const queries = [
      pricePredictionQuery,
      marketDepthQuery,
      socialSentimentQuery,
      dividendInfoQuery,
      vestingRulesQuery,
      liquidationRulesQuery
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
    liquidationRulesQuery.error
  ]);

  return {
    // Data
    pricePrediction: pricePredictionQuery.data,
    marketDepth: marketDepthQuery.data,
    socialSentiment: socialSentimentQuery.data,
    dividendInfo: dividendInfoQuery.data,
    vestingRules: vestingRulesQuery.data,
    liquidationRules: liquidationRulesQuery.data,
    externalMetrics,
    aggregatedMetrics,
    
    // Loading states
    isLoading,
    isPredictionLoading: pricePredictionQuery.isLoading,
    isMarketDepthLoading: marketDepthQuery.isLoading,
    isSocialSentimentLoading: socialSentimentQuery.isLoading,
    isDividendInfoLoading: dividendInfoQuery.isLoading,
    isVestingRulesLoading: vestingRulesQuery.isLoading,
    isLiquidationRulesLoading: liquidationRulesQuery.isLoading,
    
    // Errors
    hasErrors: pricePredictionQuery.error || marketDepthQuery.error || socialSentimentQuery.error ||
               dividendInfoQuery.error || vestingRulesQuery.error || liquidationRulesQuery.error,
    
    // Controls
    selectedTimeframe,
    setSelectedTimeframe,
    selectedModel,
    setSelectedModel,
    
    // Refetch functions
    refetchAll: () => {
      pricePredictionQuery.refetch();
      marketDepthQuery.refetch();
      socialSentimentQuery.refetch();
      dividendInfoQuery.refetch();
      vestingRulesQuery.refetch();
      liquidationRulesQuery.refetch();
    },
    refetchPricePrediction: () => pricePredictionQuery.refetch(),
    refetchMarketDepth: () => marketDepthQuery.refetch(),
    refetchSocialSentiment: () => socialSentimentQuery.refetch(),
    refetchDividendInfo: () => dividendInfoQuery.refetch(),
    refetchVestingRules: () => vestingRulesQuery.refetch(),
    refetchLiquidationRules: () => liquidationRulesQuery.refetch()
  };
};
