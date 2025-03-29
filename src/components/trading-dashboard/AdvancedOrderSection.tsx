
import { showNotification } from "@/components/notifications/ToastContainer";
import AdvancedOrderTypes from "@/components/trading/AdvancedOrderTypes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdvancedOrderSectionProps {
  symbol: string;
  currentPrice: number;
}

export const AdvancedOrderSection = ({ symbol, currentPrice }: AdvancedOrderSectionProps) => {
  return (
    <Tabs defaultValue="standard" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="standard">Standard</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>
      <TabsContent value="standard">
        {/* This is intentionally left empty as TradeForm already handles standard orders */}
      </TabsContent>
      <TabsContent value="advanced">
        <AdvancedOrderTypes 
          symbol={symbol} 
          currentPrice={currentPrice} 
          className="mt-4"
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
  );
};
