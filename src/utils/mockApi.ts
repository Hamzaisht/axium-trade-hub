
/**
 * Mock API
 * Simulates API endpoints for creator data, IPOs, and trading
 */

import {
  predictPriceMovement,
  calculateMarketDepth,
  getSocialSentiment,
  calculateDividendYield,
  getTokenVestingRules,
  getLiquidationRules,
  calculateSpread,
  detectAnomalies,
  AIModelType,
  PredictionTimeframe
} from "./mockAIModels";

// Mock data for creators
export interface Creator {
  id: string;
  name: string;
  bio: string;
  profilePic: string;
  socialLinks: {
    twitter: string;
    instagram: string;
    youtube: string;
  };
  // Add revenue data
  revenueUSD?: number;
}

// Mock data for IPOs
export interface IPO {
  id: string;
  creatorId: string;
  creatorName: string;
  symbol: string; // Added symbol field
  initialPrice: number;
  currentPrice: number;
  totalSupply: number;
  availableSupply: number;
  launchDate: string;
  description: string;
  aiScore: number;
  engagementScore: number;
  marketCap: number;
  volume24h: number;
  // Add average daily volume
  averageDailyVolume?: number;
  // Add revenue data
  revenueUSD?: number;
  // Add social links
  socialLinks?: {
    twitter: string;
    instagram: string;
    youtube: string;
  };
}

// Mock data for orders
export interface Order {
  id: string;
  userId?: string; // Added userId field
  ipoId?: string; // Added ipoId field
  price: number;
  quantity: number;
  type: "buy" | "sell";
  timestamp: string;
  status?: 'open' | 'filled' | 'cancelled';
  orderType?: 'market' | 'limit';
}

// Mock data for transactions
export interface Transaction {
  id: string;
  buyerId: string;
  sellerId: string;
  ipoId: string;
  creatorSymbol: string;
  price: number;
  quantity: number;
  timestamp: string;
}

// Define Trade interface
export interface Trade extends Transaction {
  // Trade is basically the same as Transaction in this mock
}

// Define Portfolio interface
export interface Portfolio {
  id: string;
  userId: string;
  cash: number;
  totalValue: number;
  holdings: {
    ipoId: string;
    symbol: string;
    quantity: number;
    averagePurchasePrice: number;
    currentPrice: number;
  }[];
  history: {
    date: string;
    value: number;
  }[];
}

// Mock data arrays (needed by mockWebSocket.ts)
export const mockIPOs: IPO[] = [];
export const mockOrders: Order[] = [];
export const mockTrades: Trade[] = [];

