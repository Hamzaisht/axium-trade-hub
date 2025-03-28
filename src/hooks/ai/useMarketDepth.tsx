
import { useQuery } from '@tanstack/react-query';
import { mockAIValuationAPI } from '@/utils/mockApi';

interface UseMarketDepthProps {
  ipoId?: string;
}

export const useMarketDepth = ({ ipoId }: UseMarketDepthProps) => {
  return useQuery({
    queryKey: ['market-depth', ipoId],
    queryFn: async () => {
      if (!ipoId) {
        throw new Error('IPO ID is required');
      }
      
      return mockAIValuationAPI.getMarketDepth(ipoId);
    },
    enabled: !!ipoId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useMarketDepth;
