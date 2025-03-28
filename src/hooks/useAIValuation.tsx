
import { useState, useEffect } from "react";
import { IPO } from "@/utils/mockApi";
import useSentimentAnalysis from "./ai/useSentimentAnalysis";
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
  const { data: sentimentData, isLoading: sentimentLoading, error: sentimentError } = useSentimentAnalysis({ creatorId: ipoId });
  
  // Add market depth data
  const { 
    data: marketDepth,
    isLoading: isMarketDepthLoading
  } = useMarketDepth({ ipoId });
  
  // Add dividend info data
  const {
    data: dividendInfo,
    isLoading: isDividendInfoLoading
  } = useDividendInfo({ ipoId });
  
  // Add vesting rules data
  const {
    data: vestingRules,
    isLoading: isVestingRulesLoading
  } = useVestingRules({ ipoId });
  
  // Add liquidation rules data
  const {
    data: liquidationRules,
    isLoading: isLiquidationRulesLoading
  } = useLiquidationRules({ ipoId });

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
    marketDepth,
    isMarketDepthLoading,
    // Return dividend info data
    dividendInfo,
    isDividendInfoLoading,
    // Return vesting rules data
    vestingRules,
    isVestingRulesLoading,
    // Return liquidation rules data
    liquidationRules,
    isLiquidationRulesLoading
  };
};

export default useAIValuation;
