
import { toast } from 'sonner';

export abstract class BaseApiService {
  protected apiKey: string;
  protected cache: Map<string, { data: any; timestamp: number }> = new Map();
  protected CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    console.log(`${this.constructor.name} initialized`);
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
  protected isRealApiKey(): boolean {
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

  // API call with error handling and retry logic
  protected async makeApiCall<T>(
    endpoint: string, 
    url: string,
    headers: Record<string, string> = {},
    retries = 3
  ): Promise<T> {
    // Check cache first
    const cacheKey = `${endpoint}`;
    const cachedData = this.getCachedData<T>(cacheKey);
    if (cachedData) return cachedData;

    try {
      // If we're in development or have missing API keys, use mock data
      if (
        import.meta.env.DEV || 
        !this.isRealApiKey() || 
        !url
      ) {
        console.log(`Using mock data for ${endpoint} (development mode or missing API key)`);
        return this.generateMockData(endpoint) as T;
      }
      
      console.log(`Making API call to ${url}`);
      
      // Add authorization if we have an API key
      const requestHeaders = {
        'Authorization': `Bearer ${this.apiKey}`,
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
    } catch (error) {
      console.error(`API error (${endpoint}):`, error);
      
      // Retry logic
      if (retries > 0) {
        console.log(`Retrying ${endpoint} (${retries} attempts left)...`);
        return this.makeApiCall<T>(endpoint, url, headers, retries - 1);
      }
      
      // After retries are exhausted, throw the error
      toast.error(`Failed to fetch data from ${endpoint.split('/')[0]}`);
      
      // Fall back to mock data on API failure
      console.log(`Falling back to mock data for ${endpoint}`);
      return this.generateMockData(endpoint) as T;
    }
  }

  // Abstract methods to be implemented by derived classes
  protected abstract generateMockData(endpoint: string): any;
  protected abstract transformApiResponse(endpoint: string, data: any): any;
}
