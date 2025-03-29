
import React from "react";
import { IPO } from "@/utils/mockApi";
import { OrderTypeSelector } from "./OrderTypeSelector";
import { OrderInputs } from "./OrderInputs";
import { OrderSummary } from "./OrderSummary";
import { SubmitButton } from "./SubmitButton";
import { useTradeForm } from "./useTradeForm";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

interface TradeFormProps {
  ipo: IPO;
  onSuccess?: () => void;
  className?: string;
}

export const TradeForm = ({ ipo, onSuccess, className }: TradeFormProps) => {
  const { formData, isLoading, handleChange, handleSubmit } = useTradeForm(ipo, onSuccess);

  return (
    <GlassCard 
      variant={formData.type === "buy" ? "blue" : "mint"}
      className={cn("transition-all duration-300", className)}
    >
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <span className={formData.type === "buy" ? "text-axium-neon-blue dark:text-axium-neon-blue" : "text-axium-neon-mint dark:text-axium-neon-mint"}>
          Trade
        </span>
        <span className="ml-2 text-foreground">{ipo.symbol}</span>
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <OrderTypeSelector 
          type={formData.type}
          orderType={formData.orderType}
          onChange={handleChange}
        />
        
        <OrderInputs 
          price={formData.price}
          quantity={formData.quantity}
          orderType={formData.orderType}
          onChange={handleChange}
        />
        
        <OrderSummary 
          price={formData.price}
          quantity={formData.quantity}
        />
        
        <SubmitButton 
          type={formData.type}
          quantity={formData.quantity}
          symbol={ipo.symbol}
          isLoading={isLoading}
        />
      </form>
    </GlassCard>
  );
};

export default TradeForm;
