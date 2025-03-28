
import { useQuery } from '@tanstack/react-query';
import { mockAIValuationAPI } from '@/utils/mockApi';

interface UseDividendInfoProps {
  ipoId?: string;
}

export const useDividendInfo = ({ ipoId }: UseDividendInfoProps) => {
  return useQuery({
    queryKey: ['dividend-info', ipoId],
    queryFn: async () => {
      if (!ipoId) {
        throw new Error('IPO ID is required');
      }
      
      return mockAIValuationAPI.getDividendInfo(ipoId);
    },
    enabled: !!ipoId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useDividendInfo;
