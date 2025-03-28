
import { useQuery } from '@tanstack/react-query';
import { mockAIValuationAPI } from '@/utils/mockApi';
import { AIModelType, PredictionTimeframe } from '@/utils/mockAIModels';

export interface PriceMovement {
  direction: 'up' | 'down' | 'neutral';
  percentage: number;
}

export interface PriceMovementResponse {
  prediction: PriceMovement;
  confidence: number;
  timestamp: string;
  modelUsed: AIModelType;
  targetPrice?: number;
  factors?: string[];
}

export interface UsePricePredictionProps {
  ipoId: string;
  selectedTimeframe: PredictionTimeframe;
  selectedModel: AIModelType;
  externalMetricsLastUpdated?: string;
  enabled?: boolean;
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
        const result = await mockAIValuationAPI.predictPriceMovement(
          ipoId, 
          selectedTimeframe, 
          selectedModel
        );
        
        return {
          prediction: result.prediction,
          confidence: result.confidence,
          timestamp: result.timestamp,
          modelUsed: result.modelUsed,
          targetPrice: result.targetPrice,
          factors: result.factors
        };
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
