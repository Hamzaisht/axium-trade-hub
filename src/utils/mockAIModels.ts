
import { faker } from '@faker-js/faker';
import { IPO } from './mockApi';

// Define AI model types
export enum AIModelType {
  TECHNICAL = 'technical',
  FUNDAMENTAL = 'fundamental',
  SOCIAL = 'social',
  HYBRID = 'hybrid'
}

// Define prediction timeframes
export type PredictionTimeframe = '1h' | '24h' | '7d' | '30d' | '90d';

// Mock price prediction function
export const predictPriceMovement = (
  ipo: IPO, 
  timeframe: PredictionTimeframe = "24h",
  modelType: AIModelType = AIModelType.HYBRID
) => {
  const baseVolatility = {
    '1h': 0.5,
    '24h': 2,
    '7d': 5,
    '30d': 10,
    '90d': 20
  }[timeframe];
  
  // Adjust volatility based on model type
  let volatilityMultiplier = 1.0;
  switch (modelType) {
    case AIModelType.TECHNICAL:
      volatilityMultiplier = 1.2;
      break;
    case AIModelType.FUNDAMENTAL:
      volatilityMultiplier = 0.8;
      break;
    case AIModelType.SOCIAL:
      volatilityMultiplier = 1.5;
      break;
    case AIModelType.HYBRID:
    default:
      volatilityMultiplier = 1.0;
  }
  
  const volatility = baseVolatility * volatilityMultiplier;
  
  // Generate prediction
  const uptrend = faker.datatype.boolean();
  const changePercent = faker.number.float({
    min: uptrend ? 0 : -volatility,
    max: uptrend ? volatility : 0,
    fractionDigits: 2
  });
  
  // Higher confidence for shorter timeframes
  const confidenceMultiplier = {
    '1h': 0.85,
    '24h': 0.75,
    '7d': 0.65,
    '30d': 0.5,
    '90d': 0.35
  }[timeframe];
  
  // Adjust confidence based on model
  let confidenceBase = 0;
  switch (modelType) {
    case AIModelType.TECHNICAL:
      confidenceBase = faker.number.int({ min: 65, max: 90 });
      break;
    case AIModelType.FUNDAMENTAL:
      confidenceBase = faker.number.int({ min: 70, max: 85 });
      break;
    case AIModelType.SOCIAL:
      confidenceBase = faker.number.int({ min: 50, max: 95 });
      break;
    case AIModelType.HYBRID:
    default:
      confidenceBase = faker.number.int({ min: 60, max: 90 });
  }
  
  const confidence = confidenceBase * confidenceMultiplier;
  
  // Calculate predicted price
  const currentPrice = ipo.currentPrice;
  const predictedPrice = currentPrice * (1 + changePercent / 100);
  
  // Generate prediction factors
  const factors = [];
  if (modelType === AIModelType.HYBRID || modelType === AIModelType.TECHNICAL) {
    factors.push({
      name: 'Technical Analysis',
      impact: faker.number.float({ min: -5, max: 5, fractionDigits: 1 }),
      description: uptrend ? 'Bullish chart patterns forming' : 'Bearish trend indicators'
    });
  }
  
  if (modelType === AIModelType.HYBRID || modelType === AIModelType.FUNDAMENTAL) {
    factors.push({
      name: 'Revenue Forecast',
      impact: faker.number.float({ min: -5, max: 5, fractionDigits: 1 }),
      description: faker.helpers.arrayElement([
        'Strong growth in merchandise sales',
        'Increasing sponsored content deals',
        'Expanding into new revenue streams',
        'Declining ad revenue on main platform'
      ])
    });
  }
  
  if (modelType === AIModelType.HYBRID || modelType === AIModelType.SOCIAL) {
    factors.push({
      name: 'Social Sentiment',
      impact: faker.number.float({ min: -5, max: 5, fractionDigits: 1 }),
      description: faker.helpers.arrayElement([
        'Growing positive engagement',
        'Recent viral content',
        'Controversy affecting perception',
        'Steady engagement metrics'
      ])
    });
    
    factors.push({
      name: 'Platform Algorithm Changes',
      impact: faker.number.float({ min: -3, max: 3, fractionDigits: 1 }),
      description: faker.helpers.arrayElement([
        'Favorable algorithm changes on key platform',
        'Recent platform policy updates impacting reach',
        'New monetization options available'
      ])
    });
  }
  
  return {
    currentPrice,
    predictedPrice,
    changePercent,
    timeframe,
    confidence,
    modelType,
    factors,
    timestamp: new Date().toISOString()
  };
};

