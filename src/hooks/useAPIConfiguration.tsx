
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { APIKeysService, apiKeysService } from '@/services/api/APIKeysService';

export type APIServiceStatus = 'live' | 'secure' | 'mock' | 'mixed';

export type APIEndpointType = 
  | 'market-data' 
  | 'order-execution' 
  | 'institutional' 
  | 'analytics';

export type APIEndpointConfig = {
  endpoint: string;
  status: APIServiceStatus;
  latency: number; // milliseconds
  rateLimitPerMinute: number;
  requiresAuth: boolean;
};

interface APIConfigurationContextValue {
  apiServiceStatus: APIServiceStatus;
  endpoints: Record<APIEndpointType, APIEndpointConfig>;
  tradingLatency: number;
  updateAPIConfig: (config: Partial<Record<APIEndpointType, Partial<APIEndpointConfig>>>) => void;
  toggleEndpointStatus: (endpoint: APIEndpointType) => void;
  // Add the missing properties to fix the error
  apiStatus: { real: number; mock: number; total: number };
  availablePlatforms: string[];
}

const APIConfigurationContext = createContext<APIConfigurationContextValue | undefined>(undefined);

export const APIConfigurationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const isInstitutional = user?.role === 'admin' || user?.role === 'investor';
  
  // Default configuration with higher performance for institutional users
  const [endpoints, setEndpoints] = useState<Record<APIEndpointType, APIEndpointConfig>>({
    'market-data': {
      endpoint: '/api/market/data',
      status: 'mock',
      latency: isInstitutional ? 50 : 200,
      rateLimitPerMinute: isInstitutional ? 120 : 60,
      requiresAuth: false
    },
    'order-execution': {
      endpoint: '/api/trading/execute',
      status: 'mock',
      latency: isInstitutional ? 100 : 250,
      rateLimitPerMinute: isInstitutional ? 60 : 30,
      requiresAuth: true
    },
    'institutional': {
      endpoint: '/api/institutional',
      status: 'mock',
      latency: 25,
      rateLimitPerMinute: 300,
      requiresAuth: true
    },
    'analytics': {
      endpoint: '/api/analytics',
      status: 'mock',
      latency: isInstitutional ? 150 : 300,
      rateLimitPerMinute: isInstitutional ? 100 : 40,
      requiresAuth: true
    }
  });
  
  // Overall API service status
  const [apiServiceStatus, setApiServiceStatus] = useState<APIServiceStatus>('mock');
  
  // Calculate trading latency (based on market data and order execution)
  const [tradingLatency, setTradingLatency] = useState<number>(300);
  
  // Initialize API status and available platforms using the APIKeysService
  const [apiStatus, setApiStatus] = useState<{ real: number; mock: number; total: number }>(
    { real: 0, mock: 0, total: 0 }
  );
  
  const [availablePlatforms, setAvailablePlatforms] = useState<string[]>([]);
  
  // Initialize API status and available platforms on component mount
  useEffect(() => {
    // Get API key status from APIKeysService
    const status = apiKeysService.getApiKeyStatus();
    setApiStatus(status);
    
    // Get available platforms with real API keys
    const platforms = apiKeysService.getAvailablePlatforms();
    setAvailablePlatforms(platforms);
  }, []);
  
  // Update API configuration when user role changes
  useEffect(() => {
    if (isInstitutional) {
      setEndpoints(prev => ({
        ...prev,
        'market-data': { ...prev['market-data'], latency: 50, rateLimitPerMinute: 120 },
        'order-execution': { ...prev['order-execution'], latency: 100, rateLimitPerMinute: 60 },
        'analytics': { ...prev['analytics'], latency: 150, rateLimitPerMinute: 100 }
      }));
    }
  }, [isInstitutional]);
  
  // Determine overall API service status and trading latency
  useEffect(() => {
    // Check if any endpoints are live
    const hasLive = Object.values(endpoints).some(ep => ep.status === 'live');
    const hasSecure = Object.values(endpoints).some(ep => ep.status === 'secure');
    const hasMock = Object.values(endpoints).some(ep => ep.status === 'mock');
    
    if (hasLive && !hasMock) {
      setApiServiceStatus('live');
    } else if (hasSecure && !hasMock && !hasLive) {
      setApiServiceStatus('secure');
    } else if (hasMock && !hasLive && !hasSecure) {
      setApiServiceStatus('mock');
    } else {
      setApiServiceStatus('mixed');
    }
    
    // Calculate trading latency (market data + order execution)
    const marketLatency = endpoints['market-data'].latency;
    const executionLatency = endpoints['order-execution'].latency;
    setTradingLatency(marketLatency + executionLatency);
  }, [endpoints]);
  
  // Update API configuration
  const updateAPIConfig = (config: Partial<Record<APIEndpointType, Partial<APIEndpointConfig>>>) => {
    setEndpoints(prev => {
      const newEndpoints = { ...prev };
      
      // Update each endpoint that was provided
      Object.entries(config).forEach(([endpoint, changes]) => {
        const typedEndpoint = endpoint as APIEndpointType;
        if (typedEndpoint in newEndpoints && changes) {
          newEndpoints[typedEndpoint] = {
            ...newEndpoints[typedEndpoint],
            ...changes
          };
        }
      });
      
      return newEndpoints;
    });
  };
  
  // Toggle endpoint status (mock <-> live)
  const toggleEndpointStatus = (endpoint: APIEndpointType) => {
    setEndpoints(prev => ({
      ...prev,
      [endpoint]: {
        ...prev[endpoint],
        status: prev[endpoint].status === 'mock' ? 'live' : 'mock'
      }
    }));
  };
  
  return (
    <APIConfigurationContext.Provider
      value={{
        apiServiceStatus,
        endpoints,
        tradingLatency,
        updateAPIConfig,
        toggleEndpointStatus,
        // Provide the new properties to the context
        apiStatus,
        availablePlatforms
      }}
    >
      {children}
    </APIConfigurationContext.Provider>
  );
};

export const useAPIConfiguration = () => {
  const context = useContext(APIConfigurationContext);
  if (context === undefined) {
    throw new Error('useAPIConfiguration must be used within an APIConfigurationProvider');
  }
  return context;
};
