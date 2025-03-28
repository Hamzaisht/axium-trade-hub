
// Mock data utility functions
import { IPO } from './mockApi';
import { faker } from '@faker-js/faker';

// Helper to introduce delay in mock API calls
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Generate random IPO data
const generateMockIPOs = (count: number = 10): IPO[] => {
  return Array.from({ length: count }, (_, index) => {
    const initialPrice = faker.number.float({ min: 5, max: 50, fractionDigits: 2 });
    const priceChange = faker.number.float({ min: -20, max: 30, fractionDigits: 2 });
    const currentPrice = initialPrice * (1 + priceChange / 100);
    
    return {
      id: faker.string.uuid(),
      creatorName: faker.person.fullName(),
      symbol: faker.finance.currencyCode().substring(0, 3),
      initialPrice,
      currentPrice,
      totalSupply: faker.number.int({ min: 1000000, max: 10000000 }),
      availableSupply: faker.number.int({ min: 500000, max: 1000000 }),
      engagementScore: faker.number.int({ min: 30, max: 95 }),
      aiScore: faker.number.int({ min: 30, max: 95 }),
      launchDate: faker.date.recent({ days: 90 }).toISOString(),
      description: faker.lorem.paragraph(),
      logoUrl: `https://i.pravatar.cc/150?u=${index}`,
      revenueUSD: faker.number.int({ min: 100000, max: 10000000 }),
      averageDailyVolume: faker.number.int({ min: 1000, max: 100000 }),
      socialLinks: {
        twitter: faker.internet.url(),
        instagram: faker.internet.url(),
        youtube: faker.internet.url(),
        tiktok: faker.internet.url(),
        website: faker.internet.url(),
      }
    };
  });
};

// Export mock data
export const mockIPOs = generateMockIPOs();
