export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      creators: {
        Row: {
          avatar_url: string | null
          engagement: number | null
          followers: number | null
          handle: string | null
          id: string
          monthly_income: number | null
          name: string
          net_worth: number | null
          press_mentions: number | null
          slug: string
          sponsorships: number | null
          stream_views: number | null
          ticket_sales: number | null
        }
        Insert: {
          avatar_url?: string | null
          engagement?: number | null
          followers?: number | null
          handle?: string | null
          id?: string
          monthly_income?: number | null
          name: string
          net_worth?: number | null
          press_mentions?: number | null
          slug: string
          sponsorships?: number | null
          stream_views?: number | null
          ticket_sales?: number | null
        }
        Update: {
          avatar_url?: string | null
          engagement?: number | null
          followers?: number | null
          handle?: string | null
          id?: string
          monthly_income?: number | null
          name?: string
          net_worth?: number | null
          press_mentions?: number | null
          slug?: string
          sponsorships?: number | null
          stream_views?: number | null
          ticket_sales?: number | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          creator_id: string
          id: string
          price: number
          quantity: number
          timestamp: string
          type: string
          user_id: string
        }
        Insert: {
          creator_id: string
          id?: string
          price: number
          quantity: number
          timestamp?: string
          type: string
          user_id: string
        }
        Update: {
          creator_id?: string
          id?: string
          price?: number
          quantity?: number
          timestamp?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      trade_events: {
        Row: {
          creator_id: string | null
          event_type: string | null
          id: string
          metadata: Json | null
          price: number | null
          quantity: number | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          creator_id?: string | null
          event_type?: string | null
          id?: string
          metadata?: Json | null
          price?: number | null
          quantity?: number | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          creator_id?: string | null
          event_type?: string | null
          id?: string
          metadata?: Json | null
          price?: number | null
          quantity?: number | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trade_events_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
