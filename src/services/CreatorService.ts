
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Creator {
  id: string;
  slug: string;
  name: string;
  handle?: string;
  avatar_url?: string;
  followers?: number;
  engagement?: number;
  monthly_income?: number;
  sponsorships?: number;
  net_worth?: number;
  press_mentions?: number;
  stream_views?: number;
  ticket_sales?: number;
}

export interface TradeEvent {
  id: string;
  creator_id: string;
  user_id: string;
  event_type: 'buy' | 'sell' | 'valuation_update';
  quantity?: number;
  price?: number;
  metadata?: any;
  timestamp: string;
}

export const CreatorService = {
  async getCreators(): Promise<Creator[]> {
    try {
      const { data, error } = await supabase
        .from('creators')
        .select('*');
      
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      toast.error(`Failed to fetch creators: ${error.message}`);
      return [];
    }
  },

  async getCreatorBySlug(slug: string): Promise<Creator | null> {
    try {
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      toast.error(`Failed to fetch creator: ${error.message}`);
      return null;
    }
  },

  async getTradeEvents(creatorId: string): Promise<TradeEvent[]> {
    try {
      const { data, error } = await supabase
        .from('trade_events')
        .select('*')
        .eq('creator_id', creatorId)
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      toast.error(`Failed to fetch trade events: ${error.message}`);
      return [];
    }
  },

  async recordTradeEvent(event: Omit<TradeEvent, 'id' | 'timestamp'>): Promise<TradeEvent | null> {
    try {
      const { data, error } = await supabase
        .from('trade_events')
        .insert(event)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      toast.error(`Failed to record trade event: ${error.message}`);
      return null;
    }
  }
};
