
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
      if (!ipoId) return null;
      try {
        return await mockAIValuationAPI.getLiquidationRules(ipoId);
      } catch (error) {
        console.error('Error fetching liquidation rules:', error);
        throw error;
      }
    },
    enabled: !!ipoId && enabled,
    staleTime: 1000 * 60 * 60, // 60 minutes
    refetchOnWindowFocus: false
  });
};