// API class to simulate backend calls
class MockIPOAPI {
  private creators: Creator[] = [
    {
      id: "emma-watson",
      name: "Emma Watson",
      bio: "Actress and activist known for her roles in Harry Potter and her work with the UN.",
      profilePic: "https://via.placeholder.com/150",
      socialLinks: {
        twitter: "https://twitter.com/emmawatson",
        instagram: "https://instagram.com/emmawatson",
        youtube: "https://youtube.com/emmawatson",
      },
      revenueUSD: 750000,
    },
    {
      id: "taylor-swift",
      name: "Taylor Swift",
      bio: "Singer-songwriter and global pop superstar.",
      profilePic: "https://via.placeholder.com/150",
      socialLinks: {
        twitter: "https://twitter.com/taylorswift13",
        instagram: "https://instagram.com/taylorswift",
        youtube: "https://youtube.com/taylorswift",
      },
      revenueUSD: 1200000,
    },
    {
      id: "elon-musk",
      name: "Elon Musk",
      bio: "Entrepreneur and business magnate; founder of SpaceX, Tesla, and more.",
      profilePic: "https://via.placeholder.com/150",
      socialLinks: {
        twitter: "https://twitter.com/elonmusk",
        instagram: "https://instagram.com/elonmusk",
        youtube: "https://youtube.com/elonmusk",
      },
      revenueUSD: 2000000,
    },
    {
      id: "mr-beast",
      name: "MrBeast",
      bio: "YouTube personality, philanthropist, and entrepreneur known for elaborate stunts and challenges.",
      profilePic: "https://via.placeholder.com/150",
      socialLinks: {
        twitter: "https://twitter.com/MrBeast",
        instagram: "https://instagram.com/mrbeast",
        youtube: "https://youtube.com/MrBeast",
      },
      revenueUSD: 900000,
    },
    {
      id: "arianagrande",
      name: "Ariana Grande",
      bio: "Singer, songwriter, and actress with a powerful voice and a global fanbase.",
      profilePic: "https://via.placeholder.com/150",
      socialLinks: {
        twitter: "https://twitter.com/ArianaGrande",
        instagram: "https://instagram.com/arianagrande",
        youtube: "https://youtube.com/arianagrande",
      },
      revenueUSD: 1100000,
    },
  ];
  private ipos: IPO[] = [
    {
      id: "emma-watson-ipo",
      creatorId: "emma-watson",
      creatorName: "Emma Watson",
      symbol: "EMW",
      initialPrice: 20.00,
      currentPrice: 24.82,
      totalSupply: 1000000,
      availableSupply: 350000,
      launchDate: "2024-01-20T14:30:00.000Z",
      description: "Official token representing shares in Emma Watson's future earnings and ventures.",
      aiScore: 85,
      engagementScore: 78,
      marketCap: 24820000,
      volume24h: 67800,
      averageDailyVolume: 70000,
      revenueUSD: 750000,
    },
    {
      id: "taylor-swift-ipo",
      creatorId: "taylor-swift",
      creatorName: "Taylor Swift",
      symbol: "TSWIFT",
      initialPrice: 25.50,
      currentPrice: 31.25,
      totalSupply: 1500000,
      availableSupply: 500000,
      launchDate: "2023-11-15T09:00:00.000Z",
      description: "Exclusive token providing access to Taylor Swift's upcoming album releases and concert tickets.",
      aiScore: 92,
      engagementScore: 89,
      marketCap: 46875000,
      volume24h: 123500,
      averageDailyVolume: 130000,
      revenueUSD: 1200000,
    },
    {
      id: "elon-musk-ipo",
      creatorId: "elon-musk",
      creatorName: "Elon Musk",
      symbol: "MUSK",
      initialPrice: 30.00,
      currentPrice: 28.50,
      totalSupply: 2000000,
      availableSupply: 600000,
      launchDate: "2023-09-01T18:45:00.000Z",
      description: "Token backed by Elon Musk's ventures, offering holders exclusive insights and voting rights.",
      aiScore: 78,
      engagementScore: 65,
      marketCap: 57000000,
      volume24h: 95200,
      averageDailyVolume: 100000,
      revenueUSD: 2000000,
    },
    {
      id: "mr-beast-ipo",
      creatorId: "mr-beast",
      creatorName: "MrBeast",
      symbol: "BEAST",
      initialPrice: 18.75,
      currentPrice: 22.10,
      totalSupply: 1200000,
      availableSupply: 400000,
      launchDate: "2024-02-10T12:00:00.000Z",
      description: "Token that grants holders early access to MrBeast's challenges and a chance to participate in his videos.",
      aiScore: 88,
      engagementScore: 95,
      marketCap: 26520000,
      volume24h: 89700,
      averageDailyVolume: 90000,
      revenueUSD: 900000,
    },
    {
      id: "ariana-grande-ipo",
      creatorId: "arianagrande",
      creatorName: "Ariana Grande",
      symbol: "ARIANA",
      initialPrice: 22.00,
      currentPrice: 26.75,
      totalSupply: 1300000,
      availableSupply: 450000,
      launchDate: "2023-12-01T21:15:00.000Z",
      description: "Token providing VIP access to Ariana Grande's concerts, meet-and-greets, and exclusive merchandise.",
      aiScore: 90,
      engagementScore: 85,
      marketCap: 34775000,
      volume24h: 110300,
      averageDailyVolume: 115000,
      revenueUSD: 1100000,
    },
  ];
  private orders: Order[] = [];
  private transactions: Transaction[] = [];

