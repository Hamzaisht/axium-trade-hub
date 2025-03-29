
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      className={cn(
        "w-full transition-all duration-300 relative overflow-hidden border shadow-[0_0_10px_rgba(0,0,0,0.1)]",
        type === "buy" 
          ? "bg-axium-success hover:bg-axium-success/90 border-axium-success/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
          : "bg-axium-error hover:bg-axium-error/90 border-axium-error/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]",
        isLoading && "opacity-80"
      )}
      disabled={isLoading}
    >
      <span className="relative z-10 flex items-center justify-center">
        {isLoading
          ? "Processing..."
          : type === "buy"
          ? `Buy ${quantity} ${symbol}`
          : `Sell ${quantity} ${symbol}`}
      </span>
      <span className={cn(
        "absolute inset-0 opacity-20",
        type === "buy" 
          ? "bg-[radial-gradient(circle,rgba(16,185,129,0.8)_0%,rgba(16,185,129,0)_70%)]" 
          : "bg-[radial-gradient(circle,rgba(239,68,68,0.8)_0%,rgba(239,68,68,0)_70%)]"
      )}></span>
    </Button>
  );
};
