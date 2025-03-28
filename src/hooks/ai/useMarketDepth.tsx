
import { useQuery } from '@tanstack/react-query';
import { mockAIValuationAPI } from '@/utils/mockApi';

export interface UseMarketDepthProps {
  ipoId?: string;
  enabled?: boolean;
}

export const useMarketDepth = ({ 
  ipoId, 
  enabled = true 
}: UseMarketDepthProps) => {
  return useQuery({
    queryKey: ['market-depth', ipoId],
    queryFn: async () => {
      if (!ipoId) return null;
      try {
        return await mockAIValuationAPI.getMarketDepth(ipoId);
      } catch (error) {
        console.error('Error fetching market depth:', error);
        throw error;
      }
    },
    enabled: !!ipoId && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60, // Refetch every minute
  });
};
