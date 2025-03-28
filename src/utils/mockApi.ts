import { mockIPOs, delay } from './data';
import { getSocialSentiment as getSocialSentimentUtil } from './socialSentimentUtil';

export type SentimentTrend = 'positive' | 'negative' | 'neutral';

export interface IPO {
  id: string;
  symbol: string;
  creatorName: string;
  category: string;
  currentPrice: number;
  targetPrice: number;
  priceChange: number;
  description: string;
  launchDate: string;
  valuation: number;
  volume: number;
  supply: number;
  website: string;
  twitter: string;
  discord: string;
  telegram: string;
  youtube: string;
  instagram: string;
  featured: boolean;
}

export interface Order {
  id: string;
  ipoId: string;
  userId: string;
  type: 'buy' | 'sell';
  orderType: 'market' | 'limit';
  price: number;
  quantity: number;
  status: 'pending' | 'fulfilled' | 'cancelled';
  timestamp: string;
}

export interface Trade {
  id: string;
  ipoId: string;
  buyerId: string;
  sellerId: string;
  price: number;
  quantity: number;
  timestamp: string;
}

export class MockTradingAPI {
  async getIPOs(): Promise<IPO[]> {
    await delay(300);
    return mockIPOs;
  }

  async getIPO(ipoId: string): Promise<IPO | undefined> {
    await delay(300);
    return mockIPOs.find(ipo => ipo.id === ipoId);
  }

  async placeOrder(orderData: Partial<Order>): Promise<Order> {
    await delay(500);
    
    const newOrder: Order = {
      id: Math.random().toString(36).substring(2, 15),
      ipoId: orderData.ipoId || 'test-ipo',
      userId: orderData.userId || 'test-user',
      type: orderData.type || 'buy',
      orderType: orderData.orderType || 'market',
      price: orderData.price || 100,
      quantity: orderData.quantity || 1,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    
    console.log('Order placed:', newOrder);
    return newOrder;
  }

  async cancelOrder(orderId: string): Promise<Order> {
    await delay(300);
    
    const cancelledOrder: Order = {
      id: orderId,
      ipoId: 'test-ipo',
      userId: 'test-user',
      type: 'buy',
      orderType: 'market',
      price: 100,
      quantity: 1,
      status: 'cancelled',
      timestamp: new Date().toISOString()
    };
    
    console.log('Order cancelled:', cancelledOrder);
    return cancelledOrder;
  }

  async getUserOrders(): Promise<Order[]> {
    await delay(300);
    
    const orders: Order[] = [{
      id: Math.random().toString(36).substring(2, 15),
      ipoId: 'test-ipo',
      userId: 'test-user',
      type: 'buy',
      orderType: 'market',
      price: 100,
      quantity: 1,
      status: 'pending',
      timestamp: new Date().toISOString()
    }];
    
    return orders;
  }

  async getUserTrades(): Promise<Trade[]> {
    await delay(300);
    
    const trades: Trade[] = [{
      id: Math.random().toString(36).substring(2, 15),
      ipoId: 'test-ipo',
      buyerId: 'test-user',
      sellerId: 'another-user',
      price: 100,
      quantity: 1,
      timestamp: new Date().toISOString()
    }];
    
    return trades;
  }

  async getOrderBook(ipoId: string): Promise<{ bids: Order[]; asks: Order[]; }> {
    await delay(300);
    
    const bids: Order[] = [{
      id: Math.random().toString(36).substring(2, 15),
      ipoId: ipoId,
      userId: 'test-user',
      type: 'buy',
      orderType: 'limit',
      price: 99,
      quantity: 1,
      status: 'pending',
      timestamp: new Date().toISOString()
    }];
    
    const asks: Order[] = [{
      id: Math.random().toString(36).substring(2, 15),
      ipoId: ipoId,
      userId: 'test-user',
      type: 'sell',
      orderType: 'limit',
      price: 101,
      quantity: 1,
      status: 'pending',
      timestamp: new Date().toISOString()
    }];
    
    return { bids, asks };
  }

  async getSocialSentiment(ipoId: string): Promise<{
    overall: SentimentTrend;
    metrics: {
      twitter: { score: number; trend: SentimentTrend; volume: number };
      instagram: { score: number; trend: SentimentTrend; volume: number };
      youtube: { score: number; trend: SentimentTrend; volume: number };
    };
    keywords: string[];
  }> {
    await delay(300);
    const ipo = mockIPOs.find(item => item.id === ipoId);
    if (!ipo) throw new Error(`IPO with id ${ipoId} not found`);

    // Get the result from the utility function
    const result = getSocialSentimentUtil(ipo);
    
    // Ensure all numeric values are properly typed as numbers
    return {
      overall: result.overall,
      metrics: {
        twitter: {
          score: Number(result.metrics.twitter.score),
          trend: result.metrics.twitter.trend,
          volume: Number(result.metrics.twitter.volume)
        },
        instagram: {
          score: Number(result.metrics.instagram.score),
          trend: result.metrics.instagram.trend,
          volume: Number(result.metrics.instagram.volume)
        },
        youtube: {
          score: Number(result.metrics.youtube.score),
          trend: result.metrics.youtube.trend,
          volume: Number(result.metrics.youtube.volume)
        }
      },
      keywords: result.keywords
    };
  }
}

export const mockTradingAPI = new MockTradingAPI();
