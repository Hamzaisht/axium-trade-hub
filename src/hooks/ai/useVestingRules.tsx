
import { useQuery } from '@tanstack/react-query';
import { mockAIValuationAPI } from '@/utils/mockApi';

interface UseVestingRulesProps {
  ipoId?: string;
}

export const useVestingRules = ({ ipoId }: UseVestingRulesProps) => {
  return useQuery({
    queryKey: ['vesting-rules', ipoId],
    queryFn: async () => {
      if (!ipoId) {
        throw new Error('IPO ID is required');
      }
      
      return mockAIValuationAPI.getVestingAndStakingRules(ipoId);
    },
    enabled: !!ipoId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useVestingRules;
