/**
 * Mock API
 * Simulates API endpoints for fetching creator data, IPOs, and AI valuations.
 */

import { faker } from '@faker-js/faker';

// Define types for mock data
export interface IPO {
  id: string;
  creatorName: string;
  symbol: string;
  initialPrice: number;
  currentPrice: number;
  totalSupply: number;
  availableSupply: number;
  launchDate: string;
  revenueUSD: number;
  engagementScore: number;
  aiScore: number;
  averageDailyVolume: number;
  description: string;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    twitch?: string;
    tiktok?: string;
  };
  totalShares: number;
  priceChange: number;
  volume24h: number;
  investorCount: number;
  followerCount: number;
  activeUserCount: number;
  engagementRate: number;
  sentimentScore: number;
  revenueStreams: {
    subscriptions?: number;
    advertising?: number;
    merchandise?: number;
    sponsorships?: number;
  } | any[];
  totalRevenue: number;
  yoyGrowth: number;
  audienceGrowth: number;
  contentGrowth: number;
  platformExpansion: number;
  projectedGrowth: number;
  category?: string;
}

export interface Order {
  id: string;
  userId: string;
  ipoId: string;
  price: number;
  quantity: number;
  type: 'buy' | 'sell';
  orderType?: 'market' | 'limit';
  status: 'pending' | 'filled' | 'cancelled' | 'open';
  createdAt: string;
}

export interface Trade {
  id: string;
  buyerId: string;
  sellerId: string;
  ipoId: string;
  price: number;
  quantity: number;
  timestamp: string;
  creatorSymbol?: string;
}

export interface Portfolio {
  userId: string;
  holdings: {
    ipoId: string;
    quantity: number;
    averagePurchasePrice: number;
    currentPrice?: number;
    creatorName?: string;
    creatorSymbol?: string;
    priceChange?: number;
  }[];
  totalValue: number;
  cash: number;
  invested: number;
  history?: {
    date: string;
    value: number;
  }[];
}

// Utility function to generate a delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Mock IPO data
export const mockIPOs: IPO[] = Array(20).fill(null).map((_, i) => {
  const creatorName = faker.person.firstName() + " " + faker.person.lastName();
  const initialPrice = parseFloat(faker.number.float({ min: 1, max: 50, fractionDigits: 2 }).toFixed(2));
  const currentPrice = parseFloat(faker.number.float({ min: initialPrice * 0.5, max: initialPrice * 2, fractionDigits: 2 }).toFixed(2));
  const priceChange = ((currentPrice - initialPrice) / initialPrice) * 100;
  const engagementScore = faker.number.int({ min: 20, max: 99 });
  const aiScore = faker.number.int({ min: 30, max: 95 });
  const revenueUSD = faker.number.int({ min: 100000, max: 10000000 });
  const totalShares = faker.number.int({ min: 1000000, max: 10000000 });

  const categories = ['entertainer', 'athlete', 'musician', 'content', 'influencer'];
  const category = categories[Math.floor(Math.random() * categories.length)];

  return {
    id: faker.string.uuid(),
    creatorName: creatorName,
    symbol: creatorName.substring(0, 3).toUpperCase(),
    initialPrice: initialPrice,
    currentPrice: currentPrice,
    priceChange: parseFloat(priceChange.toFixed(2)),
    totalSupply: faker.number.int({ min: 1000000, max: 10000000 }),
    availableSupply: faker.number.int({ min: 100000, max: 1000000 }),
    totalShares: totalShares,
    category: category,
    sentimentScore: faker.number.int({ min: 50, max: 95 }),
    launchDate: faker.date.past({ years: 1 }).toISOString(),
    revenueUSD: revenueUSD,
    engagementScore: engagementScore,
    engagementRate: parseFloat((Math.random() * 8 + 1).toFixed(1)),
    aiScore: aiScore,
    averageDailyVolume: faker.number.int({ min: 1000, max: 10000 }),
    volume24h: faker.number.int({ min: 10000, max: 500000 }),
    investorCount: faker.number.int({ min: 100, max: 2000 }),
    followerCount: faker.number.int({ min: 500000, max: 5000000 }),
    activeUserCount: faker.number.int({ min: 100000, max: 2000000 }),
    description: faker.lorem.paragraph(),
    totalRevenue: faker.number.int({ min: 500000, max: 5000000 }),
    yoyGrowth: parseFloat((Math.random() * 30 + 10).toFixed(1)),
    audienceGrowth: parseFloat((Math.random() * 25 + 5).toFixed(1)),
    contentGrowth: parseFloat((Math.random() * 40 + 10).toFixed(1)),
    platformExpansion: parseFloat((Math.random() * 20 + 5).toFixed(1)),
    projectedGrowth: parseFloat((Math.random() * 30 + 10).toFixed(1)),
    revenueStreams: {
      subscriptions: Math.random() > 0.3 ? faker.number.int({ min: 50000, max: 2000000 }) : 0,
      advertising: Math.random() > 0.3 ? faker.number.int({ min: 30000, max: 1500000 }) : 0,
      merchandise: Math.random() > 0.5 ? faker.number.int({ min: 20000, max: 500000 }) : 0,
      sponsorships: Math.random() > 0.4 ? faker.number.int({ min: 100000, max: 3000000 }) : 0
    },
    socialLinks: {
      twitter: `@${creatorName.replace(' ', '').toLowerCase()}`,
      instagram: `${creatorName.replace(' ', '').toLowerCase()}`,
      youtube: `channel/${creatorName.replace(' ', '').toLowerCase()}`,
      tiktok: `@${creatorName.replace(' ', '').toLowerCase()}`
    }
  };
});

