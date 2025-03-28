
import { useState, useEffect } from "react";
import { useSentimentAnalysis } from "./ai/useSentimentAnalysis";
import { useMarketDepth } from "./ai/useMarketDepth";
import { useDividendInfo } from "./ai/useDividendInfo";
import { useVestingRules } from "./ai/useVestingRules";
import { useLiquidationRules } from "./ai/useLiquidationRules";

interface UseAIValuationProps {
  ipoId?: string;
}

export const useAIValuation = ({ ipoId }: UseAIValuationProps) => {
  const [valuation, setValuation] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const sentimentAnalysis = useSentimentAnalysis({ creatorId: ipoId });
  const sentimentData = sentimentAnalysis.sentimentData;
  const sentimentLoading = sentimentAnalysis.isLoading;
  const sentimentError = sentimentAnalysis.error;
  
  // Add market depth data with correct props
  const marketDepth = useMarketDepth({ ipoId });
  const isMarketDepthLoading = marketDepth.isLoading;
  
  // Add dividend info data with correct props
  const dividendInfo = useDividendInfo({ ipoId });
  const isDividendInfoLoading = dividendInfo.isLoading;
  
  // Add vesting rules data with correct props
  const vestingRules = useVestingRules({ ipoId });
  const isVestingRulesLoading = vestingRules.isLoading;
  
  // Add liquidation rules data with correct props
  const liquidationRules = useLiquidationRules({ ipoId });
  const isLiquidationRulesLoading = liquidationRules.isLoading;

  useEffect(() => {
    if (!ipoId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call with setTimeout
    const timer = setTimeout(() => {
      try {
        // Generate mock AI valuation
        // In a real app, this would be an API call to an AI valuation service
        const mockValuation = Math.floor(60 + Math.random() * 40); // 60-100
        setValuation(mockValuation);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setIsLoading(false);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [ipoId]);

  return {
    valuation,
    isLoading,
    error,
    sentimentData,
    sentimentLoading,
    sentimentError,
    // Return market depth data
    marketDepth: marketDepth.data,
    isMarketDepthLoading,
    // Return dividend info data
    dividendInfo: dividendInfo.data,
    isDividendInfoLoading,
    // Return vesting rules data
    vestingRules: vestingRules.data,
    isVestingRulesLoading,
    // Return liquidation rules data
    liquidationRules: liquidationRules.data,
    isLiquidationRulesLoading
  };
};

export default useAIValuation;
