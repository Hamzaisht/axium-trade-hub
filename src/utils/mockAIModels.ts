/**
 * Mock AI Models
 * Simulates AI-driven analysis for creator valuations, market trends, and price predictions
 */

import { IPO } from "./mockApi";

// Valuation models influenced by different factors
export enum AIModelType {
  ENGAGEMENT = "engagement",
  SENTIMENT = "sentiment",
  GROWTH = "growth",
  CONSISTENCY = "consistency",
  HYBRID = "hybrid",
  REVENUE_WEIGHTED = "revenue_weighted",  // New model type focusing on revenue metrics
  SOCIAL_WEIGHTED = "social_weighted",     // New model type focusing on social metrics
  STANDARD = "standard"  // Add standard type to match existing code
}

// Sentiment trends - represents market sentiment towards a creator
export type SentimentTrend = "positive" | "neutral" | "negative" | "very_positive" | "very_negative";

// Price movement predictions
export type PriceMovement = {
  direction: 'up' | 'down' | 'neutral';
  percentage: number;
};

// Timeframes for predictions
export type PredictionTimeframe = "24h" | "7d" | "30d" | "90d" | "short_term"; // Add short_term to match existing code

// Market depth model - simulates the order book depth
export interface MarketDepthModel {
  // How concentrated buy/sell orders are around the current price (0-1)
  orderConcentration: number;
  // Buy wall strength (0-1)
  buyWallStrength: number;
  // Sell wall strength (0-1)
  sellWallStrength: number;
  // Price levels where significant buy support exists
  supportLevels: number[];
  // Price levels where significant sell resistance exists
  resistanceLevels: number[];
  // Current spread
  currentSpread: { bid: number, ask: number };
}

// Anomaly types for detecting unusual patterns
export enum AnomalyType {
  WASH_TRADING = "wash_trading",
  PUMP_AND_DUMP = "pump_and_dump",
  SPOOFING = "spoofing",
  UNUSUAL_VOLUME = "unusual_volume",
  RAPID_PRICE_CHANGE = "rapid_price_change",
  CIRCULAR_TRADING = "circular_trading"
}

// Anomaly detection result
export interface AnomalyDetectionResult {
  detected: boolean;
  anomalies: {
    type: AnomalyType;
    confidence: number;
    severity: number; // 1-10 scale
    description: string;
    affectedMetrics: string[];
    timestamp: string;
  }[];
  riskScore: number; // 0-100
  recommendations: string[];
}

// Function to calculate market depth model for an IPO
export const calculateMarketDepth = (ipo: IPO): MarketDepthModel => {
  // Calculate support levels (10-30% below current price)
  const supportBase = ipo.currentPrice * 0.7;
  const supportRange = ipo.currentPrice * 0.2;
  const supportLevels = [
    parseFloat((supportBase + supportRange * Math.random()).toFixed(2)),
    parseFloat((supportBase + supportRange * Math.random() * 0.7).toFixed(2)),
    parseFloat((supportBase + supportRange * Math.random() * 0.4).toFixed(2))
  ].sort((a, b) => a - b);

  // Calculate resistance levels (10-40% above current price)
  const resistanceBase = ipo.currentPrice * 1.1;
  const resistanceRange = ipo.currentPrice * 0.3;
  const resistanceLevels = [
    parseFloat((resistanceBase + resistanceRange * Math.random()).toFixed(2)),
    parseFloat((resistanceBase + resistanceRange * Math.random() * 0.7).toFixed(2)),
    parseFloat((resistanceBase + resistanceRange * Math.random() * 0.5).toFixed(2))
  ].sort((a, b) => a - b);

  // Calculate model parameters influenced by engagement and AI scores
  const orderConcentration = 0.3 + (ipo.engagementScore / 200); // Higher engagement = tighter spread
  const buyWallStrength = 0.2 + (ipo.aiScore / 150) + (Math.random() * 0.3); // Higher AI score = stronger buy walls
  const sellWallStrength = 0.1 + ((100 - ipo.engagementScore) / 200) + (Math.random() * 0.3); // Lower engagement = stronger sell walls

  // Calculate spread
  const spreadResult = calculateSpread(ipo);

  return {
    orderConcentration: parseFloat(orderConcentration.toFixed(2)),
    buyWallStrength: parseFloat(buyWallStrength.toFixed(2)),
    sellWallStrength: parseFloat(sellWallStrength.toFixed(2)),
    supportLevels,
    resistanceLevels,
    currentSpread: spreadResult
  };
};

