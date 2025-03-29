
import { useState } from "react";
import { placeOrder } from "@/lib/placeOrder";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showNotification } from "@/components/notifications/ToastContainer";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

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
  const { isDemo, demoToast } = useDemoMode();
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(currentPrice);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOrder = async (type: "buy" | "sell") => {
    // In demo mode, show toast and prevent real order
    if (isDemo) {
      demoToast();
      return;
    }

    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to place orders",
        variant: "destructive",
        duration: 4000,
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
        variant: type === "buy" ? "success" : "info",
        duration: 3000,
      });
      
      showNotification.success(
        `${type === "buy" ? "Buy" : "Sell"} order executed successfully!`
      );
    } catch (err: any) {
      toast({ 
        title: "Error", 
        description: err.message, 
        variant: "destructive",
        duration: 5000,
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
        <CardTitle className="text-xl flex items-center">
          Trade {symbol}
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 ml-2 text-zinc-400" />
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs max-w-[200px]">
                Place market orders to buy or sell {symbol} shares at the current market price
                {isDemo && " (Demo Mode: No real transactions)"}
              </p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-1.5">Quantity</div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full"
                />
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-xs">Number of shares to trade</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <div>
            <div className="text-sm font-medium mb-1.5">Price</div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full"
                />
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-xs">Price per share in USD</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <div>
            <div className="text-sm font-medium mb-1.5">Total</div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="py-2 px-3 border rounded-md bg-muted/50">
                  ${calculateTotal()}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-xs">Total transaction value</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => handleOrder("buy")}
                  disabled={isProcessing || quantity <= 0 || price <= 0}
                  className={`bg-axium-positive hover:bg-axium-positive/90 ${isDemo ? 'opacity-70' : ''}`}
                >
                  {isProcessing ? "Processing..." : isDemo ? "Demo Buy" : "Buy"}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">
                  {isDemo ? "Demo Mode: Login to place real trades" : `Buy ${quantity} shares at $${price} each`}
                </p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => handleOrder("sell")}
                  disabled={isProcessing || quantity <= 0 || price <= 0}
                  variant="destructive"
                  className={isDemo ? 'opacity-70' : ''}
                >
                  {isProcessing ? "Processing..." : isDemo ? "Demo Sell" : "Sell"}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">
                  {isDemo ? "Demo Mode: Login to place real trades" : `Sell ${quantity} shares at $${price} each`}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          {isDemo && (
            <div className="text-xs text-muted-foreground text-center pt-2">
              Demo Mode: No real transactions are made
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export { TradePanel };