// Market depth analysis function
export const calculateMarketDepth = (ipo: IPO) => {
  // Generate buy orders (bids)
  const bidCount = faker.number.int({ min: 5, max: 15 });
  const bids = Array.from({ length: bidCount }, (_, i) => {
    const priceDecrement = i * faker.number.float({ min: 0.1, max: 0.5 });
    return {
      price: Number((ipo.currentPrice - priceDecrement).toFixed(2)),
      quantity: faker.number.int({ min: 10, max: 1000 }),
      total: 0 // Will be calculated below
    };
  }).sort((a, b) => b.price - a.price); // Sort by price descending
  
  // Generate sell orders (asks)
  const askCount = faker.number.int({ min: 5, max: 15 });
  const asks = Array.from({ length: askCount }, (_, i) => {
    const priceIncrement = i * faker.number.float({ min: 0.1, max: 0.5 });
    return {
      price: Number((ipo.currentPrice + priceIncrement).toFixed(2)),
      quantity: faker.number.int({ min: 10, max: 1000 }),
      total: 0 // Will be calculated below
    };
  }).sort((a, b) => a.price - b.price); // Sort by price ascending
  
  // Calculate total value for each level
  bids.forEach(bid => {
    bid.total = bid.price * bid.quantity;
  });
  
  asks.forEach(ask => {
    ask.total = ask.price * ask.quantity;
  });
  
  // Calculate market depth metrics
  const totalBidVolume = bids.reduce((sum, bid) => sum + bid.quantity, 0);
  const totalAskVolume = asks.reduce((sum, ask) => sum + ask.quantity, 0);
  const bidAskRatio = totalBidVolume / (totalAskVolume || 1);
  
  const spread = asks[0].price - bids[0].price;
  const spreadPercentage = (spread / ipo.currentPrice) * 100;
  
  // Calculate support and resistance
  const strongestSupport = bids.reduce((max, bid) => 
    bid.quantity > max.quantity ? bid : max, bids[0]);
  
  const strongestResistance = asks.reduce((max, ask) => 
    ask.quantity > max.quantity ? ask : max, asks[0]);
  
  return {
    bids,
    asks,
    metrics: {
      totalBidVolume,
      totalAskVolume,
      bidAskRatio,
      spread,
      spreadPercentage
    },
    analysis: {
      liquidityScore: faker.number.int({ min: 30, max: 95 }),
      volatilityRisk: faker.number.int({ min: 10, max: 90 }),
      strongestSupport: strongestSupport.price,
      strongestResistance: strongestResistance.price
    },
    timestamp: new Date().toISOString()
  };
};

// Anomaly detection function
export const detectAnomalies = (ipo: IPO, recentTrades = []) => {
  // Simulate if anomalies were detected
  const detected = faker.number.int({ min: 1, max: 10 }) <= 3; // 30% chance
  
  if (!detected) {
    return {
      ipoId: ipo.id,
      detected: false,
      riskScore: faker.number.int({ min: 5, max: 25 }),
      timestamp: new Date().toISOString()
    };
  }
  
  // Generate random anomalies
  const anomalyCount = faker.number.int({ min: 1, max: 3 });
  const anomalyTypes = [
    'Large sell order',
    'Unusual trading volume',
    'Price manipulation pattern',
    'Wash trading activity',
    'Abnormal buy wall',
    'Order book imbalance'
  ];
  
  const anomalies = Array.from({ length: anomalyCount }, () => {
    const anomalyType = faker.helpers.arrayElement(anomalyTypes);
    const severity = faker.helpers.arrayElement(['Low', 'Medium', 'High']);
    
    return {
      type: anomalyType,
      severity,
      confidence: faker.number.int({ min: 60, max: 95 }),
      description: `Detected ${anomalyType.toLowerCase()} with ${severity.toLowerCase()} severity`,
      timestamp: faker.date.recent({ days: 1 }).toISOString()
    };
  });
  
  // Calculate risk score based on anomalies
  const severityWeights = { Low: 10, Medium: 25, High: 40 };
  const baseRiskScore = faker.number.int({ min: 30, max: 50 });
  const anomalyRiskContribution = anomalies.reduce((total, anomaly) => {
    return total + severityWeights[anomaly.severity];
  }, 0);
  
  const riskScore = Math.min(95, baseRiskScore + anomalyRiskContribution);
  
  return {
    ipoId: ipo.id,
    detected: true,
    riskScore,
    anomalies,
    recommendations: [
      'Monitor closely for next 24 hours',
      'Enable additional verification for large orders',
      'Temporarily adjust order limits'
    ],
    timestamp: new Date().toISOString()
  };
};

