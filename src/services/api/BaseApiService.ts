
import { toast } from 'sonner';
import { apiKeysService } from './APIKeysService';

export abstract class BaseApiService {
  protected apiKey: string;
  protected useProxyEndpoint: boolean;
  protected proxyBaseUrl: string;
  protected cache: Map<string, { data: any; timestamp: number }> = new Map();
  protected CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
  protected retryDelay = 1000; // Default retry delay in ms

  constructor(apiKey: string, useProxyEndpoint = false) {
    this.apiKey = apiKey;
    this.useProxyEndpoint = useProxyEndpoint;
    this.proxyBaseUrl = import.meta.env.VITE_API_PROXY_URL || 'https://api.myapp.com/proxy';
    console.log(`${this.constructor.name} initialized (${useProxyEndpoint ? 'proxy mode' : 'direct mode'})`);
  }

  // Utility method for caching
  protected getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log(`Using cached data for ${key}`);
      return cached.data as T;
    }
    return null;
  }

  protected setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Helper for check if we have a real API key
  protected isRealApiKey(platformKey?: string): boolean {
    if (platformKey) {
      return apiKeysService.hasRealApiKey(platformKey);
    }
    return !!this.apiKey && !this.apiKey.startsWith('mock-');
  }

  // Helper for generating random growth
  protected generateRandomGrowth(): number {
    return -2 + Math.random() * 15;
  }
  
  // Helper for generating random engagement rate
  protected generateRandomEngagementRate(): number {
    return 0.5 + Math.random() * 10;
  }

  // Enhanced API call with error handling, retry logic, and better API key handling
  protected async makeApiCall<T>(
    endpoint: string, 
    url: string,
    headers: Record<string, string> = {},
    retries = 3,
    platformKey?: string
  ): Promise<T> {
    // Check cache first
    const cacheKey = `${endpoint}`;
    const cachedData = this.getCachedData<T>(cacheKey);
    if (cachedData) return cachedData;

    try {
      // Check if we should use mock data
      const shouldUseMockData = 
        !url || 
        (platformKey && !this.isRealApiKey(platformKey)) || 
        (!platformKey && !this.isRealApiKey());
      
      // If we're in development or have missing API keys, use mock data
      if (shouldUseMockData) {
        console.log(`Using mock data for ${endpoint} (missing API key or development mode)`);
        const mockData = this.generateMockData(endpoint);
        this.setCachedData(cacheKey, mockData);
        return mockData as T;
      }
      
      // Get the key to use (either platform-specific or the default)
      const keyToUse = platformKey ? 
        apiKeysService.getApiKey(platformKey) || this.apiKey : 
        this.apiKey;
      
      // Use proxy endpoint if configured
      if (this.useProxyEndpoint) {
        console.log(`Making API call via proxy for ${endpoint}`);
        
        // Transform direct API URL to proxy endpoint format
        const proxyUrl = `${this.proxyBaseUrl}/${endpoint}`;
        
        // The API key is NOT sent to the frontend, it will be added by the proxy server
        const proxyHeaders = {
          'Content-Type': 'application/json',
          ...headers
        };
        
        // Make the API call via proxy
        const response = await fetch(proxyUrl, { 
          method: 'POST',
          headers: proxyHeaders,
          body: JSON.stringify({
            originalUrl: url,
            // We only send metadata about the request, not the actual API key
            service: endpoint.split('/')[0],
            resource: endpoint.split('/')[1] || '',
            id: endpoint.split('/')[2] || ''
          })
        });
        
        if (!response.ok) {
          throw new Error(`Proxy API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Transform the API response into our standardized format
        const transformedData = this.transformApiResponse(endpoint, data);
        
        // Cache the result
        this.setCachedData(cacheKey, transformedData);
        return transformedData as T;
      } else {
        // Direct API call (using API key in the frontend - less secure)
        console.log(`Making direct API call to ${url}`);
        
        // Add authorization if we have an API key
        const requestHeaders = {
          'Authorization': `Bearer ${keyToUse}`,
          ...headers
        };
        
        // Make the actual API call
        const response = await fetch(url, { headers: requestHeaders });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Transform the API response into our standardized format
        const transformedData = this.transformApiResponse(endpoint, data);
        
        // Cache the result
        this.setCachedData(cacheKey, transformedData);
        return transformedData as T;
      }
    } catch (error) {
      console.error(`API error (${endpoint}):`, error);
      
      // Retry logic
      if (retries > 0) {
        console.log(`Retrying ${endpoint} (${retries} attempts left) after ${this.retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        // Increase delay for next retry (exponential backoff)
        this.retryDelay = Math.min(this.retryDelay * 2, 10000); // Cap at 10 seconds
        return this.makeApiCall<T>(endpoint, url, headers, retries - 1, platformKey);
      }
      
      // After retries are exhausted, throw the error
      toast.error(`Failed to fetch data from ${endpoint.split('/')[0]}`);
      
      // Fall back to mock data on API failure
      console.log(`Falling back to mock data for ${endpoint}`);
      const mockData = this.generateMockData(endpoint);
      this.setCachedData(cacheKey, mockData);
      return mockData as T;
    }
  }

  // Abstract methods to be implemented by derived classes
  protected abstract generateMockData(endpoint: string): any;
  protected abstract transformApiResponse(endpoint: string, data: any): any;
}
