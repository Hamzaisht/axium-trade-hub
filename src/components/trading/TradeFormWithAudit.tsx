
import { useState } from "react";
import { useTrading } from "@/contexts/TradingContext";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { toast } from "sonner";
import { IPO } from "@/utils/mockApi";
import { useAuth } from "@/contexts/AuthContext";
import { useRecordTradeEvent } from "@/hooks/useCreator";

interface TradeFormWithAuditProps {
  ipo: IPO;
  creatorId?: string; // Optional Supabase creator ID
  onSuccess?: () => void;
}

export const TradeFormWithAudit = ({ ipo, creatorId, onSuccess }: TradeFormWithAuditProps) => {
  const { placeOrder, isLoading } = useTrading();
  const { portfolio, fetchPortfolio } = usePortfolio();
  const { user, isAuthenticated } = useAuth();
  const recordTradeEvent = useRecordTradeEvent();
  
  const [formData, setFormData] = useState({
    type: "buy" as "buy" | "sell",
    orderType: "market" as "market" | "limit",
    price: ipo.currentPrice,
    quantity: 1
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "type" || name === "orderType") {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else if (name === "price" || name === "quantity") {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    }
    
    // If order type changes to market, update price to current price
    if (name === "orderType" && value === "market") {
      setFormData(prev => ({
        ...prev,
        price: ipo.currentPrice
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      toast.error("Please log in to place orders");
      return;
    }
    
    // Calculate total cost
    const totalCost = formData.price * formData.quantity;
    
    // For buy orders, check if user has enough cash
    if (formData.type === "buy" && portfolio) {
      if (portfolio.cash < totalCost) {
        toast.error("Insufficient funds for this transaction");
        return;
      }
    }
    
    // For sell orders, check if user owns enough tokens
    if (formData.type === "sell" && portfolio) {
      const holding = portfolio.holdings.find(h => h.ipoId === ipo.id);
      if (!holding || holding.quantity < formData.quantity) {
        toast.error("You don't own enough tokens for this transaction");
        return;
      }
    }
    
    try {
      // Place the order through the trading system
      await placeOrder({
        ipoId: ipo.id,
        type: formData.type,
        orderType: formData.orderType,
        price: formData.price,
        quantity: formData.quantity
      });
      
      // If we have a creatorId, record the trade event in Supabase
      if (creatorId) {
        await recordTradeEvent.mutateAsync({
          creator_id: creatorId,
          event_type: formData.type,
          quantity: formData.quantity,
          price: formData.price,
          metadata: {
            ipo_id: ipo.id, 
            order_type: formData.orderType,
            symbol: ipo.symbol
          }
        });
      }
      
      // Refresh portfolio after trade
      await fetchPortfolio();
      
      toast.success(`${formData.type === "buy" ? "Buy" : "Sell"} order placed successfully`);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <GlassCard className="w-full p-6">
      <h2 className="text-2xl font-bold mb-6">Trade {ipo.symbol}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Order Side</Label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="orderType">Order Type</Label>
            <select
              id="orderType"
              name="orderType"
              value={formData.orderType}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="market">Market</option>
              <option value="limit">Limit</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.price}
            onChange={handleChange}
            disabled={formData.orderType === "market"}
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
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="border-t border-axium-gray-200 pt-4 mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-axium-gray-600">Subtotal:</span>
            <span className="font-medium">${(formData.price * formData.quantity).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-axium-gray-600">Fee (0.1%):</span>
            <span className="font-medium">${(formData.price * formData.quantity * 0.001).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>Total:</span>
            <span>${(formData.price * formData.quantity * 1.001).toFixed(2)}</span>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className={formData.type === "buy" 
            ? "w-full bg-axium-success hover:bg-axium-success/90" 
            : "w-full bg-axium-error hover:bg-axium-error/90"}
          disabled={isLoading || recordTradeEvent.isPending}
        >
          {isLoading || recordTradeEvent.isPending
            ? "Processing..."
            : formData.type === "buy"
            ? `Buy ${formData.quantity} ${ipo.symbol}`
            : `Sell ${formData.quantity} ${ipo.symbol}`}
        </Button>
        
        {creatorId && (
          <p className="text-xs text-center text-axium-gray-500 mt-2">
            All trades are recorded on-chain for complete transparency
          </p>
        )}
      </form>
    </GlassCard>
  );
};

export default TradeFormWithAudit;
