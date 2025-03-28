
import { useQuery } from '@tanstack/react-query';
import { mockAIValuationAPI } from '@/utils/mockApi';

interface UseDividendInfoProps {
  ipoId?: string;
  enabled?: boolean;
}

export const useDividendInfo = ({ ipoId, enabled = true }: UseDividendInfoProps) => {
  return useQuery({
    queryKey: ['dividend-info', ipoId],
    queryFn: async () => {
      if (!ipoId) {
        throw new Error('IPO ID is required');
      }
      
      return mockAIValuationAPI.getDividendInfo(ipoId);
    },
    enabled: !!ipoId && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useDividendInfo;
