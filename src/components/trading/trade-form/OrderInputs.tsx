
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface OrderInputsProps {
  price: number;
  quantity: number;
  orderType: "market" | "limit";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const OrderInputs = ({ price, quantity, orderType, onChange }: OrderInputsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="price" className="text-[#8A9CCC] text-xs uppercase tracking-wider">Price ($)</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4A5878]">$</span>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0.01"
            value={price}
            onChange={onChange}
            disabled={orderType === "market"}
            required
            className="pl-8 border-[#1E375F] bg-[#0D1424] text-white placeholder:text-[#4A5878] focus-visible:ring-axium-neon-blue"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="quantity" className="text-[#8A9CCC] text-xs uppercase tracking-wider">Quantity</Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          min="1"
          step="1"
          value={quantity}
          onChange={onChange}
          required
          className="border-[#1E375F] bg-[#0D1424] text-white placeholder:text-[#4A5878] focus-visible:ring-axium-neon-blue"
        />
      </div>
    </>
  );
};
