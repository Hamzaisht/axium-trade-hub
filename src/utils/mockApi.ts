
import { mockIPOs, delay, mockOrders, mockTrades } from './data';
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
  // Fields needed for mockAIModels.ts
  engagementScore?: number;
  aiScore?: number;
  totalSupply?: number;
  availableSupply?: number;
  initialPrice?: number;
  revenueUSD?: number;
  averageDailyVolume?: number;
  // Fields for social links in IPOForm
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
}

export interface Order {
  id: string;
  ipoId: string;
  userId: string;
  type: 'buy' | 'sell';
  orderType: 'market' | 'limit';
  price: number;
  quantity: number;
  status: 'pending' | 'fulfilled' | 'cancelled' | 'open';
  timestamp: string;
  // Add this field to match types/index.ts Order interface
  createdAt?: string;
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

export interface AnomalyDetectionResult {
  detected: boolean;
  anomalies: Array<{
    type: string;
    severity: number;
    description: string;
    timestamp: string;
  }>;
}

export interface DividendInfo {
  nextPayoutDate: string;
  historicalPayouts: Array<{ date: string; amount: number }>;
  annualYieldPercent: number;
  nextEstimatedAmount: number;
  payoutFrequency: string;
  warningThresholds: {
    low: number;
    medium: number;
    high: number;
  };
  inactivityThreshold: number;
  engagementMinimum: number;
  tokenBuybackPrice: number;
  liquidationProcess: string[];
}

export class MockTradingAPI {
  async getIPOs(): Promise<IPO[]> {
    await delay(300);
    
    // Add the missing properties required by mockAIModels.ts
    return mockIPOs.map(ipo => ({
      ...ipo,
      engagementScore: 50 + Math.floor(Math.random() * 50),
      aiScore: 40 + Math.floor(Math.random() * 60),
      totalSupply: ipo.supply,
      availableSupply: Math.floor(ipo.supply * 0.3),
      initialPrice: ipo.currentPrice * (0.8 + Math.random() * 0.3),
      revenueUSD: Math.floor(Math.random() * 10000000),
      averageDailyVolume: ipo.volume
    }));
  }

  async getIPO(ipoId: string): Promise<IPO | undefined> {
    await delay(300);
    const ipo = mockIPOs.find(ipo => ipo.id === ipoId);
    
    if (ipo) {
      return {
        ...ipo,
        engagementScore: 50 + Math.floor(Math.random() * 50),
        aiScore: 40 + Math.floor(Math.random() * 60),
        totalSupply: ipo.supply,
        availableSupply: Math.floor(ipo.supply * 0.3),
        initialPrice: ipo.currentPrice * (0.8 + Math.random() * 0.3),
        revenueUSD: Math.floor(Math.random() * 10000000),
        averageDailyVolume: ipo.volume
      };
    }
    
    return undefined;
  }

  // Add alias for getIPOs to fix getAllIPOs calls
  async getAllIPOs(): Promise<IPO[]> {
    return this.getIPOs();
  }

  // Add alias for getIPO to fix getIPOById calls
  async getIPOById(ipoId: string): Promise<IPO | undefined> {
    return this.getIPO(ipoId);
  }

