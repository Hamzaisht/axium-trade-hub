
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface OrderPriceDisplayProps {
  currentPrice: number;
}

export const OrderPriceDisplay: React.FC<OrderPriceDisplayProps> = ({ currentPrice }) => {
  return (
    <div>
      <div className="text-sm font-medium mb-1.5">Price</div>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="py-2 px-3 border rounded-md bg-muted/50">
            ${currentPrice}
          </div>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p className="text-xs">Current market price</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
