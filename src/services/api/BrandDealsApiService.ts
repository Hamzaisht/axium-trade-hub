
import { BaseApiService } from './BaseApiService';
import { BrandDealMetrics } from './ApiConfigService';
import { faker } from '@faker-js/faker';

export class BrandDealsApiService extends BaseApiService {
  constructor(apiKey: string = '', useProxyEndpoint = false) {
    super(apiKey, useProxyEndpoint);
  }

  // Generate mock data as required by BaseApiService
  protected generateMockData(endpoint: string): BrandDealMetrics {
    const brand = endpoint.split('/')[1] || 'Unknown Brand';
    
    // Get current date
    const now = new Date();
    
    // Start date between 1-6 months ago
    const startDate = new Date(now);
    startDate.setMonth(now.getMonth() - faker.number.int({ min: 1, max: 6 }));
    
    // End date between now and 12 months in the future
    const endDate = new Date(now);
    endDate.setMonth(now.getMonth() + faker.number.int({ min: 0, max: 12 }));
    
    // Generate deal value ($1k to $500k)
    const dealValue = faker.number.int({ min: 1000, max: 500000 });
    
    // Generate engagement rate (1% to 15%)
    const engagement = faker.number.float({ min: 1, max: 15, fractionDigits: 1 });
    
    return {
      brand,
      dealValue,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      engagement
    };
  }

  // Transform API response as required by BaseApiService
  protected transformApiResponse(endpoint: string, data: any): BrandDealMetrics {
    // For brand deals, we might receive data in various formats depending on the API
    // This is a placeholder implementation that would be customized for real APIs
    try {
      if (data.brandName || data.brand) {
        return {
          brand: data.brandName || data.brand,
          dealValue: data.value || data.dealValue || 0,
          startDate: data.startDate || new Date().toISOString(),
          endDate: data.endDate || new Date().toISOString(),
          engagement: data.engagement || 0
        };
      }
      
      // If the data format is unexpected, return mock data
      return this.generateMockData(endpoint);
    } catch (error) {
      console.error('Error transforming brand deal data:', error);
      return this.generateMockData(endpoint);
    }
  }

  // Generate mock brand deal data
  private generateMockBrandDeal(brand: string): BrandDealMetrics {
    // Get current date
    const now = new Date();
    
    // Start date between 1-6 months ago
    const startDate = new Date(now);
    startDate.setMonth(now.getMonth() - faker.number.int({ min: 1, max: 6 }));
    
    // End date between now and 12 months in the future
    const endDate = new Date(now);
    endDate.setMonth(now.getMonth() + faker.number.int({ min: 0, max: 12 }));
    
    // Generate deal value ($1k to $500k)
    const dealValue = faker.number.int({ min: 1000, max: 500000 });
    
    // Generate engagement rate (1% to 15%)
    const engagement = faker.number.float({ min: 1, max: 15, fractionDigits: 1 });
    
    return {
      brand,
      dealValue,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      engagement
    };
  }

  /**
   * Get all brand deals for a creator
   * @param creatorId The creator's ID
   * @returns List of brand deals
   */
  async getCreatorDeals(creatorId: string): Promise<BrandDealMetrics[]> {
    try {
      // For now, return mock data
      // In the future this could connect to a real brand deals API
      
      // Generate between 1-5 brand deals
      const dealCount = faker.number.int({ min: 1, max: 5 });
      
      // List of potential brands
      const potentialBrands = [
        'Nike', 'Adidas', 'Puma', 'Under Armour', 'New Balance',
        'Coca-Cola', 'Pepsi', 'Red Bull', 'Monster Energy', 'Gatorade',
        'Apple', 'Samsung', 'Google', 'Microsoft', 'Sony',
        'McDonalds', 'Burger King', 'Wendys', 'Taco Bell', 'KFC',
        'Amazon', 'Walmart', 'Target', 'Best Buy', 'GameStop',
        'Spotify', 'Netflix', 'Disney+', 'HBO Max', 'Hulu'
      ];
      
      // Select random brands for this creator
      const selectedBrands = faker.helpers.arrayElements(potentialBrands, dealCount);
      
      // Generate deal for each brand
      return selectedBrands.map(brand => this.generateMockBrandDeal(brand));
    } catch (error) {
      console.error('Error fetching brand deals:', error);
      return [];
    }
  }
}
