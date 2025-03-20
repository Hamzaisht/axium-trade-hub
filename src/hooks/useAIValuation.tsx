
import { useState, useEffect, useMemo } from 'react';
import { mockAIValuationAPI } from '@/utils/mockApi';
import { AIModelType, PredictionTimeframe } from '@/utils/mockAIModels';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

interface UseAIValuationProps {
  ipoId?: string;
}

export const useAIValuation = ({ ipoId }: UseAIValuationProps) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<PredictionTimeframe>('24h');
  const [selectedModel, setSelectedModel] = useState<AIModelType>(AIModelType.HYBRID);

  // Get price prediction using the selected model and timeframe
  const pricePredictionQuery = useQuery({
    queryKey: ['price-prediction', ipoId, selectedTimeframe, selectedModel],
    queryFn: async () => {
      if (!ipoId) return null;
      try {
        return await mockAIValuationAPI.predictPriceMovement(ipoId, selectedTimeframe, selectedModel);
      } catch (error) {
        console.error('Error fetching price prediction:', error);
        return null;
      }
    },
    enabled: !!ipoId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });

  // Get market depth data
  const marketDepthQuery = useQuery({
    queryKey: ['market-depth', ipoId],
    queryFn: async () => {
      if (!ipoId) return null;
      try {
        return await mockAIValuationAPI.getMarketDepth(ipoId);
      } catch (error) {
        console.error('Error fetching market depth:', error);
        return null;
      }
    },
    enabled: !!ipoId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });

  // Get social sentiment data
  const socialSentimentQuery = useQuery({
    queryKey: ['social-sentiment', ipoId],
    queryFn: async () => {
      if (!ipoId) return null;
      try {
        return await mockAIValuationAPI.getSocialSentiment(ipoId);
      } catch (error) {
        console.error('Error fetching social sentiment:', error);
        return null;
      }
    },
    enabled: !!ipoId,
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false
  });

  // Get dividend information
  const dividendInfoQuery = useQuery({
    queryKey: ['dividend-info', ipoId],
    queryFn: async () => {
      if (!ipoId) return null;
      try {
        return await mockAIValuationAPI.getDividendInfo(ipoId);
      } catch (error) {
        console.error('Error fetching dividend info:', error);
        return null;
      }
    },
    enabled: !!ipoId,
    staleTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false
  });

  // Get vesting and staking rules
  const vestingRulesQuery = useQuery({
    queryKey: ['vesting-rules', ipoId],
    queryFn: async () => {
      if (!ipoId) return null;
      try {
        return await mockAIValuationAPI.getVestingAndStakingRules(ipoId);
      } catch (error) {
        console.error('Error fetching vesting rules:', error);
        return null;
      }
    },
    enabled: !!ipoId,
    staleTime: 1000 * 60 * 60, // 60 minutes
    refetchOnWindowFocus: false
  });

  // Get liquidation rules
  const liquidationRulesQuery = useQuery({
    queryKey: ['liquidation-rules', ipoId],
    queryFn: async () => {
      if (!ipoId) return null;
      try {
        return await mockAIValuationAPI.getLiquidationRules(ipoId);
      } catch (error) {
        console.error('Error fetching liquidation rules:', error);
        return null;
      }
    },
    enabled: !!ipoId,
    staleTime: 1000 * 60 * 60, // 60 minutes
    refetchOnWindowFocus: false
  });

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
    
    // Loading states
    isLoading,
    isPredictionLoading: pricePredictionQuery.isLoading,
    isMarketDepthLoading: marketDepthQuery.isLoading,
    isSocialSentimentLoading: socialSentimentQuery.isLoading,
    isDividendInfoLoading: dividendInfoQuery.isLoading,
    isVestingRulesLoading: vestingRulesQuery.isLoading,
    isLiquidationRulesLoading: liquidationRulesQuery.isLoading,
    
    // Errors
    hasErrors: pricePredictionQuery.error || marketDepthQuery.error || socialSentimentQuery.error,
    
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
