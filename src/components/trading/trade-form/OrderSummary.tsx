
import React from "react";

interface OrderSummaryProps {
  price: number;
  quantity: number;
}

export const OrderSummary = ({ price, quantity }: OrderSummaryProps) => {
  const subtotal = price * quantity;
  const fee = subtotal * 0.001;
  const total = subtotal + fee;

  return (
    <div className="border-t border-axium-gray-200 pt-4 mt-4">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-axium-gray-600">Subtotal:</span>
        <span className="font-medium">${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-axium-gray-600">Fee (0.1%):</span>
        <span className="font-medium">${fee.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-base font-semibold">
        <span>Total:</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
};
