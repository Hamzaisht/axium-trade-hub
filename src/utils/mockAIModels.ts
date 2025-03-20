
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
  HYBRID = "hybrid"
}

// Sentiment trends - represents market sentiment towards a creator
export type SentimentTrend = "positive" | "neutral" | "negative" | "very_positive" | "very_negative";

// Price movement predictions
export type PriceMovement = "up" | "strong_up" | "down" | "strong_down" | "stable" | "volatile";

// Timeframes for predictions
export type PredictionTimeframe = "24h" | "7d" | "30d" | "90d";

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

  return {
    orderConcentration: parseFloat(orderConcentration.toFixed(2)),
    buyWallStrength: parseFloat(buyWallStrength.toFixed(2)),
    sellWallStrength: parseFloat(sellWallStrength.toFixed(2)),
    supportLevels,
    resistanceLevels
  };
};

// Calculate spread based on market depth and trading activity
export const calculateSpread = (ipo: IPO): { bid: number, ask: number } => {
  const depth = calculateMarketDepth(ipo);
  
  // Tighter spreads for higher engagement scores and more concentrated orders
  const spreadPercentage = 0.01 * (1 - (depth.orderConcentration * 0.5));
  
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
  // Base factors that influence the prediction
  const baseFactors = [
    'Recent social media engagement trends',
    'Market sentiment analysis',
    'Trading volume patterns',
    'Similar creators performance correlation',
    'Historical price support/resistance levels',
    'Brand partnership announcements',
    'Content release schedule',
    'Fan growth rate'
  ];
  
  // Random selection of factors that influenced this prediction
  const selectedFactors = baseFactors
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 3) + 2);
  
  // Calculate a base prediction score (-1 to 1 scale)
  let predictionScore = 0;
  
  // Different models emphasize different creator attributes
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
      
    case AIModelType.HYBRID:
    default:
      // Balanced approach using all factors
      predictionScore = (
        ((ipo.engagementScore - 50) / 50) * 0.4 + 
        ((ipo.aiScore - 50) / 50) * 0.4 + 
        (Math.random() * 0.4 - 0.2)
      );
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
  if (predictionScore > 0.8) prediction = "strong_up";
  else if (predictionScore > 0.3) prediction = "up";
  else if (predictionScore < -0.8) prediction = "strong_down";
  else if (predictionScore < -0.3) prediction = "down";
  else if (Math.abs(predictionScore) < 0.15) prediction = "stable";
  else prediction = "volatile";
  
  // Calculate target price based on prediction
  let priceChangePercent = 0;
  switch (prediction) {
    case "strong_up": priceChangePercent = 0.15 + (Math.random() * 0.25); break;
    case "up": priceChangePercent = 0.05 + (Math.random() * 0.1); break;
    case "strong_down": priceChangePercent = -0.15 - (Math.random() * 0.2); break;
    case "down": priceChangePercent = -0.03 - (Math.random() * 0.07); break;
    case "stable": priceChangePercent = -0.02 + (Math.random() * 0.04); break;
    case "volatile": priceChangePercent = -0.07 + (Math.random() * 0.14); break;
    default: priceChangePercent = 0;
  }
  
  // Apply timeframe multiplier to price change percent
  priceChangePercent = priceChangePercent * timeframeMultiplier;
  
  const targetPrice = parseFloat((ipo.currentPrice * (1 + priceChangePercent)).toFixed(2));
  
  // Calculate confidence level (50-95%)
  const confidence = Math.min(95, 50 + Math.floor(Math.abs(predictionScore) * 50));
  
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
  }
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
    }
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
