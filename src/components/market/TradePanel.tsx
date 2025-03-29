
import { useState } from "react";
import { placeOrder } from "@/lib/placeOrder";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showNotification } from "@/components/notifications/ToastContainer";

interface TradePanelProps {
  creatorId: string;
  currentPrice?: number;
  symbol?: string;
}

export default function TradePanel({ 
  creatorId, 
  currentPrice = 10, 
  symbol = "Creator Token" 
}: TradePanelProps) {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(currentPrice);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOrder = async (type: "buy" | "sell") => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to place orders",
        variant: "destructive",
      });
      showNotification.error("Please log in to place orders");
      return;
    }

    setIsProcessing(true);

    try {
      await placeOrder({
        userId: user.id,
        creatorId,
        type,
        quantity,
        price,
      });

      toast({
        title: `Order placed`,
        description: `${type.toUpperCase()} ${quantity} ${symbol} at $${price}`,
      });
      
      showNotification.success(
        `${type === "buy" ? "Buy" : "Sell"} order executed successfully!`
      );
    } catch (err: any) {
      toast({ 
        title: "Error", 
        description: err.message, 
        variant: "destructive" 
      });
      
      showNotification.error(
        "Failed to place order. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateTotal = () => {
    return (quantity * price).toFixed(2);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Trade {symbol}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-1.5">Quantity</div>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <div className="text-sm font-medium mb-1.5">Price</div>
            <Input
              type="number"
              min="0.01"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <div className="text-sm font-medium mb-1.5">Total</div>
            <div className="py-2 px-3 border rounded-md bg-muted/50">
              ${calculateTotal()}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              onClick={() => handleOrder("buy")}
              disabled={isProcessing || quantity <= 0 || price <= 0}
              className="bg-axium-positive hover:bg-axium-positive/90"
            >
              {isProcessing ? "Processing..." : "Buy"}
            </Button>
            
            <Button
              onClick={() => handleOrder("sell")}
              disabled={isProcessing || quantity <= 0 || price <= 0}
              variant="destructive"
            >
              {isProcessing ? "Processing..." : "Sell"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