// Mock orders
export const mockOrders: Order[] = Array(50).fill(null).map(() => {
  const price = parseFloat(faker.number.float({ min: 1, max: 100, fractionDigits: 2 }).toFixed(2));
  
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    ipoId: mockIPOs[Math.floor(Math.random() * mockIPOs.length)].id,
    price,
    quantity: faker.number.int({ min: 1, max: 1000 }),
    type: Math.random() > 0.5 ? 'buy' : 'sell',
    orderType: Math.random() > 0.5 ? 'market' : 'limit',
    status: Math.random() > 0.7 ? 'open' : (Math.random() > 0.5 ? 'filled' : 'cancelled'),
    createdAt: faker.date.recent().toISOString()
  };
});

// Mock trades
export const mockTrades: Trade[] = Array(100).fill(null).map(() => {
  const price = parseFloat(faker.number.float({ min: 1, max: 100, fractionDigits: 2 }).toFixed(2));
  const ipo = mockIPOs[Math.floor(Math.random() * mockIPOs.length)];
  
  return {
    id: faker.string.uuid(),
    buyerId: faker.string.uuid(),
    sellerId: faker.string.uuid(),
    ipoId: ipo.id,
    price,
    quantity: faker.number.int({ min: 1, max: 1000 }),
    timestamp: faker.date.recent().toISOString(),
    creatorSymbol: ipo.symbol
  };
});

// Mock API class implementations
export class MockIPOAPI {
  async getAllIPOs(): Promise<IPO[]> {
    await delay(500);
    return mockIPOs;
  }

  async getIPOById(id: string): Promise<IPO | undefined> {
    await delay(300);
    return mockIPOs.find(ipo => ipo.id === id);
  }

  async createIPO(ipoData: Partial<IPO>): Promise<IPO> {
    await delay(500);
    
    const newIPO: IPO = {
      id: faker.string.uuid(),
      creatorName: faker.person.fullName(),
      symbol: ipoData.symbol || faker.finance.currencyCode(),
      initialPrice: ipoData.initialPrice || 10,
      currentPrice: ipoData.initialPrice || 10,
      totalSupply: ipoData.totalSupply || 1000000,
      availableSupply: ipoData.availableSupply || 250000,
      launchDate: new Date().toISOString(),
      revenueUSD: faker.number.int({ min: 100000, max: 5000000 }),
      engagementScore: faker.number.int({ min: 50, max: 95 }),
      aiScore: faker.number.int({ min: 60, max: 90 }),
      averageDailyVolume: 0,
      description: ipoData.description || '',
      socialLinks: ipoData.socialLinks || {
        twitter: '',
        instagram: '',
        youtube: '',
        twitch: '',
        tiktok: ''
      },
      totalShares: ipoData.totalSupply || 1000000,
      priceChange: (Math.random() * 10) * (Math.random() > 0.5 ? 1 : -1),
      volume24h: Math.floor(Math.random() * 1000000),
      investorCount: Math.floor(Math.random() * 10000),
      followerCount: Math.floor(Math.random() * 1000000),
      activeUserCount: Math.floor(Math.random() * 500000),
      engagementRate: Math.floor(Math.random() * 100) / 10,
      sentimentScore: Math.floor(Math.random() * 100),
      revenueStreams: [],
      totalRevenue: Math.floor(Math.random() * 10000000),
      yoyGrowth: parseFloat((Math.random() * 30 + 10).toFixed(1)),
      audienceGrowth: parseFloat((Math.random() * 25 + 5).toFixed(1)),
      contentGrowth: parseFloat((Math.random() * 40 + 10).toFixed(1)),
      platformExpansion: parseFloat((Math.random() * 20 + 5).toFixed(1)),
      projectedGrowth: parseFloat((Math.random() * 30 + 10).toFixed(1)),
      category: ['Gaming', 'Education', 'Entertainment', 'Fitness', 'Finance'][Math.floor(Math.random() * 5)]
    };
    
    mockIPOs.push(newIPO);
    
    return newIPO;
  }

