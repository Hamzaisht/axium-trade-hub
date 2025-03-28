import { mockIPOs, delay } from './data';
import { getSocialSentiment as getSocialSentimentUtil } from './socialSentimentUtil';
import { 
  calculateMarketDepth, 
  predictPriceMovement, 
  detectAnomalies, 
  calculateDividendYield, 
  getTokenVestingRules,
  getLiquidationRules,
  AIModelType,
  PredictionTimeframe
} from './mockAIModels';
import { faker } from '@faker-js/faker';

// IPO Type definition
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
  revenueUSD?: number;
  averageDailyVolume?: number;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    website?: string;
  };
}

// Order definition
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
  createdAt: string;
}

// Trade definition
export interface Trade {
  id: string;
  ipoId: string;
  buyerId: string;
  sellerId: string;
  price: number;
  quantity: number;
  timestamp: string;
}

// Mock Trading API class
export class MockTradingAPI {
  async getIPOs() {
    await delay(300);
    return mockIPOs;
  }

  async getIPO(ipoId: string) {
    await delay(300);
    return mockIPOs.find((ipo) => ipo.id === ipoId);
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
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString()
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
      createdAt: new Date().toISOString()
    };
    console.log('Order cancelled:', cancelledOrder);
    return cancelledOrder;
  }

  async getUserOrders(): Promise<Order[]> {
    await delay(300);
    const orders: Order[] = [
      {
        id: Math.random().toString(36).substring(2, 15),
        ipoId: 'test-ipo',
        userId: 'test-user',
        type: 'buy',
        orderType: 'market',
        price: 100,
        quantity: 1,
        status: 'pending',
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
    ];
    return orders;
  }

  async getUserTrades(): Promise<Trade[]> {
    await delay(300);
    const trades: Trade[] = [
      {
        id: Math.random().toString(36).substring(2, 15),
        ipoId: 'test-ipo',
        buyerId: 'test-user',
        sellerId: 'another-user',
        price: 100,
        quantity: 1,
        timestamp: new Date().toISOString()
      }
    ];
    return trades;
  }

  async getOrderBook(ipoId: string) {
    await delay(300);
    const bids: Order[] = [
      {
        id: Math.random().toString(36).substring(2, 15),
        ipoId: ipoId,
        userId: 'test-user',
        type: 'buy',
        orderType: 'limit',
        price: 99,
        quantity: 1,
        status: 'open',
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
    ];
    const asks: Order[] = [
      {
        id: Math.random().toString(36).substring(2, 15),
        ipoId: ipoId,
        userId: 'test-user',
        type: 'sell',
        orderType: 'limit',
        price: 101,
        quantity: 1,
        status: 'open',
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
    ];
    return {
      bids,
      asks
    };
  }

  // These methods are expected by the IPOContext
  async getAllIPOs() {
    return this.getIPOs();
  }

  async getIPOById(ipoId: string) {
    return this.getIPO(ipoId);
  }

  async createIPO(ipoData: Partial<IPO>): Promise<IPO> {
    await delay(800);
    const newIPO: IPO = {
      id: Math.random().toString(36).substring(2, 15),
      creatorName: ipoData.creatorName || 'New Creator',
      symbol: ipoData.symbol || 'NCR',
      initialPrice: ipoData.initialPrice || 10,
      currentPrice: ipoData.initialPrice || 10,
      totalSupply: ipoData.totalSupply || 1000000,
      availableSupply: ipoData.availableSupply || 500000,
      engagementScore: ipoData.engagementScore || 50,
      aiScore: ipoData.aiScore || 50,
      launchDate: ipoData.launchDate || new Date().toISOString(),
      description: ipoData.description || 'New creator IPO',
      logoUrl: ipoData.logoUrl || 'https://via.placeholder.com/150',
      revenueUSD: ipoData.revenueUSD || 0,
      socialLinks: ipoData.socialLinks || {}
    };
    
    // Add the new IPO to the mock data (for this session only)
    mockIPOs.push(newIPO);
    
    return newIPO;
  }
}

// Mock AI Valuation API
export class MockAIValuationAPI {
  // Price prediction with parameters
  async predictPriceMovement(
    ipoId: string, 
    timeframe: PredictionTimeframe = "24h",
    modelType: AIModelType = AIModelType.HYBRID
  ) {
    await delay(500);
    const ipo = mockIPOs.find(item => item.id === ipoId);
    if (!ipo) throw new Error(`IPO with id ${ipoId} not found`);
    
    return predictPriceMovement(ipo, timeframe, modelType);
  }

  // Social sentiment analysis
  async getSocialSentiment(ipoId: string) {
    await delay(300);
    const ipo = mockIPOs.find(item => item.id === ipoId);
    if (!ipo) throw new Error(`IPO with id ${ipoId} not found`);
    
    const result = getSocialSentimentUtil(ipo);
    
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

  // Market depth analysis
  async getMarketDepth(ipoId: string) {
    await delay(400);
    const ipo = mockIPOs.find(item => item.id === ipoId);
    if (!ipo) throw new Error(`IPO with id ${ipoId} not found`);
    
    return calculateMarketDepth(ipo);
  }

  // Get valuation factors
  async getValuationFactors(ipoId: string) {
    await delay(600);
    const ipo = mockIPOs.find(item => item.id === ipoId);
    if (!ipo) throw new Error(`IPO with id ${ipoId} not found`);
    
    // Generate random valuation factors
    return {
      socialEngagement: {
        weight: 0.35,
        score: ipo.engagementScore,
        breakdown: {
          twitter: Math.round(ipo.engagementScore * (0.8 + Math.random() * 0.4)),
          instagram: Math.round(ipo.engagementScore * (0.8 + Math.random() * 0.4)),
          youtube: Math.round(ipo.engagementScore * (0.8 + Math.random() * 0.4))
        }
      },
      contentQuality: {
        weight: 0.25,
        score: Math.round(ipo.aiScore * (0.8 + Math.random() * 0.4)),
        breakdown: {
          consistency: Math.round(ipo.aiScore * (0.8 + Math.random() * 0.4)),
          audience_retention: Math.round(ipo.aiScore * (0.8 + Math.random() * 0.4)),
          production_value: Math.round(ipo.aiScore * (0.8 + Math.random() * 0.4))
        }
      },
      revenueStreams: {
        weight: 0.4,
        score: ipo.revenueUSD ? Math.min(90, Math.max(30, Math.log10(ipo.revenueUSD) * 10)) : 50,
        breakdown: {
          ad_revenue: Math.round(50 + Math.random() * 50),
          sponsorships: Math.round(50 + Math.random() * 50),
          merchandise: Math.round(50 + Math.random() * 50),
          live_events: Math.round(50 + Math.random() * 50)
        }
      }
    };
  }

  // Anomaly detection
  async detectAnomalies(ipoId: string, recentTrades: any[] = []) {
    await delay(300);
    const ipo = mockIPOs.find(item => item.id === ipoId);
    if (!ipo) throw new Error(`IPO with id ${ipoId} not found`);
    
    return detectAnomalies(ipo, recentTrades);
  }

  // Creator market score calculation
  async getCreatorMarketScore(
    ipoId: string, 
    externalMetrics?: any, 
    socialSentiment?: any,
    anomalyData?: any
  ) {
    await delay(800);
    const ipo = mockIPOs.find(item => item.id === ipoId);
    if (!ipo) throw new Error(`IPO with id ${ipoId} not found`);
    
    // Calculate the Creator Market Score based on multiple factors
    const revenueInfluenceScore = Math.min(100, ipo.revenueUSD ? Math.log10(ipo.revenueUSD) * 15 : 50);
    const socialEngagementScore = ipo.engagementScore;
    const aiSentimentScore = socialSentiment?.overall === 'positive' ? 75 : 
                            socialSentiment?.overall === 'very_positive' ? 90 :
                            socialSentiment?.overall === 'negative' ? 30 :
                            socialSentiment?.overall === 'very_negative' ? 15 : 50;
    
    // Weighted calculation
    const revenueWeight = 0.5;
    const socialWeight = 0.3;
    const sentimentWeight = 0.2;
    
    const totalScore = 
      (revenueInfluenceScore * revenueWeight) + 
      (socialEngagementScore * socialWeight) + 
      (aiSentimentScore * sentimentWeight);
    
    // Calculate price impact
    const currentPrice = ipo.currentPrice;
    const priceImpactFactor = (totalScore - 50) / 50; // Range: -1 to 1
    const recommendedPrice = currentPrice * (1 + priceImpactFactor * 0.2);
    const priceChange = recommendedPrice - currentPrice;
    const priceChangePercent = (priceChange / currentPrice) * 100;
    
    return {
      totalScore: Math.round(totalScore),
      revenueInfluence: {
        score: Math.round(revenueInfluenceScore),
        weight: revenueWeight,
        rawScore: revenueInfluenceScore,
        factors: [
          {name: 'Annual Revenue', impact: 0.6, description: 'Total verified yearly income'},
          {name: 'Revenue Growth', impact: 0.3, description: 'Year-over-year growth rate'},
          {name: 'Revenue Diversity', impact: 0.1, description: 'Multiple income streams'}
        ]
      },
      socialEngagementInfluence: {
        score: Math.round(socialEngagementScore),
        weight: socialWeight,
        rawScore: socialEngagementScore,
        factors: [
          {name: 'Follower Count', impact: 0.3, description: 'Total followers across platforms'},
          {name: 'Engagement Rate', impact: 0.5, description: 'Interactions per post/video'},
          {name: 'Growth Rate', impact: 0.2, description: 'New followers trend'}
        ]
      },
      aiSentimentScore: {
        score: Math.round(aiSentimentScore),
        weight: sentimentWeight,
        rawScore: aiSentimentScore,
        factors: [
          {name: 'Public Sentiment', impact: 0.4, description: 'Overall sentiment in media'},
          {name: 'Content Reception', impact: 0.4, description: 'How content is received'},
          {name: 'Industry Standing', impact: 0.2, description: 'Reputation among peers'}
        ]
      },
      priceImpact: {
        recommendedPrice: parseFloat(recommendedPrice.toFixed(2)),
        priceChange: parseFloat(priceChange.toFixed(2)),
        priceChangePercent: parseFloat(priceChangePercent.toFixed(2)),
        confidence: Math.round(70 + Math.random() * 25)
      },
      anomalyDetection: {
        hasAnomalies: false,
        anomalyImpact: 0
      },
      lastUpdated: new Date().toISOString()
    };
  }

  // Dividend information
  async getDividendInfo(ipoId: string) {
    await delay(400);
    const ipo = mockIPOs.find(item => item.id === ipoId);
    if (!ipo) throw new Error(`IPO with id ${ipoId} not found`);
    
    const dividendYield = calculateDividendYield(ipo);
    
    // Create historical payout data
    const historicalPayouts = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (i + 1));
      
      return {
        date: date.toISOString(),
        amount: parseFloat((Math.random() * 0.5 + 0.1).toFixed(2)),
        status: i === 0 ? 'pending' : 'paid'
      };
    });
    
    return {
      ...dividendYield,
      historicalPayouts,
      warningThresholds: {
        minimum: 1.0,
        low: 2.0,
        high: 8.0
      }
    };
  }

  // Vesting and staking rules
  async getVestingAndStakingRules(ipoId: string) {
    await delay(300);
    const ipo = mockIPOs.find(item => item.id === ipoId);
    if (!ipo) throw new Error(`IPO with id ${ipoId} not found`);
    
    const vestingRules = getTokenVestingRules(ipo);
    
    // Additional data for UI display
    const tokenLockupSchedule = [
      { milestone: 'Launch', percentage: vestingRules.creatorVesting.initialUnlock, date: ipo.launchDate },
      { milestone: '3 Months', percentage: vestingRules.creatorVesting.initialUnlock + 3 * vestingRules.creatorVesting.monthlyUnlock, date: this.addMonths(ipo.launchDate, 3) },
      { milestone: '6 Months', percentage: vestingRules.creatorVesting.initialUnlock + 6 * vestingRules.creatorVesting.monthlyUnlock, date: this.addMonths(ipo.launchDate, 6) },
      { milestone: '12 Months', percentage: vestingRules.creatorVesting.initialUnlock + 12 * vestingRules.creatorVesting.monthlyUnlock, date: this.addMonths(ipo.launchDate, 12) },
      { milestone: 'Full Vest', percentage: 100, date: this.addMonths(ipo.launchDate, vestingRules.creatorVesting.vestingPeriod) }
    ];
    
    return {
      ...vestingRules,
      tokenLockupSchedule
    };
  }

  // Liquidation rules
  async getLiquidationRules(ipoId: string) {
    await delay(300);
    const ipo = mockIPOs.find(item => item.id === ipoId);
    if (!ipo) throw new Error(`IPO with id ${ipoId} not found`);
    
    return getLiquidationRules(ipo);
  }

  // Helper function to add months to a date string
  private addMonths(dateString: string, months: number): string {
    const date = new Date(dateString);
    date.setMonth(date.getMonth() + months);
    return date.toISOString();
  }

  // For testing the new sentiment analysis service
  async getSentimentAnalysis() {
    await delay(500);
    return {
      sentimentScore: Math.round(Math.random() * 100),
      sentimentChange: Math.round((Math.random() * 20) - 10),
      lastUpdated: new Date().toISOString(),
      platforms: {
        twitter: Math.round(Math.random() * 100),
        instagram: Math.round(Math.random() * 100),
        youtube: Math.round(Math.random() * 100)
      }
    };
  }
}

// Create instances of the API classes
export const mockTradingAPI = new MockTradingAPI();
export const mockIPOAPI = mockTradingAPI;
export const mockAIValuationAPI = new MockAIValuationAPI();
