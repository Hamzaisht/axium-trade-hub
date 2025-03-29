
import React from "react";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface OrderQuantityInputProps {
  quantity: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const OrderQuantityInput: React.FC<OrderQuantityInputProps> = ({ 
  quantity, 
  onChange 
}) => {
  return (
    <div>
      <div className="text-sm font-medium mb-1.5">Quantity</div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Input 
            type="text" 
            value={quantity} 
            onChange={onChange} 
            placeholder="Enter quantity"
          />
        </TooltipTrigger>
        <TooltipContent side="right">
          <p className="text-xs">Enter number of shares to buy or sell</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