  async getRecentTrades(ipoId: string, limit: number = 10): Promise<any[]> {
    await delay(200);
    
    const ipo = mockIPOs.find(item => item.id === ipoId);
    if (!ipo) throw new Error(`IPO with id ${ipoId} not found`);
    
    const trades = Array(limit).fill(null).map(() => ({
      id: faker.string.uuid(),
      ipoId: ipoId,
      price: parseFloat(faker.number.float({ min: ipo.currentPrice * 0.9, max: ipo.currentPrice * 1.1, fractionDigits: 2 }).toFixed(2)),
      quantity: faker.number.int({ min: 10, max: 500 }),
      timestamp: faker.date.recent().toISOString(),
      buyerId: faker.string.uuid(),
      sellerId: faker.string.uuid(),
      creatorSymbol: ipo.symbol
    }));
    
    return trades;
  }
}

export class MockTradingAPI {
  async placeOrder(orderData: Partial<Order>): Promise<Order> {
    await delay(300);
    const newOrder: Order = {
      id: faker.string.uuid(),
      userId: orderData.userId || faker.string.uuid(),
      ipoId: orderData.ipoId || mockIPOs[0].id,
      price: orderData.price || 10,
      quantity: orderData.quantity || 1,
      type: orderData.type || 'buy',
      orderType: orderData.orderType || 'market',
      status: 'open',
      createdAt: new Date().toISOString()
    };
    
    mockOrders.push(newOrder);
    return newOrder;
  }

  async getUserOrders(): Promise<Order[]> {
    await delay(400);
    return mockOrders.slice(0, 10);
  }

  async getOrdersForIPO(ipoId: string): Promise<Order[]> {
    await delay(400);
    return mockOrders.filter(order => order.ipoId === ipoId);
  }

  async cancelOrder(orderId: string): Promise<Order> {
    await delay(300);
    const orderIndex = mockOrders.findIndex(order => order.id === orderId);
    if (orderIndex >= 0) {
      mockOrders[orderIndex].status = 'cancelled';
      return mockOrders[orderIndex];
    }
    throw new Error("Order not found");
  }

  async getUserTrades(): Promise<Trade[]> {
    await delay(400);
    return mockTrades.slice(0, 15);
  }

  async getTradesForIPO(ipoId: string, limit: number = 10): Promise<Trade[]> {
    await delay(300);
    const trades = mockTrades.filter(trade => trade.ipoId === ipoId);
    return trades.slice(0, limit);
  }

  async getOrderBook(ipoId: string): Promise<{ bids: Order[]; asks: Order[]; }> {
    await delay(400);
    const orders = mockOrders.filter(order => order.ipoId === ipoId && order.status === 'open');
    
    return {
      bids: orders.filter(order => order.type === 'buy').sort((a, b) => b.price - a.price),
      asks: orders.filter(order => order.type === 'sell').sort((a, b) => a.price - b.price)
    };
  }
}

export class MockPortfolioAPI {
  async getPortfolio(userId: string): Promise<Portfolio> {
    await delay(500);
    
    const holdings = Array(Math.floor(Math.random() * 10) + 1).fill(null).map(() => {
      const randomIPO = mockIPOs[Math.floor(Math.random() * mockIPOs.length)];
      const quantity = faker.number.int({ min: 10, max: 1000 });
      const averagePurchasePrice = parseFloat(faker.number.float({ 
        min: randomIPO.currentPrice * 0.7, 
        max: randomIPO.currentPrice * 1.3, 
        fractionDigits: 2
      }).toFixed(2));
      
      return {
        ipoId: randomIPO.id,
        quantity,
        averagePurchasePrice,
        currentPrice: randomIPO.currentPrice,
        creatorName: randomIPO.creatorName,
        creatorSymbol: randomIPO.symbol,
        priceChange: randomIPO.priceChange
      };
    });
    
    const totalValue = holdings.reduce((sum, holding) => {
      return sum + (holding.currentPrice * holding.quantity);
    }, 0);
    
    const cash = parseFloat(faker.number.float({ min: 1000, max: 100000, fractionDigits: 2 }).toFixed(2));
    const invested = parseFloat(faker.number.float({ min: totalValue * 0.7, max: totalValue * 0.9, fractionDigits: 2 }).toFixed(2));
    
    const history = Array(30).fill(null).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (30 - i));
      