// Calculate spread based on market depth and trading activity
export const calculateSpread = (ipo: IPO): { bid: number, ask: number } => {
  // Improved spread calculation that takes engagement score into account
  // Higher engagement scores tend to have more liquidity and tighter spreads
  const engagementFactor = Math.max(0.5, Math.min(1.5, (100 - ipo.engagementScore) / 50));
  
  // Base spread percentage (improved algorithm with revenue consideration)
  const baseSpreadPercentage = 0.01 * engagementFactor;
  
  // Apply revenue-based adjustments
  // Higher revenue = tighter spreads
  const revenueAdjustment = ipo.revenueUSD ? Math.max(0.5, Math.min(1.0, 100000 / ipo.revenueUSD)) : 1.0;
  
  // Calculate final spread percentage with randomness
  const spreadPercentage = baseSpreadPercentage * revenueAdjustment * (0.9 + Math.random() * 0.2);
  
  // Calculate bid and ask prices
  const spreadAmount = ipo.currentPrice * spreadPercentage;
  const bid = parseFloat((ipo.currentPrice - spreadAmount).toFixed(2));
  const ask = parseFloat((ipo.currentPrice + spreadAmount).toFixed(2));
  
  return { bid, ask };
};

// Predict price movement for a creator based on their metrics
export const predictPriceMovement = (
  ipo: IPO, 
  timeframe: PredictionTimeframe = "24h",
  modelType: AIModelType = AIModelType.HYBRID
): {
  prediction: PriceMovement;
  confidence: number;
  targetPrice: number;
  factors: string[];
} => {
  // Enhanced list of factors that influence the prediction
  const baseFactors = [
    'Recent social media engagement trends',
    'Market sentiment analysis',
    'Trading volume patterns',
    'Similar creators performance correlation',
    'Historical price support/resistance levels',
    'Brand partnership announcements',
    'Content release schedule',
    'Fan growth rate',
    'Revenue growth trajectory',
    'Platform algorithm changes',
    'Competitor creator performance',
    'Seasonal engagement patterns',
    'New content format adoption',
    'Creator collaboration network',
    'Merchandise sales velocity',
    'Live event attendance',
    'Subscription retention rates',
    'Viral content probability'
  ];
  
  // Random selection of factors that influenced this prediction
  const selectedFactors = baseFactors
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 3) + 2);
  
  // Calculate a base prediction score (-1 to 1 scale)
  let predictionScore = 0;
  
  // Different models emphasize different creator attributes with improved weighting
  switch (modelType) {
    case AIModelType.ENGAGEMENT:
      // Heavily influenced by engagement score
      predictionScore = ((ipo.engagementScore - 50) / 50) * 0.8 + (Math.random() * 0.4 - 0.2);
      break;
      
    case AIModelType.SENTIMENT:
      // More random, simulating social sentiment which can be volatile
      predictionScore = ((ipo.aiScore - 50) / 50) * 0.5 + (Math.random() * 0.8 - 0.4);
      break;
      
    case AIModelType.GROWTH:
      // Based on growth potential indicated by AI score
      predictionScore = ((ipo.aiScore - 70) / 30) * 0.7 + (Math.random() * 0.4 - 0.2);
      break;
      
    case AIModelType.CONSISTENCY:
      // More stable predictions, less extreme
      predictionScore = ((ipo.engagementScore + ipo.aiScore - 100) / 100) * 0.4 + (Math.random() * 0.2 - 0.1);
      break;
      
    case AIModelType.REVENUE_WEIGHTED:
      // Heavily weighted towards revenue metrics
      const revenueScore = ipo.revenueUSD ? Math.min(1, ipo.revenueUSD / 1000000) : 0.5;
      predictionScore = (
        (revenueScore * 0.7) + 
        ((ipo.engagementScore - 50) / 50) * 0.2 + 
        (Math.random() * 0.2 - 0.1)
      );
      break;
      
    case AIModelType.SOCIAL_WEIGHTED:
      // Heavily weighted towards social engagement metrics
      predictionScore = (
        ((ipo.engagementScore - 40) / 60) * 0.8 + 
        ((ipo.aiScore - 50) / 50) * 0.1 + 
        (Math.random() * 0.2 - 0.1)
      );
      break;
      
    case AIModelType.HYBRID:
    default:
      // Balanced approach using all factors with improved weighting
      // Revenue gets higher weight for established creators, engagement for newer ones
      const isEstablished = ipo.launchDate ? (new Date().getTime() - new Date(ipo.launchDate).getTime()) > 1000 * 60 * 60 * 24 * 90 : false;
      
      if (isEstablished) {
        // For established creators, revenue and consistency matter more
        const revenueScore = ipo.revenueUSD ? Math.min(1, ipo.revenueUSD / 1000000) : 0.5;
        predictionScore = (
          (revenueScore * 0.4) + 
          ((ipo.engagementScore - 50) / 50) * 0.3 + 
          ((ipo.aiScore - 50) / 50) * 0.2 + 
          (Math.random() * 0.2 - 0.1)
        );
      } else {
        // For newer creators, engagement and growth potential matter more
        predictionScore = (
          ((ipo.engagementScore - 40) / 60) * 0.5 + 
          ((ipo.aiScore - 50) / 50) * 0.3 + 
          (Math.random() * 0.4 - 0.2)
        );
      }
      break;
  }
  
  // Adjust for timeframe - longer timeframes have more potential for larger moves
  let timeframeMultiplier = 1;
  switch (timeframe) {
    case "24h": timeframeMultiplier = 1; break;
    case "7d": timeframeMultiplier = 1.5; break;
    case "30d": timeframeMultiplier = 2.2; break;
    case "90d": timeframeMultiplier = 3; break;
    default: timeframeMultiplier = 1;
  }
  
  predictionScore = predictionScore * timeframeMultiplier;
  
  // Determine prediction category based on score
  let prediction: PriceMovement;
  if (predictionScore > 0.8) prediction = { direction: "up", percentage: 0.15 + (Math.random() * 0.25) };
  else if (predictionScore > 0.3) prediction = { direction: "up", percentage: 0.05 + (Math.random() * 0.1) };
  else if (predictionScore < -0.8) prediction = { direction: "down", percentage: -0.15 - (Math.random() * 0.2) };
  else if (predictionScore < -0.3) prediction = { direction: "down", percentage: -0.03 - (Math.random() * 0.07) };
  else if (Math.abs(predictionScore) < 0.15) prediction = { direction: "neutral", percentage: -0.02 + (Math.random() * 0.04) };
  else prediction = { direction: "neutral", percentage: -0.07 + (Math.random() * 0.14) };
  
  // Calculate target price based on prediction with improved precision
  let priceChangePercent = 0;
  switch (prediction.direction) {
    case "up": priceChangePercent = 0.05 + (Math.random() * 0.1); break;
    case "down": priceChangePercent = -0.03 - (Math.random() * 0.07); break;
    case "neutral": priceChangePercent = -0.02 + (Math.random() * 0.04); break;
  }
  
  // Apply timeframe multiplier to price change percent
  priceChangePercent = priceChangePercent * timeframeMultiplier;
  
  const targetPrice = parseFloat((ipo.currentPrice * (1 + priceChangePercent)).toFixed(2));
  
  // Calculate confidence level (50-95%)
  // Higher confidence for revenue-based models for established creators
  let confidenceBoost = 0;
  if (modelType === AIModelType.REVENUE_WEIGHTED && ipo.revenueUSD && ipo.revenueUSD > 500000) {
    confidenceBoost = 10;
  }
  
  const confidence = Math.min(95, 50 + Math.floor(Math.abs(predictionScore) * 50) + confidenceBoost);
  
  return {
    prediction,
    confidence,
    targetPrice,
    factors: selectedFactors
  };
};

