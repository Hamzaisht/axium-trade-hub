
import React from "react";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  type: "buy" | "sell";
  quantity: number;
  symbol: string;
  isLoading: boolean;
}

export const SubmitButton = ({ type, quantity, symbol, isLoading }: SubmitButtonProps) => {
  const buyButtonStyle = {
    background: "linear-gradient(to right, rgba(0, 192, 118, 0.8), rgba(0, 192, 118, 0.7))",
    boxShadow: "0 0 20px rgba(0, 192, 118, 0.3)",
  };
  
  const sellButtonStyle = {
    background: "linear-gradient(to right, rgba(255, 87, 87, 0.8), rgba(255, 87, 87, 0.7))",
    boxShadow: "0 0 20px rgba(255, 87, 87, 0.3)",
  };
  
  return (
    <Button 
      type="submit" 
      className="w-full font-medium text-white h-12 mt-2"
      disabled={isLoading}
      style={type === "buy" ? buyButtonStyle : sellButtonStyle}
    >
      {isLoading
        ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        )
        : type === "buy"
        ? `Buy ${quantity} ${symbol}`
        : `Sell ${quantity} ${symbol}`}
    </Button>
  );
};