      return {
        date: date.toISOString(),
        value: parseFloat(faker.number.float({ 
          min: totalValue * 0.8, 
          max: totalValue * 1.2, 
          fractionDigits: 2
        }).toFixed(2))
      };
    });
    
    history[history.length - 1].value = totalValue + cash;
    
    return {
      userId,
      holdings,
      totalValue,
      cash,
      invested,
      history
    };
  }
}

/**
 * Mock AI Valuation API
 * Simulates AI-driven analysis for creator valuations, market trends, and price predictions
 */

import { 
  AIModelType, 
  PredictionTimeframe, 
  PriceMovement, 
  SentimentTrend,
  MarketDepthModel,
  AnomalyDetectionResult,
  predictPriceMovement as predictPriceMovementUtil,
  getSocialSentiment as getSocialSentimentUtil,
  calculateMarketDepth as calculateMarketDepthUtil,
  detectAnomalies as detectAnomaliesUtil,
  calculateDividendYield as calculateDividendYieldUtil,
  getTokenVestingRules as getTokenVestingRulesUtil,
  getLiquidationRules as getLiquidationRulesUtil
} from "./mockAIModels";

class AIValuationAPI {
  async getValue(ipoId: string): Promise<number> {
    await delay(400);
    const ipo = mockIPOs.find(item => item.id === ipoId);
    if (!ipo) throw new Error(`IPO with id ${ipoId} not found`);
    return ipo.aiScore;
  }

  async predictPriceMovement(
    ipoId: string, 
    timeframe: PredictionTimeframe = "24h",
    modelType: AIModelType = AIModelType.STANDARD
  ): Promise<{
    prediction: PriceMovement;
    confidence: number;
    timestamp: string;
    modelUsed: AIModelType;
    targetPrice: number;
    factors: string[];
  }> {
    await delay(500);
    const ipo = mockIPOs.find(item => item.id === ipoId);
    if (!ipo) throw new Error(`IPO with id ${ipoId} not found`);

    const socialData = await this.getSocialSentiment(ipoId);

    return {
      prediction: {
        direction: socialData.overall.includes('positive') ? 'up' : 
                    socialData.overall.includes('negative') ? 'down' : 'neutral',
        percentage: Math.abs(Math.random() * 10).toFixed(2)
      },
      confidence: Math.floor(Math.random() * 30) + 65,
      timestamp: new Date().toISOString(),
      modelUsed: modelType,
      targetPrice: parseFloat((ipo.currentPrice * (1 + (Math.random() * 0.2 - 0.1))).toFixed(2)),
      factors: ['Market Trend', 'Social Sentiment', 'Recent Volume', 'Creator Activity']
    };
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

    const result = getSocialSentimentUtil(ipo);
    return result;
  }

  async getMarketDepth(ipoId: string): Promise<MarketDepthModel> {
    await delay(400);
    const ipo = mockIPOs.find(item => item.id === ipoId);
    if (!ipo) throw new Error(`IPO with id ${ipoId} not found`);

    return calculateMarketDepthUtil(ipo);
  }

  async detectAnomalies(ipoId: string, recentTrades: any[]): Promise<AnomalyDetectionResult> {
    await delay(600);
    const ipo = mockIPOs.find(item => item.id === ipoId);
    if (!ipo) throw new Error(`IPO with id ${ipoId} not found`);

    return detectAnomaliesUtil(ipo, recentTrades);
  }