  // Add createIPO method
  async createIPO(ipoData: Partial<IPO>): Promise<IPO> {
    await delay(500);
    
    const newIPO: IPO = {
      id: Math.random().toString(36).substring(2, 15),
      symbol: ipoData.symbol || 'TEST',
      creatorName: ipoData.creatorName || 'Test Creator',
      category: ipoData.category || 'Test Category',
      currentPrice: ipoData.initialPrice || 10,
      targetPrice: (ipoData.initialPrice || 10) * 1.2,
      priceChange: 0,
      description: ipoData.description || 'Test description',
      launchDate: new Date().toISOString(),
      valuation: ipoData.totalSupply ? ipoData.totalSupply * (ipoData.initialPrice || 10) : 1000000,
      volume: 0,
      supply: ipoData.totalSupply || 1000000,
      website: '',
      twitter: ipoData.socialLinks?.twitter || '',
      discord: '',
      telegram: '',
      youtube: ipoData.socialLinks?.youtube || '',
      instagram: ipoData.socialLinks?.instagram || '',
      featured: false,
      totalSupply: ipoData.totalSupply || 1000000,
      availableSupply: ipoData.availableSupply || 250000,
      initialPrice: ipoData.initialPrice || 10,
      revenueUSD: 0,
      averageDailyVolume: 0,
      socialLinks: ipoData.socialLinks
    };
    
    // Add to mock IPOs
    mockIPOs.push(newIPO);
    
    return newIPO;
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
      status: orderData.status || 'pending',
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString() // Add createdAt field
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
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString() // Add createdAt field
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
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString() // Add createdAt field
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
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString() // Add createdAt field
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
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString() // Add createdAt field
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

// Enhance the mockAIValuationAPI to include the missing methods
export const mockAIValuationAPI = {
  getPricePrediction: () => Promise.resolve({}),
  getSocialSentiment: mockTradingAPI.getSocialSentiment.bind(mockTradingAPI),
  calculateMarketDepth: () => Promise.resolve({}),
  getValuation: () => Promise.resolve({}),
  detectAnomalies: (ipoId: string, recentTrades: any[]): Promise<AnomalyDetectionResult> => {
    return Promise.resolve({
      detected: Math.random() > 0.5,
      anomalies: Math.random() > 0.3 ? [
        {
          type: 'wash_trading',
          severity: Math.floor(Math.random() * 10) + 1,
          description: 'Potential wash trading detected',
          timestamp: new Date().toISOString()
        }
      ] : []
    });
  },
  getCreatorScore: () => Promise.resolve({}),
  getCreatorMarketScore: (creatorId: string) => Promise.resolve({
    totalScore: 75 + Math.floor(Math.random() * 20),
    lastUpdated: new Date().toISOString()
  }),
  getDividendInfo: (ipoId: string): Promise<DividendInfo> => {
    return Promise.resolve({
      nextPayoutDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      historicalPayouts: [
        { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), amount: 0.05 },
        { date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), amount: 0.04 }
      ],
      annualYieldPercent: 4.8,
      nextEstimatedAmount: 0.06,
      payoutFrequency: 'Monthly',
      warningThresholds: { low: 30, medium: 60, high: 90 },
      inactivityThreshold: 90,
      engagementMinimum: 10,
      tokenBuybackPrice: 0.8,
      liquidationProcess: ['Warning', 'Partial Lock', 'Full Lock', 'Liquidation']
    });
  },
  getVestingRules: () => Promise.resolve({}),
  getVestingAndStakingRules: () => Promise.resolve({}),
  getLiquidationRules: () => Promise.resolve({}),
  getMarketDepth: () => Promise.resolve({}),
  predictPriceMovement: (ipoId: string, timeframe: string, model: string) => Promise.resolve({
    predicted: true,
    direction: Math.random() > 0.5 ? 'up' : 'down',
    confidence: Math.random() * 100,
    predictedPrice: Math.random() * 100 + 50
  }),
  getSentimentAnalysis: (creatorId: string) => Promise.resolve({
    overallSentiment: Math.floor(Math.random() * 100),
    positiveMentions: Math.floor(Math.random() * 1000),
    negativeMentions: Math.floor(Math.random() * 200),
    keywords: ['popular', 'trending', 'viral'],
    lastUpdated: new Date().toISOString()
  })
};

// Add these missing APIs that are referenced elsewhere in the codebase
export const mockIPOAPI = mockTradingAPI;

export const mockPortfolioAPI = {
  // Updated with history property
  getPortfolio: () => Promise.resolve({
    userId: 'test-user',
    holdings: [],
    totalValue: 0,
    cash: 10000,
    invested: 0,
    history: [
      { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), value: 9500 },
      { date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), value: 9000 }
    ]
  }),
  updatePortfolio: () => Promise.resolve({})
};
