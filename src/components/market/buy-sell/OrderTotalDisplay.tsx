
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface OrderTotalDisplayProps {
  total: string;
}

export const OrderTotalDisplay: React.FC<OrderTotalDisplayProps> = ({ total }) => {
  return (
    <div>
      <div className="text-sm font-medium mb-1.5">Total</div>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="py-2 px-3 border rounded-md bg-muted/50">
            ${total}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p className="text-xs">Total transaction value</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