  async getDividendInfo(ipoId: string): Promise<{
    annualYieldPercent: number;
    nextPayoutDate: string;
    nextEstimatedAmount: number;
    payoutFrequency: 'monthly' | 'quarterly';
    historicalPayouts?: { date: string; amount: number; }[];
  }> {
    await delay(400);
    const ipo = mockIPOs.find(item => item.id === ipoId);
    if (!ipo) throw new Error(`IPO with id ${ipoId} not found`);

    const dividendInfo = calculateDividendYieldUtil(ipo);
    
    const historicalPayouts = Array(5).fill(null).map((_, i) => ({
      date: faker.date.past({ years: 1 }).toISOString(),
      amount: parseFloat(faker.number.float({ min: 0.01, max: dividendInfo.nextEstimatedAmount, fractionDigits: 2 }).toFixed(2))
    }));

    return {
      ...dividendInfo,
      historicalPayouts
    };
  }

  async getVestingAndStakingRules(ipoId: string): Promise<{
    creatorVesting: {
      initialUnlock: number;
      vestingPeriod: number;
      monthlyUnlock: number;
    };
    investorStaking: {
      minStakingPeriod: number;
      earlyUnstakePenalty: number;
      stakingRewards: number;
    };
    tokenLockupSchedule?: { month: number; unlockPercentage: number; label: string; }[];
  }> {
    await delay(400);
    const ipo = mockIPOs.find(item => item.id === ipoId);
    if (!ipo) throw new Error(`IPO with id ${ipoId} not found`);

    return getTokenVestingRulesUtil(ipo);
  }

  async getLiquidationRules(ipoId: string): Promise<{
    inactivityThreshold: number;
    engagementMinimum: number;
    liquidationProcess: string;
    tokenBuybackPrice: number;
    warningThresholds?: { severe: number; moderate: number; mild: number; };
  }> {
    await delay(400);
    const ipo = mockIPOs.find(item => item.id === ipoId);
    if (!ipo) throw new Error(`IPO with id ${ipoId} not found`);

    return getLiquidationRulesUtil(ipo);
  }

  async getValuationFactors(ipoId: string): Promise<any> {
    await delay(400);
    const ipo = mockIPOs.find(item => item.id === ipoId);
    if (!ipo) throw new Error(`IPO with id ${ipoId} not found`);
    
    return {
      revenueFactors: [
        { name: 'Annual Revenue', impact: 35, value: `$${ipo.revenueUSD?.toLocaleString()}` },
        { name: 'Business Diversification', impact: 15, value: 'Multiple income streams' },
        { name: 'Revenue Growth', impact: 25, value: '+18% YoY' }
      ],
      socialFactors: [
        { name: 'Engagement Rate', impact: 30, value: `${ipo.engagementScore}%` },
        { name: 'Follower Growth', impact: 20, value: '+12% monthly' },
        { name: 'Content Consistency', impact: 15, value: 'High' }
      ],
      riskFactors: [
        { name: 'Platform Dependency', impact: -10, value: 'Moderate' },
        { name: 'Competitive Pressure', impact: -15, value: 'Medium' },
        { name: 'Audience Loyalty', impact: 25, value: 'Strong' }
      ]
    };
  }

