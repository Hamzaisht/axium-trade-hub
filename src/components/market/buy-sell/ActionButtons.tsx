
import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
          className={`w-full ${isDemo ? 'opacity-70' : ''}`}
          disabled={isDisabled}
          onClick={onSubmit}
          variant={orderType === "buy" ? "default" : "destructive"}
        >
          {isProcessing 
            ? "Processing..." 
            : isDemo
            ? `Demo ${orderType === "buy" ? "Buy" : "Sell"}`
            : `${orderType === "buy" ? "Buy" : "Sell"} ${symbol || "Token"}`}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p className="text-xs">
          {isDemo 
            ? "Demo Mode: Login to place real trades" 
            : `Submit ${orderType} order for ${quantity} ${symbol}`}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};
