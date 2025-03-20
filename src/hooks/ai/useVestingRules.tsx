
import { useQuery } from '@tanstack/react-query';
import { mockAIValuationAPI } from '@/utils/mockApi';
import { toast } from 'sonner';

export function useVestingRules(ipoId: string | undefined) {
  return useQuery({
    queryKey: ['vesting', ipoId],
    queryFn: async () => {
      if (!ipoId) {
        throw new Error('IPO ID is required');
      }
      
      try {
        return await mockAIValuationAPI.getVestingAndStakingRules(ipoId);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch vesting rules';
        toast.error(errorMessage);
        throw error;
      }
    },
    enabled: !!ipoId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