// Get simulated social sentiment metrics for a creator
export const getSocialSentiment = (ipo: IPO): {
  overall: SentimentTrend;
  metrics: {
    twitter: { score: number; trend: SentimentTrend; volume: number };
    instagram: { score: number; trend: SentimentTrend; volume: number };
    youtube: { score: number; trend: SentimentTrend; volume: number };
  };
  keywords: string[];
} => {
  // Base sentiment is influenced by engagement score
  const baseSentiment = (ipo.engagementScore - 50) / 50;
  
  // Generate platform-specific metrics with some randomness
  const twitterScore = Math.min(1, Math.max(-1, baseSentiment + (Math.random() * 0.6 - 0.3)));
  const instagramScore = Math.min(1, Math.max(-1, baseSentiment + (Math.random() * 0.6 - 0.3)));
  const youtubeScore = Math.min(1, Math.max(-1, baseSentiment + (Math.random() * 0.6 - 0.3)));
  
  // Convert scores to trend categories
  const scoreToTrend = (score: number): SentimentTrend => {
    if (score > 0.6) return "very_positive";
    if (score > 0.2) return "positive";
    if (score < -0.6) return "very_negative";
    if (score < -0.2) return "negative";
    return "neutral";
  };
  
  // Calculate overall trend (weighted average)
  const overallScore = (twitterScore * 0.35) + (instagramScore * 0.4) + (youtubeScore * 0.25);
  const overallTrend = scoreToTrend(overallScore);
  
  // Generate random engagement volumes
  const twitterVolume = Math.floor(10000 + Math.random() * 990000);
  const instagramVolume = Math.floor(20000 + Math.random() * 1980000);
  const youtubeVolume = Math.floor(5000 + Math.random() * 495000);
  
  // Generate trending keywords
  const positiveKeywords = ['viral', 'trending', 'collaboration', 'launch', 'exclusive', 'partnership'];
  const neutralKeywords = ['announcement', 'update', 'content', 'release', 'feature', 'interview'];
  const negativeKeywords = ['controversy', 'delay', 'criticism', 'issue', 'problem', 'cancel'];
  
  let keywordPool = [...neutralKeywords];
  if (overallScore > 0.3) {
    keywordPool = [...keywordPool, ...positiveKeywords];
  } else if (overallScore < -0.3) {
    keywordPool = [...keywordPool, ...negativeKeywords];
  }
  
  const keywords = keywordPool
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 3) + 3);
  
  return {
    overall: overallTrend,
    metrics: {
      twitter: {
        score: parseFloat(twitterScore.toFixed(2)),
        trend: scoreToTrend(twitterScore),
        volume: twitterVolume
      },
      instagram: {
        score: parseFloat(instagramScore.toFixed(2)),
        trend: scoreToTrend(instagramScore),
        volume: instagramVolume
      },
      youtube: {
        score: parseFloat(youtubeScore.toFixed(2)),
        trend: scoreToTrend(youtubeScore),
        volume: youtubeVolume
      }
    },
    keywords
  };
};

