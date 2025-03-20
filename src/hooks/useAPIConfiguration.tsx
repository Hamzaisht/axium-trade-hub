
import { useState, useEffect } from 'react';
import { apiConfigService } from '@/services/api/ApiConfigService';

export const useAPIConfiguration = () => {
  const [isUsingRealAPIs, setIsUsingRealAPIs] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if we have any real API keys configured
    setIsUsingRealAPIs(apiConfigService.areRealApisConfigured());
  }, []);
  
  return {
    isUsingRealAPIs,
    apiServiceStatus: isUsingRealAPIs ? 'live' : 'mock'
  };
};
