import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

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
  metadata?: Json;
  timestamp: string;
}

// Type from the database that needs to be transformed
interface RawTradeEvent {
  id: string;
  creator_id: string;
  user_id: string;
  event_type: string;
  quantity?: number;
  price?: number;
  metadata?: Json;
  timestamp: string;
}

// Function to validate and convert event type
const validateEventType = (type: string): 'buy' | 'sell' | 'valuation_update' => {
  if (type === 'buy' || type === 'sell' || type === 'valuation_update') {
    return type;
  }
  console.warn(`Unknown event type: ${type}, defaulting to 'valuation_update'`);
  return 'valuation_update';
};

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
      
      // Transform the raw data to ensure event_type is correct
      const transformedData: TradeEvent[] = (data || []).map((item: RawTradeEvent) => ({
        ...item,
        event_type: validateEventType(item.event_type)
      }));
      
      return transformedData;
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
      
      // Transform to ensure correct typing
      return {
        ...data,
        event_type: validateEventType(data.event_type)
      };
    } catch (error: any) {
      toast.error(`Failed to record trade event: ${error.message}`);
      return null;
    }
  }
};