  async getCreatorMarketScore(ipoId: string, externalMetrics?: any, socialSentiment?: any, anomalyData?: any): Promise<any> {
    const ipo = mockIPOs.find(item => item.id === ipoId);
    if (!ipo) throw new Error(`IPO with id ${ipoId} not found`);
    
    await delay(300 + Math.random() * 500);
    
    const revenueInfluenceFactor = Math.min(1, (ipo.revenueUSD || 50000) / 1000000);
    const revenueInfluenceRaw = revenueInfluenceFactor * 0.7 + Math.random() * 0.3;
    const revenueInfluenceScore = revenueInfluenceRaw * 100;
    
    const socialEngagementFactor = ipo.engagementScore / 100;
    const socialRaw = socialEngagementFactor * 0.8 + Math.random() * 0.2;
    const socialEngagementScore = socialRaw * 100;
    
    const sentimentMultiplier = socialSentiment ? 
      (socialSentiment.overall.includes('positive') ? 1.2 : 
       socialSentiment.overall.includes('negative') ? 0.7 : 1) : 1;
    
    const sentimentRaw = (ipo.aiScore / 100) * sentimentMultiplier;
    const aiSentimentScore = sentimentRaw * 100;
    
    const weightedRevenueInfluence = revenueInfluenceRaw * 0.5;
    const weightedSocialEngagement = socialRaw * 0.3;
    const weightedAISentiment = sentimentRaw * 0.2;
    
    const totalScore = (
      weightedRevenueInfluence + 
      weightedSocialEngagement + 
      weightedAISentiment
    ) * 100;
    
    const baseMultiplier = 0.5 + totalScore / 100;
    const recommendedPrice = parseFloat((ipo.initialPrice * baseMultiplier).toFixed(2));
    
    const priceChange = recommendedPrice - ipo.currentPrice;
    const priceChangePercent = (priceChange / ipo.currentPrice) * 100;
    
    const generateFactors = (type: string, score: number) => {
      const factors = [];
      
      if (type === 'revenue') {
        factors.push({
          name: 'Annual Revenue',
          impact: ipo.revenueUSD ? Math.min(40, (ipo.revenueUSD / 1000000) * 15) : 5,
          description: `Annual revenue of $${(ipo.revenueUSD || 0).toLocaleString()}`
        });
        
        factors.push({
          name: 'Business Diversification',
          impact: 5 + Math.random() * 15,
          description: 'Multiple revenue streams strengthen financial stability'
        });
        
        factors.push({
          name: 'Brand Deal Value',
          impact: 5 + Math.random() * 20,
          description: 'Recent sponsorships have increased in value'
        });
      } 
      else if (type === 'social') {
        factors.push({
          name: 'Engagement Rate',
          impact: (ipo.engagementScore / 10) + (Math.random() * 10),
          description: `${ipo.engagementScore}% engagement across platforms`
        });
        
        factors.push({
          name: 'Follower Growth',
          impact: 5 + Math.random() * 15,
          description: 'Strong upward trend in follower acquisition'
        });
        
        factors.push({
          name: 'Content Virality',
          impact: 3 + Math.random() * 17,
          description: 'Recent content has achieved viral status'
        });
      }
      else if (type === 'sentiment') {
        if (socialSentiment) {
          factors.push({
            name: 'Public Sentiment',
            impact: socialSentiment.overall.includes('positive') ? 15 + Math.random() * 15 : 
                    socialSentiment.overall.includes('negative') ? -20 + Math.random() * 10 : 5,
            description: `${socialSentiment.overall.replace('_', ' ')} public perception`
          });
        }
        
        factors.push({
          name: 'Media Coverage',
          impact: 5 + Math.random() * 10,
          description: 'Positive mentions in mainstream media'
        });
        
        factors.push({
          name: 'Controversy Risk',
          impact: -5 + Math.random() * 10,
          description: 'Low risk profile based on past behavior'
        });
      }
      
      return factors.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
    };
    
    return {
      totalScore: parseFloat(totalScore.toFixed(2)),
      revenueInfluence: {
        score: parseFloat(revenueInfluenceScore.toFixed(2)),
        weight: 0.5,
        rawScore: parseFloat(revenueInfluenceRaw.toFixed(2)),
        factors: generateFactors('revenue', revenueInfluenceScore)
      },
      socialEngagementInfluence: {
        score: parseFloat(socialEngagementScore.toFixed(2)),
        weight: 0.3,
        rawScore: parseFloat(socialRaw.toFixed(2)),
        factors: generateFactors('social', socialEngagementScore)
      },
      aiSentimentScore: {
        score: parseFloat(aiSentimentScore.toFixed(2)),
        weight: 0.2,
        rawScore: parseFloat(sentimentRaw.toFixed(2)),
        factors: generateFactors('sentiment', aiSentimentScore)
      },
      priceImpact: {
        recommendedPrice,
        priceChange: parseFloat(priceChange.toFixed(2)),
        priceChangePercent: parseFloat(priceChangePercent.toFixed(2)),
        confidence: 70 + Math.floor(Math.random() * 25)
      },
      anomalyDetection: {
        hasAnomalies: anomalyData?.detected || false,
        anomalyImpact: 0
      },
      lastUpdated: new Date().toISOString()
    };
  }

  async getSentimentAnalysis(ipoId: string): Promise<any> {
    await delay(300 + Math.random() * 200);
    
    const socialData = await this.getSocialSentiment(ipoId);
    
    return {
      overallSentiment: Math.round((
        (socialData.metrics.twitter.score + 
        socialData.metrics.instagram.score + 
        socialData.metrics.youtube.score) / 3) * 100),
      positiveMentions: 12458 + Math.floor(Math.random() * 1000),
      negativeMentions: 3241 + Math.floor(Math.random() * 500),
      keywords: socialData.keywords,
      lastUpdated: new Date().toISOString()
    };
  }
}

// Export the mock API instances
export const mockIPOAPI = new MockIPOAPI();
export const mockTradingAPI = new MockTradingAPI();
export const mockPortfolioAPI = new MockPortfolioAPI();
export const mockAIValuationAPI = new AIValuationAPI();