// Calculate dividend yield and related metrics
export function calculateDividendYield(ipo: IPO) {
  // Base annual yield percent between 1-7%
  const annualYieldPercent = faker.number.float({ min: 1, max: 7, fractionDigits: 2 });
  
  // Calculate estimated quarterly payout
  const quarterlyPayout = (ipo.revenueUSD || 1000000) * 0.25 * (annualYieldPercent / 100) / 4;
  
  // Format in millions
  const nextEstimatedAmount = (quarterlyPayout / 1000000).toFixed(2);
  
  // Generate next payout date (1-90 days in the future)
  const nextPayoutDays = faker.number.int({ min: 1, max: 90 });
  const nextPayoutDate = new Date();
  nextPayoutDate.setDate(nextPayoutDate.getDate() + nextPayoutDays);
  
  // Generate historical payouts (past 4 quarters)
  const historicalPayouts = [];
  for (let i = 1; i <= 4; i++) {
    const pastDate = new Date();
    pastDate.setMonth(pastDate.getMonth() - i * 3);
    
    const variation = faker.number.float({ min: -0.2, max: 0.2 });
    const amount = parseFloat((parseFloat(nextEstimatedAmount) * (1 + variation)).toFixed(2));
    
    historicalPayouts.push({
      date: pastDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      amount
    });
  }
  
  return {
    annualYieldPercent,
    nextEstimatedAmount,
    nextPayoutDate: nextPayoutDate.toISOString(),
    payoutFrequency: "Quarterly",
    historicalPayouts,
    yieldTrend: faker.helpers.arrayElement(['increasing', 'stable', 'decreasing']),
    lastUpdated: new Date().toISOString()
  };
}

// Generate token vesting rules
export function getTokenVestingRules(ipo: IPO) {
  // Creator vesting rules
  const creatorVesting = {
    initialUnlock: faker.number.int({ min: 10, max: 30 }), // % unlocked at launch
    vestingPeriod: faker.number.int({ min: 12, max: 36 }), // months
    monthlyUnlock: faker.number.float({ min: 2, max: 5, fractionDigits: 1 }), // % per month
    cliffPeriod: faker.number.int({ min: 0, max: 6 }) // months before vesting starts
  };
  
  // Investor staking rules
  const investorStaking = {
    minStakingPeriod: faker.number.int({ min: 30, max: 180 }), // days
    earlyUnstakePenalty: faker.number.int({ min: 5, max: 20 }), // %
    stakingRewards: faker.number.float({ min: 3, max: 12, fractionDigits: 1 }) // % APY
  };
  
  // Token lockup schedule
  const tokenLockupSchedule = [];
  
  // Add initial unlock
  tokenLockupSchedule.push({
    month: 0,
    unlockPercentage: creatorVesting.initialUnlock,
    label: 'Initial'
  });
  
  // Add cliff period if applicable
  if (creatorVesting.cliffPeriod > 0) {
    tokenLockupSchedule.push({
      month: creatorVesting.cliffPeriod,
      unlockPercentage: 0,
      label: 'Cliff'
    });
  }
  
  // Add monthly unlocks for the rest of the vesting period
  for (let i = (creatorVesting.cliffPeriod > 0 ? creatorVesting.cliffPeriod + 1 : 1); 
      i <= creatorVesting.vestingPeriod; 
      i++) {
    tokenLockupSchedule.push({
      month: i,
      unlockPercentage: creatorVesting.monthlyUnlock,
      label: `Month ${i}`
    });
  }
  
  return {
    creatorVesting,
    investorStaking,
    tokenLockupSchedule,
    lastUpdated: new Date().toISOString()
  };
}

// Generate liquidation rules
export function getLiquidationRules() {
  return {
    inactivityThreshold: faker.number.int({ min: 90, max: 365 }), // days
    engagementMinimum: faker.number.int({ min: 5, max: 20 }),
    liquidationProcess: faker.helpers.arrayElement([
      "Gradual token buyback over 30 days at market price",
      "Immediate token buyback at 90% of market price",
      "Community vote required before liquidation process",
      "Creator has 60-day grace period to return to minimum activity"
    ]),
    tokenBuybackPrice: faker.number.float({ min: 0.5, max: 0.9, fractionDigits: 2 }),
    warningThresholds: {
      severe: 30, // days
      moderate: 60,
      mild: 90
    }
  };
}
