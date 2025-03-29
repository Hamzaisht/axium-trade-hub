
import { supabase } from "@/integrations/supabase/client";

export async function placeOrder({
  userId,
  creatorId,
  type,
  quantity,
  price,
}: {
  userId: string
  creatorId: string
  type: "buy" | "sell"
  quantity: number
  price: number
}) {
  const { error } = await supabase.from("orders").insert([
    {
      user_id: userId,
      creator_id: creatorId,
      type,
      quantity,
      price,
    },
  ]);
  if (error) throw new Error(error.message);
}
