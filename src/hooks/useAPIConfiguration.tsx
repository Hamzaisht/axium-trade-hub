
import { useState, useEffect } from 'react';
import { externalApiService } from '@/services/externalApiService';

export const useAPIConfiguration = () => {
  const [isUsingRealAPIs, setIsUsingRealAPIs] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if we have any real API keys configured
    setIsUsingRealAPIs(externalApiService.areRealApisConfigured());
  }, []);
  
  return {
    isUsingRealAPIs,
    apiServiceStatus: isUsingRealAPIs ? 'live' : 'mock'
  };
};
