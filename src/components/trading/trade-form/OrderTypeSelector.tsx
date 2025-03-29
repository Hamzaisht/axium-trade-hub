
import React from "react";
import { Label } from "@/components/ui/label";

interface OrderTypeSelectorProps {
  type: "buy" | "sell";
  orderType: "market" | "limit";
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const OrderTypeSelector = ({ type, orderType, onChange }: OrderTypeSelectorProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="type" className="text-[#8A9CCC]">Order Side</Label>
        <select
          id="type"
          name="type"
          value={type}
          onChange={onChange}
          className="flex h-10 w-full rounded-md border border-[#1E375F] bg-[#0D1424] px-3 py-2 text-base text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[#4A5878] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3676FF] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        >
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="orderType" className="text-[#8A9CCC]">Order Type</Label>
        <select
          id="orderType"
          name="orderType"
          value={orderType}
          onChange={onChange}
          className="flex h-10 w-full rounded-md border border-[#1E375F] bg-[#0D1424] px-3 py-2 text-base text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[#4A5878] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3676FF] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        >
          <option value="market">Market</option>
          <option value="limit">Limit</option>
        </select>
      </div>
    </div>
  );
};
