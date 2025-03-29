
import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TrendingDown, TrendingUp } from "lucide-react";

interface ActionButtonsProps {
  orderType: "buy" | "sell";
  isProcessing: boolean;
  isDemo: boolean;
  quantity: string;
  symbol?: string;
  onSubmit: () => void;
  isDisabled: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  orderType,
  isProcessing,
  isDemo,
  quantity,
  symbol,
  onSubmit,
  isDisabled
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          className={`w-full ${isDemo ? 'opacity-70' : ''} transition-all duration-200 font-medium`}
          disabled={isDisabled}
          onClick={onSubmit}
          variant={orderType === "buy" ? "default" : "destructive"}
          style={{
            background: orderType === "buy" ? "#10B981" : "#EF4444",
            boxShadow: orderType === "buy" 
              ? "0 0 20px rgba(16, 185, 129, 0.3)" 
              : "0 0 20px rgba(239, 68, 68, 0.3)",
          }}
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              {orderType === "buy" ? (
                <TrendingUp className="mr-2 h-4 w-4" />
              ) : (
                <TrendingDown className="mr-2 h-4 w-4" />
              )}
              {isDemo
                ? `Demo ${orderType === "buy" ? "Buy" : "Sell"}`
                : `${orderType === "buy" ? "Buy" : "Sell"} ${symbol || "Token"}`}
            </>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="bg-[#0D1424] border border-[#1A2747] text-white">
        <p className="text-xs">
          {isDemo 
            ? "Demo Mode: Login to place real trades" 
            : `Submit ${orderType} order for ${quantity} ${symbol}`}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};
