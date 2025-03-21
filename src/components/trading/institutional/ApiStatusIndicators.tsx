
import { Network, Gauge, Server } from "lucide-react";
import { APIEndpointType } from "@/hooks/useAPIConfiguration";

interface ApiStatusIndicatorsProps {
  tradingLatency: number;
  endpoints: Record<APIEndpointType, any>;
  coLocationEnabled: boolean;
}

export const ApiStatusIndicators = ({
  tradingLatency,
  endpoints,
  coLocationEnabled
}: ApiStatusIndicatorsProps) => {
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
  );
};
