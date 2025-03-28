
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
  const sentimentData = sentimentAnalysis.data;
  const sentimentLoading = sentimentAnalysis.isLoading;
  const sentimentError = sentimentAnalysis.error;
  
  const marketDepth = useMarketDepth({ ipoId });
  const isMarketDepthLoading = marketDepth.isLoading;
  
  const dividendInfo = useDividendInfo({ ipoId });
  const isDividendInfoLoading = dividendInfo.isLoading;
  
  const vestingRules = useVestingRules({ ipoId });
  const isVestingRulesLoading = vestingRules.isLoading;
  
  const liquidationRules = useLiquidationRules({ ipoId });
  const isLiquidationRulesLoading = liquidationRules.isLoading;

  useEffect(() => {
    if (!ipoId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    const timer = setTimeout(() => {
      try {
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
    marketDepth: marketDepth.data,
    isMarketDepthLoading,
    dividendInfo: dividendInfo.data,
    isDividendInfoLoading,
    vestingRules: vestingRules.data,
    isVestingRulesLoading,
    liquidationRules: liquidationRules.data,
    isLiquidationRulesLoading
  };
};

export default useAIValuation;
