
import { GlassCard } from "@/components/ui/GlassCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, History, TrendingUp } from "lucide-react";

export const TradingOrders = () => {
  return (
    <GlassCard className="p-4">
      <Tabs defaultValue="orders">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">
            <BookOpen className="h-4 w-4 mr-2" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="positions">
            <TrendingUp className="h-4 w-4 mr-2" />
            Positions
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <div className="py-2">
            <p className="text-center text-axium-gray-500 py-8">No open orders</p>
          </div>
        </TabsContent>
        <TabsContent value="positions">
          <div className="py-2">
            <p className="text-center text-axium-gray-500 py-8">No open positions for this asset</p>
          </div>
        </TabsContent>
        <TabsContent value="history">
          <div className="py-2">
            <p className="text-center text-axium-gray-500 py-8">No trading history for this asset</p>
          </div>
        </TabsContent>
      </Tabs>
    </GlassCard>
  );
};