  // Simulate network delay
  private async simulateNetworkDelay(maxDelay = 800) {
    const delay = Math.random() * maxDelay;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  // Get all creators
  async getAllCreators(): Promise<Creator[]> {
    await this.simulateNetworkDelay();
    return this.creators;
  }

  // Get creator by ID
  async getCreatorById(creatorId: string): Promise<Creator | undefined> {
    await this.simulateNetworkDelay();
    return this.creators.find(creator => creator.id === creatorId);
  }

  // Get all IPOs
  async getAllIPOs(): Promise<IPO[]> {
    await this.simulateNetworkDelay();
    // Copy ipos to mockIPOs for WebSocket
    mockIPOs.length = 0;
    this.ipos.forEach(ipo => mockIPOs.push({...ipo}));
    return this.ipos;
  }

  // Get IPO by ID
  async getIPOById(ipoId: string): Promise<IPO | undefined> {
    await this.simulateNetworkDelay();
    return this.ipos.find(ipo => ipo.id === ipoId);
  }

  // Create IPO
  async createIPO(ipoData: Partial<IPO>): Promise<IPO> {
    await this.simulateNetworkDelay();
    const newIPO: IPO = {
      id: `${ipoData.creatorId || 'unknown'}-ipo-${Date.now()}`,
      creatorId: ipoData.creatorId || 'unknown',
      creatorName: ipoData.creatorName || 'Unknown Creator',
      symbol: ipoData.symbol || 'NEW',
      initialPrice: ipoData.initialPrice || 1.00,
      currentPrice: ipoData.initialPrice || 1.00,
      totalSupply: ipoData.totalSupply || 1000000,
      availableSupply: ipoData.availableSupply || 500000,
      launchDate: new Date().toISOString(),
      description: ipoData.description || 'New creator token',
      aiScore: Math.floor(Math.random() * 100),
      engagementScore: Math.floor(Math.random() * 100),
      marketCap: (ipoData.initialPrice || 1.00) * (ipoData.totalSupply || 1000000),
      volume24h: 0,
      averageDailyVolume: Math.floor(Math.random() * 10000),
      revenueUSD: ipoData.revenueUSD || 100000,
      socialLinks: ipoData.socialLinks
    };
    this.ipos.push(newIPO);
    mockIPOs.push({...newIPO});
    return newIPO;
  }

  // Add order
  async addOrder(order: Order): Promise<Order> {
    await this.simulateNetworkDelay();
    this.orders.push(order);
    mockOrders.push({...order});
    return order;
  }

  // Get orders by IPO ID
  async getOrdersByIPOId(ipoId: string): Promise<Order[]> {
    await this.simulateNetworkDelay();
    return this.orders.filter(order => order.ipoId === ipoId);
  }

  // Add transaction
  async addTransaction(transaction: Transaction): Promise<Transaction> {
    await this.simulateNetworkDelay();
    this.transactions.push(transaction);
    mockTrades.push({...transaction} as Trade);
    return transaction;
  }

  // Get transactions by IPO ID
  async getTransactionsByIPOId(ipoId: string): Promise<Transaction[]> {
    await this.simulateNetworkDelay();
    return this.transactions.filter(transaction => transaction.ipoId === ipoId);
  }
}

// Mock Trading API
class MockTradingAPI {
  // Simulate network delay
  private async simulateNetworkDelay(maxDelay = 800) {
    const delay = Math.random() * maxDelay;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  // Place order
  async placeOrder(orderData: Partial<Order>): Promise<Order> {
    await this.simulateNetworkDelay();
    const order: Order = {
      id: `order-${Date.now()}`,
      userId: orderData.userId || 'current-user',
      ipoId: orderData.ipoId,
      price: orderData.price || 0,
      quantity: orderData.quantity || 1,
      type: orderData.type || 'buy',
      timestamp: new Date().toISOString(),
      status: 'open',
      orderType: orderData.orderType || 'market'
    };
    mockOrders.push(order);
    return order;
  }

  // Cancel order
  async cancelOrder(orderId: string): Promise<Order> {
    await this.simulateNetworkDelay();
    const orderIndex = mockOrders.findIndex(o => o.id === orderId);
    if (orderIndex >= 0) {
      mockOrders[orderIndex].status = 'cancelled';
      return mockOrders[orderIndex];
    }
    throw new Error('Order not found');
  }

  // Get user orders
  async getUserOrders(): Promise<Order[]> {
    await this.simulateNetworkDelay();
    return mockOrders.filter(o => o.userId === 'current-user');
  }

  // Get user trades
  async getUserTrades(): Promise<Trade[]> {
    await this.simulateNetworkDelay();
    return mockTrades.filter(t => t.buyerId === 'current-user' || t.sellerId === 'current-user');
  }

  // Get order book for an IPO
  async getOrderBook(ipoId: string): Promise<{ bids: Order[], asks: Order[] }> {
    await this.simulateNetworkDelay();
    const openOrders = mockOrders.filter(o => o.ipoId === ipoId && o.status === 'open');
    const bids = openOrders.filter(o => o.type === 'buy').sort((a, b) => b.price - a.price);
    const asks = openOrders.filter(o => o.type === 'sell').sort((a, b) => a.price - b.price);
    return { bids, asks };
  }
}

// Mock Portfolio API
class MockPortfolioAPI {
  // Simulate network delay
  private async simulateNetworkDelay(maxDelay = 800) {
    const delay = Math.random() * maxDelay;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  // Get user portfolio
  async getUserPortfolio(): Promise<Portfolio> {
    await this.simulateNetworkDelay();
    // Mock portfolio data
    return {
      id: 'portfolio-1',
      userId: 'current-user',
      cash: 10000,
      totalValue: 25000,
      holdings: [
        {
          ipoId: 'emma-watson-ipo',
          symbol: 'EMW',
          quantity: 500,
          averagePurchasePrice: 20,
          currentPrice: 24.82
        },
        {
          ipoId: 'taylor-swift-ipo',
          symbol: 'TSWIFT',
          quantity: 100,
          averagePurchasePrice: 25,
          currentPrice: 31.25
        }
      ],
      history: [
        { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), value: 15000 },
        { date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), value: 17500 },
        { date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), value: 16800 },
        { date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), value: 19200 },
        { date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), value: 21500 },
        { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), value: 23100 },
        { date: new Date().toISOString(), value: 25000 }
      ]
    };
  }
}

