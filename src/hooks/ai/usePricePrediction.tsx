
import { useQuery } from '@tanstack/react-query';
import { mockAIValuationAPI } from '@/utils/mockApi';
import { AIModelType, PredictionTimeframe } from '@/utils/mockAIModels';

export interface UsePricePredictionProps {
  ipoId: string;
  selectedTimeframe: PredictionTimeframe;
  selectedModel: AIModelType;
  externalMetricsLastUpdated?: string;
  enabled?: boolean;
}

export interface PriceMovementResponse {
  prediction: {
    direction: 'up' | 'down' | 'neutral';
    percentage: number;
  };
  confidence: number;
  timestamp: string;
  modelUsed: AIModelType;
}

export const usePricePrediction = ({ 
  ipoId, 
  selectedTimeframe, 
  selectedModel, 
  externalMetricsLastUpdated,
  enabled = true 
}: UsePricePredictionProps) => {
  return useQuery<PriceMovementResponse, Error>({
    queryKey: ['price-prediction', ipoId, selectedTimeframe, selectedModel, externalMetricsLastUpdated],
    queryFn: async () => {
      if (!ipoId) throw new Error("IPO ID is required");
      
      try {
        return await mockAIValuationAPI.predictPriceMovement(
          ipoId, 
          selectedTimeframe, 
          selectedModel
        );
      } catch (error) {
        console.error('Error fetching price prediction:', error);
        throw error;
      }
    },
    enabled: !!ipoId && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });
};