// New function to detect trading anomalies
export const detectAnomalies = (ipo: IPO, recentTrades: any[] = []): AnomalyDetectionResult => {
  const anomalies = [];
  let riskScore = 0;
  
  // We need a minimum number of trades to detect patterns
  if (recentTrades.length < 3) {
    return {
      detected: false,
      anomalies: [],
      riskScore: 0,
      recommendations: ["Insufficient trading data for analysis"]
    };
  }
  
  // 1. Check for unusual volume
  const averageVolume = ipo.averageDailyVolume || 5000;
  const recentVolume = recentTrades.reduce((sum, trade) => sum + trade.quantity, 0);
  const volumeRatio = recentVolume / averageVolume;
  
  if (volumeRatio > 3) {
    const severity = Math.min(10, Math.floor(volumeRatio * 1.5));
    anomalies.push({
      type: AnomalyType.UNUSUAL_VOLUME,
      confidence: Math.min(95, 60 + Math.floor(volumeRatio * 5)),
      severity,
      description: `Trading volume is ${volumeRatio.toFixed(1)}x higher than average`,
      affectedMetrics: ['volume', 'liquidity', 'volatility'],
      timestamp: new Date().toISOString()
    });
    riskScore += severity * 5;
  }
  
  // 2. Check for rapid price changes
  if (recentTrades.length >= 5) {
    const prices = recentTrades.map(t => t.price);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const priceRange = (maxPrice - minPrice) / minPrice;
    
    if (priceRange > 0.05) { // 5% price swing in recent trades
      const severity = Math.min(10, Math.floor(priceRange * 100));
      anomalies.push({
        type: AnomalyType.RAPID_PRICE_CHANGE,
        confidence: Math.min(90, 50 + Math.floor(priceRange * 500)),
        severity,
        description: `Price fluctuated by ${(priceRange * 100).toFixed(1)}% in a short time period`,
        affectedMetrics: ['price', 'volatility', 'investor sentiment'],
        timestamp: new Date().toISOString()
      });
      riskScore += severity * 6;
    }
  }
  
  // 3. Check for wash trading (same buyer and seller)
  const traderMap = new Map();
  recentTrades.forEach(trade => {
    const key = `${trade.buyerId}-${trade.sellerId}`;
    traderMap.set(key, (traderMap.get(key) || 0) + 1);
  });
  
  let potentialWashTrades = 0;
  traderMap.forEach((count, key) => {
    if (count >= 3) { // Multiple trades between same parties
      potentialWashTrades += count;
    }
  });
  
  if (potentialWashTrades > 0) {
    const washTradeRatio = potentialWashTrades / recentTrades.length;
    if (washTradeRatio > 0.2) { // If more than 20% look suspicious
      const severity = Math.min(10, Math.floor(washTradeRatio * 10) + 5);
      anomalies.push({
        type: AnomalyType.WASH_TRADING,
        confidence: Math.min(85, 50 + Math.floor(washTradeRatio * 150)),
        severity,
        description: `Possible wash trading detected (${(washTradeRatio * 100).toFixed(0)}% of recent trades)`,
        affectedMetrics: ['volume', 'price discovery', 'market integrity'],
        timestamp: new Date().toISOString()
      });
      riskScore += severity * 8;
    }
  }
  
  // 4. Check for circular trading patterns
  const tradingGraph = new Map();
  recentTrades.forEach(trade => {
    if (!tradingGraph.has(trade.buyerId)) {
      tradingGraph.set(trade.buyerId, new Set());
    }
    tradingGraph.get(trade.buyerId).add(trade.sellerId);
  });
  
  let circularPaths = 0;
  tradingGraph.forEach((sellers, buyer) => {
    sellers.forEach(seller => {
      if (tradingGraph.has(seller) && tradingGraph.get(seller).has(buyer)) {
        circularPaths++;
      }
    });
  });
  
  if (circularPaths > 0) {
    const severity = Math.min(10, 5 + circularPaths);
    anomalies.push({
      type: AnomalyType.CIRCULAR_TRADING,
      confidence: Math.min(80, 40 + (circularPaths * 10)),
      severity,
      description: `Circular trading pattern detected between multiple parties`,
      affectedMetrics: ['price', 'volume', 'market manipulation risk'],
      timestamp: new Date().toISOString()
    });
    riskScore += severity * 7;
  }
  
  // Generate recommendations based on detected anomalies
  const recommendations: string[] = [];
  
  if (riskScore > 50) {
    recommendations.push("Consider temporarily halting trading while investigating market manipulation");
  }
  
  if (anomalies.some(a => a.type === AnomalyType.UNUSUAL_VOLUME)) {
    recommendations.push("Monitor for sudden influx of new investors or coordinated trading activity");
  }
  
  if (anomalies.some(a => a.type === AnomalyType.WASH_TRADING || a.type === AnomalyType.CIRCULAR_TRADING)) {
    recommendations.push("Review transaction history to identify potential manipulative trading patterns");
  }
  
  if (anomalies.some(a => a.type === AnomalyType.RAPID_PRICE_CHANGE)) {
    recommendations.push("Implement circuit breakers to prevent extreme price volatility");
  }
  
  if (recommendations.length === 0 && anomalies.length > 0) {
    recommendations.push("Continue monitoring trading patterns for further anomalies");
  }
  
  return {
    detected: anomalies.length > 0,
    anomalies,
    riskScore: Math.min(100, riskScore),
    recommendations: recommendations.length > 0 ? recommendations : ["No action recommended at this time"]
  };
};

