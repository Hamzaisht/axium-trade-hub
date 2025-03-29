
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface OrderTypeTabsProps {
  orderType: "buy" | "sell";
  onOrderTypeChange: (value: "buy" | "sell") => void;
  symbol?: string;
}

export const OrderTypeTabs: React.FC<OrderTypeTabsProps> = ({
  orderType,
  onOrderTypeChange,
  symbol
}) => {
  return (
    <Tabs value={orderType} onValueChange={(v) => onOrderTypeChange(v as "buy" | "sell")} className="mb-4">
      <TabsList className="grid grid-cols-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <TabsTrigger value="buy" className="data-[state=active]:bg-axium-positive data-[state=active]:text-white">
              <TrendingUp className="mr-2 h-4 w-4" />
              Buy
            </TabsTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs">Buy shares of {symbol}</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <TabsTrigger value="sell" className="data-[state=active]:bg-axium-negative data-[state=active]:text-white">
              <TrendingDown className="mr-2 h-4 w-4" />
              Sell
            </TabsTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs">Sell shares of {symbol}</p>
          </TooltipContent>
        </Tooltip>
      </TabsList>
    </Tabs>
  );
};
