
import { showNotification } from "@/components/notifications/ToastContainer";
import AdvancedOrderTypes from "@/components/trading/AdvancedOrderTypes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassCard } from "@/components/ui/GlassCard";

interface AdvancedOrderSectionProps {
  symbol: string;
  currentPrice: number;
}

export const AdvancedOrderSection = ({ symbol, currentPrice }: AdvancedOrderSectionProps) => {
  return (
    <GlassCard className="p-4">
      <Tabs defaultValue="standard" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="standard">Standard</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        <TabsContent value="standard">
          <div className="text-sm text-center text-muted-foreground py-4">
            Use the standard trading form to place market or limit orders
          </div>
        </TabsContent>
        <TabsContent value="advanced">
          <AdvancedOrderTypes 
            symbol={symbol} 
            currentPrice={currentPrice} 
            className="mt-0"
            onOrderSubmit={orderData => {
              showNotification.orderPlaced(
                symbol,
                orderData.side,
                orderData.quantity,
                orderData.limitPrice || currentPrice,
                orderData.type
              );
            }}
          />
        </TabsContent>
      </Tabs>
    </GlassCard>
  );
};