// Simulate dividends based on creator performance
export const calculateDividendYield = (ipo: IPO): {
  annualYieldPercent: number;
  nextPayoutDate: string;
  nextEstimatedAmount: number;
  payoutFrequency: 'monthly' | 'quarterly';
} => {
  // Better performing creators offer higher dividends
  const baseYield = (ipo.aiScore / 200) * 5; // 0-2.5% base yield
  const engagementBonus = (ipo.engagementScore / 200) * 3; // 0-1.5% engagement bonus
  const totalYield = baseYield + engagementBonus;
  
  // Random next payout date (within next 30 days)
  const nextPayoutDate = new Date();
  nextPayoutDate.setDate(nextPayoutDate.getDate() + Math.floor(Math.random() * 30) + 1);
  
  // Determine payout frequency (higher rated creators pay more frequently)
  const payoutFrequency = (ipo.aiScore + ipo.engagementScore) / 2 > 80 ? 'monthly' : 'quarterly';
  
  // Calculate next estimated amount
  const tokensInCirculation = ipo.totalSupply - ipo.availableSupply;
  const annualDividendPool = (ipo.initialPrice * tokensInCirculation) * (totalYield / 100);
  const nextEstimatedAmount = payoutFrequency === 'monthly' 
    ? annualDividendPool / 12 
    : annualDividendPool / 4;
  
  return {
    annualYieldPercent: parseFloat(totalYield.toFixed(2)),
    nextPayoutDate: nextPayoutDate.toISOString(),
    nextEstimatedAmount: parseFloat((nextEstimatedAmount / 1000000).toFixed(2)), // in millions
    payoutFrequency
  };
};

