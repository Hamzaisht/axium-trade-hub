
import { useQuery } from '@tanstack/react-query';
import { mockAIValuationAPI } from '@/utils/mockApi';

interface UseLiquidationRulesProps {
  ipoId?: string;
  enabled?: boolean;
}

export const useLiquidationRules = ({ ipoId, enabled = true }: UseLiquidationRulesProps) => {
  return useQuery({
    queryKey: ['liquidation-rules', ipoId],
    queryFn: async () => {
      if (!ipoId) {
        throw new Error('IPO ID is required');
      }
      
      return mockAIValuationAPI.getLiquidationRules(ipoId);
    },
    enabled: !!ipoId && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useLiquidationRules;
