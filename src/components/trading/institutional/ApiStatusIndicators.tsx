
import { useAPIConfiguration, APIServiceStatus } from "@/hooks/useAPIConfiguration";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Clock, Server } from "lucide-react";

export const ApiStatusIndicators = () => {
  const { apiServiceStatus } = useAPIConfiguration();
  
  const renderServiceStatus = (service: string, status: 'operational' | 'degraded' | 'maintenance') => {
    return (
      <div className="flex items-center">
        {status === 'operational' && (
          <CheckCircle2 className="h-4 w-4 text-green-500 mr-1.5" />
        )}
        {status === 'degraded' && (
          <AlertCircle className="h-4 w-4 text-amber-500 mr-1.5" />
        )}
        {status === 'maintenance' && (
          <Clock className="h-4 w-4 text-blue-500 mr-1.5" />
        )}
        <span className="text-xs text-axium-gray-700">{service}</span>
      </div>
    );
  };

  return (
    <div className="mb-4">
      <div className="flex items-center mb-2">
        <Server className="h-4 w-4 text-axium-gray-500 mr-1.5" />
        <span className="text-sm font-medium text-axium-gray-700">Services Status</span>
        <Badge variant="outline" className="ml-2 text-xs">
          {apiServiceStatus === 'live' ? 'Production' : 
           apiServiceStatus === 'secure' ? 'Secure' : 
           apiServiceStatus === 'mixed' ? 'Mixed' : 'Mocked'}
        </Badge>
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-4 gap-y-2 mt-1.5">
        {renderServiceStatus('Order Execution', 'operational')}
        {renderServiceStatus('Market Data', 'operational')}
        {renderServiceStatus('Analytics', 'operational')}
        {renderServiceStatus('Risk Engine', 'operational')}
        {renderServiceStatus('Liquidity Pools', 'maintenance')}
        {renderServiceStatus('FIX Protocol', 'degraded')}
      </div>
    </div>
  );
};
