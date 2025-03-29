
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightLeft } from "lucide-react";
import { showNotification } from "@/components/notifications/ToastContainer";
import { useAuth } from "@/contexts/AuthContext";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { placeOrder } from "@/lib/placeOrder";
import { OrderQuantityInput } from "./OrderQuantityInput";
import { OrderPriceDisplay } from "./OrderPriceDisplay";
import { OrderTotalDisplay } from "./OrderTotalDisplay";
import { ActionButtons } from "./ActionButtons";
import { OrderTypeTabs } from "./OrderTypeTabs";

interface BuySellSectionProps {
  creatorId: string;
  symbol?: string;
  currentPrice?: number;
}

export function BuySellSection({ creatorId, symbol, currentPrice = 25.75 }: BuySellSectionProps) {
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [quantity, setQuantity] = useState<string>("1");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { isDemo, demoToast } = useDemoMode();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    const decimalCount = (value.match(/\./g) || []).length;
    if (decimalCount > 1) return;
    
    setQuantity(value);
  };

  const calculateTotal = () => {
    const qty = parseFloat(quantity) || 0;
    return (qty * currentPrice).toFixed(2);
  };

  const handleSubmitOrder = async () => {
    if (!quantity || parseFloat(quantity) <= 0) {
      showNotification.warning("Please enter a valid quantity");
      return;
    }

    if (isDemo) {
      demoToast();
      return;
    }

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
        creatorId: creatorId,
        type: orderType,
        quantity: parseInt(quantity, 10),
        price: currentPrice
      });

      toast({
        title: `${orderType === "buy" ? "Buy" : "Sell"} Order Submitted`,
        description: `${quantity} ${symbol} at $${currentPrice} ($${calculateTotal()})`,
        variant: orderType === "buy" ? "default" : "destructive",
      });
      
      showNotification.success(
        `${orderType === "buy" ? "Buy" : "Sell"} order executed successfully!`
      );
    } catch (error) {
      console.error("Error submitting order:", error);
      showNotification.error(
        "Failed to place order. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const isOrderButtonDisabled = isProcessing || !quantity || parseFloat(quantity) <= 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5" />
          Place Order {isDemo && <span className="text-xs text-muted-foreground ml-2">(Demo Mode)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <OrderTypeTabs 
          orderType={orderType} 
          onOrderTypeChange={setOrderType} 
          symbol={symbol} 
        />
        
        <div className="space-y-4">
          <OrderQuantityInput 
            quantity={quantity} 
            onChange={handleQuantityChange} 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <OrderPriceDisplay 
              currentPrice={currentPrice} 
            />
            <OrderTotalDisplay 
              total={calculateTotal()} 
            />
          </div>
          
          <ActionButtons 
            orderType={orderType}
            isProcessing={isProcessing}
            isDemo={isDemo}
            quantity={quantity}
            symbol={symbol}
            onSubmit={handleSubmitOrder}
            isDisabled={isOrderButtonDisabled}
          />
          
          {isDemo && (
            <div className="text-xs text-muted-foreground text-center">
              Demo Mode: No real transactions are made
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
