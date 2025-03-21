
import { useState, useEffect } from 'react';
import { apiConfigService } from '@/services/api/ApiConfigService';
import { apiKeysService } from '@/services/api/APIKeysService';

export type APIServiceStatus = 'mock' | 'live' | 'secure' | 'mixed';

export const useAPIConfiguration = () => {
  const [isUsingRealAPIs, setIsUsingRealAPIs] = useState<boolean>(false);
  const [isUsingProxyEndpoints, setIsUsingProxyEndpoints] = useState<boolean>(false);
  const [apiStatus, setApiStatus] = useState<{
    real: number;
    mock: number;
    total: number;
    useProxy: boolean;
  }>({ real: 0, mock: 0, total: 0, useProxy: false });
  
  useEffect(() => {
    // Get API status
    const status = apiConfigService.getApiStatus();
    setApiStatus(status);
    
    // Check if we have any real API keys configured
    setIsUsingRealAPIs(status.real > 0);
    
    // Check if we're using proxy endpoints
    setIsUsingProxyEndpoints(status.useProxy);
  }, []);
  
  // Calculate the API service status
  const getServiceStatus = (): APIServiceStatus => {
    if (apiStatus.real === 0) {
      return 'mock';
    }
    
    if (apiStatus.real === apiStatus.total) {
      return isUsingProxyEndpoints ? 'secure' : 'live';
    }
    
    return 'mixed';
  };
  
  // Get available platforms
  const getAvailablePlatforms = (): string[] => {
    return apiKeysService.getAvailablePlatforms();
  };
  
  return {
    isUsingRealAPIs,
    isUsingProxyEndpoints,
    apiServiceStatus: getServiceStatus(),
    apiStatus,
    availablePlatforms: getAvailablePlatforms()
  };
};
