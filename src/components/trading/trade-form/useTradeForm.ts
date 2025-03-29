
import { useState } from "react";
import { useTrading } from "@/contexts/TradingContext";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { IPO } from "@/utils/mockApi";
import { supabase } from "@/integrations/supabase/client";

export const useTradeForm = (ipo: IPO, onSuccess?: () => void) => {
  const { placeOrder, isLoading } = useTrading();
  const { portfolio, fetchPortfolio } = usePortfolio();
  const { user, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    type: "buy" as "buy" | "sell",
    orderType: "market" as "market" | "limit",
    price: ipo.currentPrice,
    quantity: 1
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "type" || name === "orderType") {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else if (name === "price" || name === "quantity") {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    }
    
    // If order type changes to market, update price to current price
    if (name === "orderType" && value === "market") {
      setFormData(prev => ({
        ...prev,
        price: ipo.currentPrice
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      toast.error("Please log in to place orders");
      return;
    }
    
    // Calculate total cost
    const totalCost = formData.price * formData.quantity;
    
    // For buy orders, check if user has enough cash
    if (formData.type === "buy" && portfolio) {
      if (portfolio.cash < totalCost) {
        toast.error("Insufficient funds for this transaction");
        return;
      }
    }
    
    // For sell orders, check if user owns enough tokens
    if (formData.type === "sell" && portfolio) {
      const holding = portfolio.holdings.find(h => h.ipoId === ipo.id);
      if (!holding || holding.quantity < formData.quantity) {
        toast.error("You don't own enough tokens for this transaction");
        return;
      }
    }
    
    try {
      // Store order in Supabase
      const { error: supabaseError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          creator_id: ipo.id,
          type: formData.type,
          quantity: formData.quantity,
          price: formData.price
        });
        
      if (supabaseError) {
        throw supabaseError;
      }
      
      // Also use the existing trading system
      await placeOrder({
        ipoId: ipo.id,
        type: formData.type,
        orderType: formData.orderType,
        price: formData.price,
        quantity: formData.quantity
      });
      
      // Refresh portfolio after trade
      await fetchPortfolio();
      
      toast.success(`${formData.type === "buy" ? "Buy" : "Sell"} order placed successfully`);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error is handled in the context and displayed via toast
      console.error(error);
    }
  };

  return {
    formData,
    isLoading,
    handleChange,
    handleSubmit
  };
};
