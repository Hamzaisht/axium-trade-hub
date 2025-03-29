
import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { IPO } from "@/utils/mockApi";
import { OrderTypeSelector } from "./OrderTypeSelector";
import { OrderInputs } from "./OrderInputs";
import { OrderSummary } from "./OrderSummary";
import { SubmitButton } from "./SubmitButton";
import { useTradeForm } from "./useTradeForm";
import { ArrowRightLeft } from "lucide-react";

interface TradeFormProps {
  ipo: IPO;
  onSuccess?: () => void;
}

const TradeForm = ({ ipo, onSuccess }: TradeFormProps) => {
  const { formData, isLoading, handleChange, handleSubmit } = useTradeForm(ipo, onSuccess);

  return (
    <GlassCard className="w-full p-6 bg-axium-dark-bg/90 border border-axium-gray-700/50 backdrop-blur-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Trade {ipo.symbol}</h2>
        <div className="flex items-center bg-axium-blue/20 text-axium-neon-blue px-2 py-1 rounded text-xs font-medium">
          <ArrowRightLeft className="w-3.5 h-3.5 mr-1" />
          Market Order
        </div>
      </div>
      
      <div className="h-0.5 bg-gradient-to-r from-axium-blue/50 via-axium-neon-blue/30 to-transparent mb-5"></div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
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