// AI valuation API mock
class AIValuationAPI {
  // Simulate network delay
  private async simulateNetworkDelay(maxDelay = 800) {
    const delay = Math.random() * maxDelay;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  async getValuationFactors(ipoId: string) {
    await this.simulateNetworkDelay();
    return {
      creatorId: ipoId,
      factors: ["Engagement Rate", "Market Sentiment", "AI Score"],
      weights: [0.4, 0.3, 0.3]
    };
  }

  async predictPriceMovement(ipoId: string, timeframe: PredictionTimeframe = "24h", modelType: AIModelType = AIModelType.HYBRID) {
    await this.simulateNetworkDelay();
    const ipo = await mockIPOAPI.getIPOById(ipoId);
    return predictPriceMovement(ipo, timeframe, modelType);
  }

  async getMarketDepth(ipoId: string) {
    await this.simulateNetworkDelay();
    const ipo = await mockIPOAPI.getIPOById(ipoId);
    const marketDepth = calculateMarketDepth(ipo);
    
    // Add current spread to market depth data
    const spread = calculateSpread(ipo);
    
    return {
      ...marketDepth,
      currentSpread: spread
    };
  }

  async getSocialSentiment(ipoId: string) {
    await this.simulateNetworkDelay();
    const ipo = await mockIPOAPI.getIPOById(ipoId);
    return getSocialSentiment(ipo);
  }

  async getDividendInfo(ipoId: string) {
    await this.simulateNetworkDelay();
    const ipo = await mockIPOAPI.getIPOById(ipoId);
    return calculateDividendYield(ipo);
  }

  async getVestingRules(ipoId: string) {
    await this.simulateNetworkDelay();
    const ipo = await mockIPOAPI.getIPOById(ipoId);
    return getTokenVestingRules(ipo);
  }

  async getVestingAndStakingRules(ipoId: string) {
    await this.simulateNetworkDelay();
    return this.getVestingRules(ipoId);
  }

  async getLiquidationRules(ipoId: string) {
    await this.simulateNetworkDelay();
    const ipo = await mockIPOAPI.getIPOById(ipoId);
    return getLiquidationRules(ipo);
  }
  
  // Method for anomaly detection
  async detectAnomalies(ipoId: string, recentTrades: any[] = []) {
    await this.simulateNetworkDelay(500); // Faster response for real-time monitoring
    const ipo = await mockIPOAPI.getIPOById(ipoId);
    return detectAnomalies(ipo, recentTrades);
  }
}

// Export mock API instances
export const mockIPOAPI = new MockIPOAPI();
export const mockAIValuationAPI = new AIValuationAPI();
export const mockTradingAPI = new MockTradingAPI();
export const mockPortfolioAPI = new MockPortfolioAPI();

// Mock function to generate random number within a range
export const getRandomNumber = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};
