
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap, Server, Globe } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { APIEndpointType } from "@/hooks/useAPIConfiguration";

interface InfrastructureTabProps {
  coLocationEnabled: boolean;
  setCoLocationEnabled: (value: boolean) => void;
  toggleEndpointStatus: (endpoint: APIEndpointType) => void;
  endpoints: Record<APIEndpointType, any>;
  handleEnableCoLocation: () => void;
  isAdmin: boolean;
}

export const InfrastructureTab = ({
  coLocationEnabled,
  toggleEndpointStatus,
  endpoints,
  handleEnableCoLocation,
  isAdmin
}: InfrastructureTabProps) => {
  return (
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
  );
};
