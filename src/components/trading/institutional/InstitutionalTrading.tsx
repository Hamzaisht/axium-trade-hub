
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassCard } from "@/components/ui/GlassCard";
import { AdvancedOrderTypes } from "../AdvancedOrderTypes";
import { LiquidityPoolInfo } from "../liquidity-pool/LiquidityPoolInfo";
import { Timer, Globe, Laptop } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAPIConfiguration } from "@/hooks/useAPIConfiguration";
import { toast } from "@/components/ui/use-toast";

// Import our new components
import { ApiStatusIndicators } from "./ApiStatusIndicators";
import { InfrastructureTab } from "./InfrastructureTab";
import { RestrictedAccess } from "./RestrictedAccess";
import { Header } from "./Header";

interface InstitutionalTradingProps {
  symbol: string;
  currentPrice: number;
  className?: string;
}

export const InstitutionalTrading = ({ 
  symbol = "$AXM", 
  currentPrice = 25.74,
  className 
}: InstitutionalTradingProps) => {
  const { user } = useAuth();
  const isInstitutional = user?.role === 'admin' || user?.role === 'investor';
  const isAdmin = user?.role === 'admin';
  
  const { 
    endpoints, 
    tradingLatency, 
    toggleEndpointStatus, 
    updateAPIConfig 
  } = useAPIConfiguration();
  
  const [activeTab, setActiveTab] = useState<string>("orders");
  const [coLocationEnabled, setCoLocationEnabled] = useState<boolean>(false);
  
  // Handle enabling co-location server (HFT)
  const handleEnableCoLocation = () => {
    if (!isAdmin) {
      toast({
        title: "Access Restricted",
        description: "Co-location servers require administrator access.",
        variant: "destructive"
      });
      return;
    }
    
    setCoLocationEnabled(prev => !prev);
    
    // Update API endpoints with reduced latency
    if (!coLocationEnabled) {
      // Enable HFT co-location
      updateAPIConfig({
        'market-data': { latency: 5, status: 'live' },
        'order-execution': { latency: 10, status: 'live' }
      });
      
      toast({
        title: "Co-Location Enabled",
        description: "Low-latency trading enabled with 15ms round-trip time.",
      });
    } else {
      // Disable HFT co-location
      updateAPIConfig({
        'market-data': { latency: 50, status: 'mock' },
        'order-execution': { latency: 100, status: 'mock' }
      });
      
      toast({
        title: "Co-Location Disabled",
        description: "Returning to standard API connectivity.",
      });
    }
  };
  
  return (
    <GlassCard className={className}>
      <Header isInstitutional={isInstitutional} />
      
      {isInstitutional ? (
        <>
          <ApiStatusIndicators 
            tradingLatency={tradingLatency}
            endpoints={endpoints}
            coLocationEnabled={coLocationEnabled}
          />
          
          <Tabs defaultValue="orders" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="orders">
                <Timer className="h-4 w-4 mr-1" />
                Advanced Orders
              </TabsTrigger>
              <TabsTrigger value="liquidity">
                <Globe className="h-4 w-4 mr-1" />
                Liquidity Pool
              </TabsTrigger>
              <TabsTrigger value="infrastructure">
                <Laptop className="h-4 w-4 mr-1" />
                Infrastructure
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="orders" className="mt-0">
              <AdvancedOrderTypes
                symbol={symbol}
                currentPrice={currentPrice}
              />
            </TabsContent>
            
            <TabsContent value="liquidity" className="mt-0">
              <LiquidityPoolInfo symbol={symbol} />
            </TabsContent>
            
            <TabsContent value="infrastructure" className="mt-0">
              <InfrastructureTab 
                coLocationEnabled={coLocationEnabled}
                setCoLocationEnabled={setCoLocationEnabled}
                toggleEndpointStatus={toggleEndpointStatus}
                endpoints={endpoints}
                handleEnableCoLocation={handleEnableCoLocation}
                isAdmin={isAdmin}
              />
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <RestrictedAccess />
      )}
    </GlassCard>
  );
};
