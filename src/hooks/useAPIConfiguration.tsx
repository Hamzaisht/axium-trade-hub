
import { useState, useEffect } from 'react';
import { apiConfigService } from '@/services/api/ApiConfigService';

export const useAPIConfiguration = () => {
  const [isUsingRealAPIs, setIsUsingRealAPIs] = useState<boolean>(false);
  const [isUsingProxyEndpoints, setIsUsingProxyEndpoints] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if we have any real API keys configured
    setIsUsingRealAPIs(apiConfigService.areRealApisConfigured());
    
    // Check if we're using proxy endpoints
    setIsUsingProxyEndpoints(apiConfigService.isUsingProxyEndpoints());
  }, []);
  
  return {
    isUsingRealAPIs,
    isUsingProxyEndpoints,
    apiServiceStatus: isUsingRealAPIs 
      ? isUsingProxyEndpoints 
        ? 'secure' 
        : 'live' 
      : 'mock'
  };
};
