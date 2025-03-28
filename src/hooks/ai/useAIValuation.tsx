
import { useState, useEffect } from "react";
import { IPO } from "@/utils/mockApi";
import useSentimentAnalysis from "./useSentimentAnalysis";

interface UseAIValuationProps {
  ipoId?: string;
}

export const useAIValuation = ({ ipoId }: UseAIValuationProps) => {
  const [valuation, setValuation] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { sentimentData, isLoading: sentimentLoading, error: sentimentError } = useSentimentAnalysis({ creatorId: ipoId });

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
    sentimentError
  };
};

export default useAIValuation;
