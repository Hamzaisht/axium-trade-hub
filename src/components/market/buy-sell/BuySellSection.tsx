
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightLeft, TrendingUp, TrendingDown } from "lucide-react";
import { showNotification } from "@/components/notifications/ToastContainer";
import { useAuth } from "@/contexts/AuthContext";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { placeOrder } from "@/lib/placeOrder";
import { OrderQuantityInput } from "./OrderQuantityInput";
import { OrderPriceDisplay } from "./OrderPriceDisplay";
import { OrderTotalDisplay } from "./OrderTotalDisplay";
import { ActionButtons } from "./ActionButtons";
import { OrderTypeTabs } from "./OrderTypeTabs";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";

interface BuySellSectionProps {
  creatorId: string;
  symbol?: string;
  currentPrice?: number;
}

export function BuySellSection({ creatorId, symbol = "UNKNOWN", currentPrice = 25.75 }: BuySellSectionProps) {
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [quantity, setQuantity] = useState<string>("1");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { isDemo, demoToast } = useDemoMode();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    const decimalCount = (value.match(/\./g) || []).length;
    if (decimalCount > 1) return;
    
    setQuantity(value);
  };

  const calculateTotal = () => {
    const qty = parseFloat(quantity) || 0;
    return (qty * (currentPrice || 0)).toFixed(2);
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
        price: currentPrice || 0
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`
        shadow-lg border-slate-800/30 backdrop-blur-sm
        ${isDark ? 'bg-axium-gray-800/40 border-axium-gray-700/40' : ''}
        ${orderType === 'buy' ? 
          (isDark ? 'border-axium-positive/20 shadow-neon-blue/20' : 'border-axium-positive/10') : 
          (isDark ? 'border-axium-negative/20 shadow-[0_0_10px_rgba(255,61,94,0.1)]' : 'border-axium-negative/10')
        }
        relative overflow-hidden
      `}>
        {isDark && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30 pointer-events-none"></div>
            <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent 
              ${orderType === 'buy' ? 'via-axium-positive/40' : 'via-axium-negative/40'} to-transparent`}>
            </div>
          </>
        )}
        
        <CardHeader className="pb-2 relative z-10">
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className={`h-5 w-5 ${orderType === 'buy' ? 'text-axium-positive' : 'text-axium-negative'}`} />
            Place Order {isDemo && <span className="text-xs text-muted-foreground ml-2">(Demo Mode)</span>}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 relative z-10">
          <OrderTypeTabs 
            orderType={orderType} 
            onOrderTypeChange={setOrderType} 
            symbol={symbol} 
          />
          
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
