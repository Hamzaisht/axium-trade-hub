
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
      if (!ipoId) {
        throw new Error('IPO ID is required');
      }
      
      return mockAIValuationAPI.getVestingAndStakingRules(ipoId);
    },
    enabled: !!ipoId && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useVestingRules;
