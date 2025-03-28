
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRightLeft, TrendingDown, TrendingUp } from "lucide-react";
import { showNotification } from "@/components/notifications/ToastContainer";

interface BuySellSectionProps {
  creatorId: string;
  symbol?: string;
  currentPrice?: number;
}

type OrderType = "buy" | "sell";

export function BuySellSection({ creatorId, symbol, currentPrice = 25.75 }: BuySellSectionProps) {
  const [orderType, setOrderType] = useState<OrderType>("buy");
  const [quantity, setQuantity] = useState<string>("1");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimals
    const value = e.target.value.replace(/[^0-9.]/g, "");
    // Prevent multiple decimal points
    const decimalCount = (value.match(/\./g) || []).length;
    if (decimalCount > 1) return;
    
    setQuantity(value);
  };

  const calculateTotal = () => {
    const qty = parseFloat(quantity) || 0;
    return (qty * currentPrice).toFixed(2);
  };

  const handleSubmitOrder = () => {
    if (!quantity || parseFloat(quantity) <= 0) {
      showNotification.warning("Please enter a valid quantity");
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      
      toast({
        title: `${orderType === "buy" ? "Buy" : "Sell"} Order Submitted`,
        description: `${quantity} ${symbol} at $${currentPrice} ($${calculateTotal()})`,
        variant: orderType === "buy" ? "default" : "destructive",
      });
      
      showNotification.success(
        `${orderType === "buy" ? "Buy" : "Sell"} order executed successfully!`
      );
    }, 1000);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5" />
          Place Order
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={orderType} onValueChange={(v) => setOrderType(v as OrderType)} className="mb-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="buy" className="data-[state=active]:bg-axium-positive data-[state=active]:text-white">
              <TrendingUp className="mr-2 h-4 w-4" />
              Buy
            </TabsTrigger>
            <TabsTrigger value="sell" className="data-[state=active]:bg-axium-negative data-[state=active]:text-white">
              <TrendingDown className="mr-2 h-4 w-4" />
              Sell
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-1.5">Quantity</div>
            <Input 
              type="text" 
              value={quantity} 
              onChange={handleQuantityChange} 
              placeholder="Enter quantity"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium mb-1.5">Price</div>
              <div className="py-2 px-3 border rounded-md bg-muted/50">
                ${currentPrice}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1.5">Total</div>
              <div className="py-2 px-3 border rounded-md bg-muted/50">
                ${calculateTotal()}
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full"
            disabled={isProcessing || !quantity || parseFloat(quantity) <= 0}
            onClick={handleSubmitOrder}
            variant={orderType === "buy" ? "default" : "destructive"}
          >
            {isProcessing 
              ? "Processing..." 
              : `${orderType === "buy" ? "Buy" : "Sell"} ${symbol || "Token"}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
