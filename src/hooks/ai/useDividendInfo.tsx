
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
      if (!ipoId) return null;
      try {
        return await mockAIValuationAPI.getDividendInfo(ipoId);
      } catch (error) {
        console.error('Error fetching dividend info:', error);
        return null;
      }
    },
    enabled: !!ipoId && enabled,
    staleTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false
  });
};
