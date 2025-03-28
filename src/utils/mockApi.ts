
import { faker } from '@faker-js/faker';
import { delay } from './data';
import { socialSentimentUtil } from './socialSentimentUtil';

// Types for mock API
export interface IPO {
  id: string;
  creatorName: string;
  symbol: string;
  initialPrice: number;
  currentPrice: number;
  totalSupply: number;
  availableSupply: number;
  engagementScore: number;
  aiScore: number;
  launchDate: string;
  description: string;
  logoUrl: string;
  revenueUSD: number;
  averageDailyVolume: number;
  socialLinks: {
    twitter: string;
    instagram: string;
    youtube: string;
    tiktok: string;
    website: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  ipoId: string;
  price: number;
  quantity: number;
  type: 'buy' | 'sell';
  status: 'pending' | 'executed' | 'cancelled';
  timestamp: string;
}

export interface Trade {
  id: string;
  buyerId: string;
  sellerId: string;
  ipoId: string;
  price: number;
  quantity: number;
  timestamp: string;
}

// Mock API with methods to simulate backend interactions
export const mockIPOAPI = {
  async getAllIPOs(): Promise<IPO[]> {
    await delay(300);
    return Array.from({ length: 10 }, () => ({
      id: faker.string.uuid(),
      creatorName: faker.person.fullName(),
      symbol: faker.finance.currencyCode().substring(0, 3),
      initialPrice: faker.number.float({ min: 5, max: 50, fractionDigits: 2 }),
      currentPrice: faker.number.float({ min: 5, max: 50, fractionDigits: 2 }),
      totalSupply: faker.number.int({ min: 1000000, max: 10000000 }),
      availableSupply: faker.number.int({ min: 500000, max: 1000000 }),
      engagementScore: faker.number.int({ min: 30, max: 95 }),
      aiScore: faker.number.int({ min: 30, max: 95 }),
      launchDate: faker.date.recent({ days: 90 }).toISOString(),
      description: faker.lorem.paragraph(),
      logoUrl: faker.image.avatarGitHub(),
      revenueUSD: faker.number.int({ min: 100000, max: 10000000 }),
      averageDailyVolume: faker.number.int({ min: 1000, max: 100000 }),
      socialLinks: {
        twitter: faker.internet.url(),
        instagram: faker.internet.url(),
        youtube: faker.internet.url(),
        tiktok: faker.internet.url(),
        website: faker.internet.url(),
      }
    }));
  },

  async getSocialSentiment(ipoId?: string) {
    await delay(300);
    // Optional: use ipoId for any specific calculations if needed
    return socialSentimentUtil(ipoId);
  }
};

export const mockTradingAPI = {
  async placeOrder(orderData: Partial<Order>): Promise<Order> {
    await delay(300);
    return {
      id: faker.string.uuid(),
      ...orderData,
      status: 'pending',
      timestamp: new Date().toISOString()
    } as Order;
  },

  async cancelOrder(orderId: string): Promise<Order> {
    await delay(300);
    return {
      id: orderId,
      userId: faker.string.uuid(),
      ipoId: faker.string.uuid(),
      price: faker.number.float({ min: 5, max: 50, fractionDigits: 2 }),
      quantity: faker.number.int({ min: 1, max: 100 }),
      type: 'buy',
      status: 'cancelled',
      timestamp: new Date().toISOString()
    };
  },

  async getUserOrders(): Promise<Order[]> {
    await delay(300);
    return Array.from({ length: 5 }, () => ({
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      ipoId: faker.string.uuid(),
      price: faker.number.float({ min: 5, max: 50, fractionDigits: 2 }),
      quantity: faker.number.int({ min: 1, max: 100 }),
      type: 'buy',
      status: 'pending',
      timestamp: new Date().toISOString()
    }));
  },

  async getUserTrades(): Promise<Trade[]> {
    await delay(300);
    return Array.from({ length: 5 }, () => ({
      id: faker.string.uuid(),
      buyerId: faker.string.uuid(),
      sellerId: faker.string.uuid(),
      ipoId: faker.string.uuid(),
      price: faker.number.float({ min: 5, max: 50, fractionDigits: 2 }),
      quantity: faker.number.int({ min: 1, max: 100 }),
      timestamp: new Date().toISOString()
    }));
  },

  async getOrderBook(ipoId: string): Promise<{ bids: Order[], asks: Order[] }> {
    await delay(300);
    return {
      bids: Array.from({ length: 5 }, () => ({
        id: faker.string.uuid(),
        userId: faker.string.uuid(),
        ipoId,
        price: faker.number.float({ min: 5, max: 50, fractionDigits: 2 }),
        quantity: faker.number.int({ min: 1, max: 100 }),
        type: 'buy',
        status: 'pending',
        timestamp: new Date().toISOString()
      })),
      asks: Array.from({ length: 5 }, () => ({
        id: faker.string.uuid(),
        userId: faker.string.uuid(),
        ipoId,
        price: faker.number.float({ min: 5, max: 50, fractionDigits: 2 }),
        quantity: faker.number.int({ min: 1, max: 100 }),
        type: 'sell',
        status: 'pending',
        timestamp: new Date().toISOString()
      }))
    };
  }
};

