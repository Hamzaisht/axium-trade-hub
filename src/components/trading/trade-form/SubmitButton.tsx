
import React from "react";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  type: "buy" | "sell";
  quantity: number;
  symbol: string;
  isLoading: boolean;
}

export const SubmitButton = ({ type, quantity, symbol, isLoading }: SubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      className={type === "buy" 
        ? "w-full bg-[#00C076] hover:bg-[#00A060] text-white font-medium" 
        : "w-full bg-[#FF5757] hover:bg-[#E04545] text-white font-medium"}
      disabled={isLoading}
      style={{
        boxShadow: type === "buy" 
          ? "0 0 20px rgba(0, 192, 118, 0.3)" 
          : "0 0 20px rgba(255, 87, 87, 0.3)",
      }}
    >
      {isLoading
        ? "Processing..."
        : type === "buy"
        ? `Buy ${quantity} ${symbol}`
        : `Sell ${quantity} ${symbol}`}
    </Button>
  );
};
