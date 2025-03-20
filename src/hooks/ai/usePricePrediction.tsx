
import { useQuery } from '@tanstack/react-query';
import { mockAIValuationAPI } from '@/utils/mockApi';
import { AIModelType, PredictionTimeframe } from '@/utils/mockAIModels';

interface UsePricePredictionProps {
  ipoId?: string;
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
  return useQuery({
    queryKey: ['price-prediction', ipoId, selectedTimeframe, selectedModel, externalMetricsLastUpdated],
    queryFn: async () => {
      if (!ipoId) return null;
      try {
        return await mockAIValuationAPI.predictPriceMovement(
          ipoId, 
          selectedTimeframe, 
          selectedModel
        );
      } catch (error) {
        console.error('Error fetching price prediction:', error);
        return null;
      }
    },
    enabled: !!ipoId && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });
};
