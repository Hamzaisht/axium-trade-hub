
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
        ? "w-full bg-axium-success hover:bg-axium-success/90 shadow-lg shadow-axium-success/20 rounded-2xl backdrop-blur-md" 
        : "w-full bg-axium-error hover:bg-axium-error/90 shadow-lg shadow-axium-error/20 rounded-2xl backdrop-blur-md"}
      disabled={isLoading}
    >
      {isLoading
        ? "Processing..."
        : type === "buy"
        ? `Buy ${quantity} ${symbol}`
        : `Sell ${quantity} ${symbol}`}
    </Button>
  );
};
