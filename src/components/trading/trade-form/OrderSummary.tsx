
import React from "react";

interface OrderSummaryProps {
  price: number;
  quantity: number;
}

export const OrderSummary = ({ price, quantity }: OrderSummaryProps) => {
  const subtotal = price * quantity;
  const fee = subtotal * 0.001;
  const total = subtotal + fee;

  return (
    <div className="border-t border-[#1E375F] pt-4 mt-4">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-[#8A9CCC]">Subtotal:</span>
        <span className="font-medium text-white">${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-[#8A9CCC]">Fee (0.1%):</span>
        <span className="font-medium text-white">${fee.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm font-semibold mt-3 pt-2 border-t border-[#1E375F]/50">
        <span className="text-white">Total:</span>
        <span className="text-axium-neon-blue text-glow">${total.toFixed(2)}</span>
      </div>
      <div className="mt-3 text-[11px] text-[#8A9CCC]/60 italic">
        Order will be processed at current market price. 
        Actual execution may vary slightly due to market conditions.
      </div>
    </div>
  );
};
