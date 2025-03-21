
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassCard } from "@/components/ui/GlassCard";
import { Header } from "./Header";
import { InfrastructureTab } from "./InfrastructureTab";
import { ApiStatusIndicators } from "./ApiStatusIndicators";
import { RestrictedAccess } from "./RestrictedAccess";

export const InstitutionalTrading = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("infrastructure");
  
  // Check if user has institutional access (admin or investor role)
  const hasInstitutionalAccess = user?.role === 'admin' || user?.role === 'investor';
  
  if (!hasInstitutionalAccess) {
    return <RestrictedAccess />;
  }
  
  return (
    <GlassCard className="p-5">
      <Header />
      
      <ApiStatusIndicators />
      
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="mt-6"
      >
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="infrastructure" className="mt-4">
          <InfrastructureTab />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Market Analytics</h3>
            <p className="text-axium-gray-600">
              Advanced analytics tools for institutional traders, including market depth analysis,
              order flow imbalance indicators, and volume profile visualization.
            </p>
            
            {/* Analytics components would go here */}
            <div className="p-4 border border-dashed border-axium-gray-300 rounded-md text-center text-axium-gray-500">
              Advanced analytics dashboard coming soon
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="liquidity" className="mt-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Liquidity Management</h3>
            <p className="text-axium-gray-600">
              Tools for liquidity providers to manage contributions, monitor pools, and track rebates.
              Institutional traders can access deep liquidity through smart order routing.
            </p>
            
            {/* Liquidity components would go here */}
            <div className="p-4 border border-dashed border-axium-gray-300 rounded-md text-center text-axium-gray-500">
              Liquidity management tools coming soon
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </GlassCard>
  );
};

export default InstitutionalTrading;
