
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreatorService, Creator, TradeEvent } from '@/services/CreatorService';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export function useCreators() {
  return useQuery({
    queryKey: ['creators'],
    queryFn: CreatorService.getCreators,
  });
}

export function useCreatorBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['creator', slug],
    queryFn: () => slug ? CreatorService.getCreatorBySlug(slug) : null,
    enabled: !!slug,
  });
}

export function useTradeEvents(creatorId: string | undefined) {
  return useQuery({
    queryKey: ['tradeEvents', creatorId],
    queryFn: () => creatorId ? CreatorService.getTradeEvents(creatorId) : [],
    enabled: !!creatorId,
  });
}

export function useRecordTradeEvent() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (event: Omit<TradeEvent, 'id' | 'timestamp' | 'user_id'>) => {
      if (!user) {
        throw new Error('User must be logged in to record trade events');
      }
      
      return CreatorService.recordTradeEvent({
        ...event,
        user_id: user.id,
      });
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['tradeEvents', data.creator_id] });
        // Don't show toast for view events
        if (!data.metadata || !data.metadata.action || data.metadata.action !== 'view_profile') {
          toast.success('Trade recorded successfully');
        }
      }
    },
  });
}
