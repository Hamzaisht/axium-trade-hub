
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
        <Label htmlFor="price">Price ($)</Label>
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
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          min="1"
          step="1"
          value={quantity}
          onChange={onChange}
          required
        />
      </div>
    </>
  );
};
