
import { useQuery } from '@tanstack/react-query';
import { mockAIValuationAPI } from '@/utils/mockApi';

interface UseVestingRulesProps {
  ipoId?: string;
  enabled?: boolean;
}

export const useVestingRules = ({ ipoId, enabled = true }: UseVestingRulesProps) => {
  return useQuery({
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
    enabled: !!ipoId && enabled,
    staleTime: 1000 * 60 * 60, // 60 minutes
    refetchOnWindowFocus: false
  });
};
