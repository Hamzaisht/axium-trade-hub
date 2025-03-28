
import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { IPO } from "@/utils/mockApi";
import { OrderTypeSelector } from "./OrderTypeSelector";
import { OrderInputs } from "./OrderInputs";
import { OrderSummary } from "./OrderSummary";
import { SubmitButton } from "./SubmitButton";
import { useTradeForm } from "./useTradeForm";

interface TradeFormProps {
  ipo: IPO;
  onSuccess?: () => void;
}

const TradeForm = ({ ipo, onSuccess }: TradeFormProps) => {
  const { formData, isLoading, handleChange, handleSubmit } = useTradeForm(ipo, onSuccess);

  return (
    <GlassCard className="w-full p-6">
      <h2 className="text-2xl font-bold mb-6">Trade {ipo.symbol}</h2>
      
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
