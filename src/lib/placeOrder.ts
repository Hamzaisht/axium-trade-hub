
import { toast } from "sonner";
import { showNotification } from "@/components/notifications/ToastContainer";
import { supabase } from "@/integrations/supabase/client";

interface PlaceOrderParams {
  userId: string;
  creatorId: string;
  type: "buy" | "sell";
  quantity: number;
  price: number;
  symbol?: string;
}

/**
 * Place an order and store it in Supabase
 * 
 * @param params Order parameters
 * @returns Promise with the result of the operation
 */
export const placeOrder = async (params: PlaceOrderParams): Promise<{ success: boolean; error?: any }> => {
  const { userId, creatorId, type, quantity, price, symbol } = params;
  
  try {
    // Insert order into Supabase
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        creator_id: creatorId,
        type,
        quantity,
        price
      });

    if (error) {
      throw error;
    }

    // Show success notification
    toast.success(
      `${type === "buy" ? "Buy" : "Sell"} Order Submitted`,
      {
        description: `${quantity} ${symbol || 'tokens'} at $${price} ($${(quantity * price).toFixed(2)})`,
      }
    );
    
    showNotification.success(
      `${type === "buy" ? "Buy" : "Sell"} order executed successfully!`
    );

    return { success: true };
  } catch (error) {
    console.error("Error submitting order:", error);
    
    toast.error("Order Failed", {
      description: "There was an error placing your order."
    });
    
    showNotification.error(
      "Failed to place order. Please try again."
    );
    
    return { success: false, error };
  }
};
