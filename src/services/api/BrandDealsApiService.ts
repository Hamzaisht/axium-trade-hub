import { BaseApiService } from './BaseApiService';

export interface BrandDealMetrics {
  brand: string;
  dealValue: number;
  startDate: string;
  endDate: string;
  engagement: number;
  conversionRate: number;
}

export class BrandDealsApiService extends BaseApiService {
  constructor(apiKey: string, useProxyEndpoint = false) {
    super(apiKey, useProxyEndpoint);
  }

  protected generateMockData(endpoint: string): BrandDealMetrics {
    const brands = ['Nike', 'Adidas', 'Puma', 'Apple', 'Samsung', 'Google', 'Amazon', 'Coca-Cola'];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    
    // Random date in the last 3 months
    const now = new Date();
    const startDate = new Date(now.getTime() - Math.random() * 7776000000); // 90 days in ms
    const endDate = new Date(startDate.getTime() + Math.random() * 7776000000); // Up to 90 days later
    
    return {
      brand,
      dealValue: 5000 + Math.random() * 995000, // $5K to $1M
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      engagement: 1 + Math.random() * 20,
      conversionRate: Math.random() * 5
    };
  }

  protected transformApiResponse(endpoint: string, data: any): BrandDealMetrics {
    try {
      // For Google Trends or similar data, we'd transform it here
      // For now, we'll return mock data since the transformation would be complex
      return this.generateMockData(endpoint);
    } catch (error) {
      console.error('Error transforming API response:', error);
      // Return mock data as fallback
      return this.generateMockData(endpoint);
    }
  }

  // Public methods for fetching data
  async getBrandDeals(creatorId: string): Promise<BrandDealMetrics[]> {
    // For mock purposes, generate 1-5 random brand deals
    const numDeals = 1 + Math.floor(Math.random() * 5);
    const deals: BrandDealMetrics[] = [];
    
    // For real implementation, we would make API calls to sources with brand deal data
    for (let i = 0; i < numDeals; i++) {
      const endpoint = `deals/${creatorId}/${i}`;
      const url = `https://trends.google.com/trends/api/explore?q=${creatorId}&geo=US`;
      
      deals.push(
        await this.makeApiCall<BrandDealMetrics>(endpoint, url)
      );
    }
    
    return deals;
  }
}