// Simulate vesting and staking rules
export const getTokenVestingRules = (ipo: IPO): {
  creatorVesting: {
    initialUnlock: number; // percentage
    vestingPeriod: number; // months
    monthlyUnlock: number; // percentage
  };
  investorStaking: {
    minStakingPeriod: number; // days
    earlyUnstakePenalty: number; // percentage
    stakingRewards: number; // annual percentage
  };
} => {
  return {
    creatorVesting: {
      initialUnlock: 20, // 20% unlocked at launch
      vestingPeriod: 24, // 24 month total vesting
      monthlyUnlock: 3.33 // approximately 3.33% unlocked each month
    },
    investorStaking: {
      minStakingPeriod: 30, // 30 days minimum staking period
      earlyUnstakePenalty: 10, // 10% penalty for early unstaking
      stakingRewards: parseFloat((3 + (ipo.aiScore / 20)).toFixed(2)) // 3-8% annual rewards
    }
  };
};

// Liquidation conditions if a creator becomes inactive
export const getLiquidationRules = (ipo: IPO): {
  inactivityThreshold: number; // days
  engagementMinimum: number; // minimum engagement score
  liquidationProcess: string; // explanation
  tokenBuybackPrice: number; // price
} => {
  return {
    inactivityThreshold: 180, // 6 months of inactivity
    engagementMinimum: 20, // engagement score cannot fall below 20
    liquidationProcess: "If creator becomes inactive or engagement falls below minimum threshold, tokens enter a 30-day grace period. If no recovery, smart contract initiates token buyback at specified price.",
    tokenBuybackPrice: parseFloat((ipo.initialPrice * 0.5).toFixed(2)) // 50% of initial price
  };
};
