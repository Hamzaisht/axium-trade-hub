
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassCard } from "@/components/ui/GlassCard";
import { AdvancedOrderTypes } from "./AdvancedOrderTypes";
import { LiquidityPoolInfo } from "./LiquidityPoolInfo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Network, 
  Laptop, 
  Server, 
  Globe, 
  Timer, 
  Zap,
  Building2,
  Gauge,
  Lock
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  useAPIConfiguration, 
  APIEndpointType 
} from "@/hooks/useAPIConfiguration";
import { toast } from "@/components/ui/use-toast";

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
  
  // Get the status color for API endpoints
  const getStatusColor = (endpoint: APIEndpointType) => {
    const status = endpoints[endpoint].status;
    switch (status) {
      case 'live':
        return "bg-axium-success";
      case 'secure':
        return "bg-amber-500";
      case 'mock':
        return "bg-axium-gray-400";
      case 'mixed':
        return "bg-axium-blue";
    }
  };
  
  return (
    <GlassCard className={className}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <Building2 className="h-5 w-5 mr-2 text-axium-blue" />
          Axium Pro
          <Badge 
            variant="default" 
            className="ml-2 text-xs bg-axium-blue"
          >
            Institutional
          </Badge>
        </h2>
        
        {!isInstitutional && (
          <Badge variant="outline" className="text-xs">
            <Lock className="h-3 w-3 mr-1" />
            Restricted Access
          </Badge>
        )}
      </div>
      
      {isInstitutional ? (
        <>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="border border-axium-gray-200 rounded-md p-3 flex flex-col items-center bg-axium-gray-50">
              <Gauge className="h-5 w-5 mb-1 text-axium-gray-600" />
              <div className="text-xs text-axium-gray-600">Trading Latency</div>
              <div className={`font-bold ${
                tradingLatency < 50 ? "text-axium-success" : 
                tradingLatency < 200 ? "text-axium-blue" : 
                "text-axium-gray-700"
              }`}>
                {tradingLatency}ms
              </div>
            </div>
            
            <div className="border border-axium-gray-200 rounded-md p-3 flex flex-col items-center bg-axium-gray-50">
              <Network className="h-5 w-5 mb-1 text-axium-gray-600" />
              <div className="text-xs text-axium-gray-600">API Status</div>
              <div className="flex space-x-1 mt-1">
                <div className={`h-2 w-2 rounded-full ${getStatusColor('market-data')}`}></div>
                <div className={`h-2 w-2 rounded-full ${getStatusColor('order-execution')}`}></div>
                <div className={`h-2 w-2 rounded-full ${getStatusColor('analytics')}`}></div>
              </div>
            </div>
            
            <div className="border border-axium-gray-200 rounded-md p-3 flex flex-col items-center bg-axium-gray-50">
              <Server className="h-5 w-5 mb-1 text-axium-gray-600" />
              <div className="text-xs text-axium-gray-600">Co-Location</div>
              <div className="font-medium text-xs">
                {coLocationEnabled ? (
                  <span className="text-axium-success">Enabled</span>
                ) : (
                  <span className="text-axium-gray-500">Disabled</span>
                )}
              </div>
            </div>
          </div>
          
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
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="text-base font-medium mb-2 flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-amber-500" />
                    High-Frequency Trading
                  </h3>
                  <p className="text-sm text-axium-gray-600 mb-3">
                    Co-location servers provide ultra-low latency for high-frequency trading.
                    Enabling this will connect to our nearest edge server.
                  </p>
                  
                  <Button 
                    variant={coLocationEnabled ? "default" : "outline"}
                    className={coLocationEnabled ? "bg-amber-500 hover:bg-amber-600" : ""}
                    onClick={handleEnableCoLocation}
                    disabled={!isAdmin}
                  >
                    <Server className="h-4 w-4 mr-2" />
                    {coLocationEnabled ? "Disable Co-Location" : "Enable Co-Location"}
                  </Button>
                  
                  {!isAdmin && (
                    <p className="text-xs text-axium-error mt-2">
                      This feature requires administrator access.
                    </p>
                  )}
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-base font-medium mb-2 flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-axium-blue" />
                    Direct Market Access
                  </h3>
                  <p className="text-sm text-axium-gray-600 mb-2">
                    Access trading venues directly without intermediary routing.
                    Reduce slippage and access better pricing.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => toggleEndpointStatus('order-execution')}
                    >
                      {endpoints['order-execution'].status === 'mock' 
                        ? "Enable Direct Routing" 
                        : "Disable Direct Routing"}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => toggleEndpointStatus('market-data')}
                    >
                      {endpoints['market-data'].status === 'mock' 
                        ? "Enable Market Feed" 
                        : "Disable Market Feed"}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <Lock className="h-10 w-10 text-axium-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-axium-gray-700 mb-2">Institutional Access Required</h3>
          <p className="text-sm text-axium-gray-500 text-center max-w-md mb-4">
            Axium Pro provides institutional-grade trading features, including advanced order types,
            liquidity pool access, and high-frequency trading infrastructure.
          </p>
          <Button variant="default">
            Request Access
          </Button>
        </div>
      )}
    </GlassCard>
  );
};

export default InstitutionalTrading;
