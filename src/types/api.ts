
// Define types for API responses

export interface SocialPlatformMetrics {
  platform: string;
  score: number;
  trend: string;
  volume: number;
  followers?: number;
  engagement?: number;
  growth?: number;
  isRealData?: boolean;
  // Add additional fields that might be present in the API service version
  posts?: number;
  recentEngagementRate?: number;
}

export interface StreamingPlatformMetrics {
  platform: string;
  streams: number;
  popularity: number;
  isRealData?: boolean;
  // Add additional fields that might be present in the API service version
  listeners?: number;
  avgStreamTime?: number;
  growth?: number;
}

export interface BrandDeal {
  brand: string;
  dealValue: number;
  startDate: string;
  endDate: string;
  engagement: number;
}

export interface RevenueData {
  totalRevenue: number;
  contentRevenue: number;
  sponsorshipRevenue: number;
  merchandiseRevenue: number;
  liveEventsRevenue: number;
  growthRate: number;
}

export interface RevenuePeriod {
  period: string;
  revenue: number;
}

export interface CreatorMetrics {
  social: SocialPlatformMetrics[];
  streaming: StreamingPlatformMetrics[];
  brandDeals: BrandDeal[];
  revenue: RevenueData;  
  revenueHistory: RevenuePeriod[];  
  lastUpdated: string;
  creatorId?: string; // Add this to match API service version
}

// Additional types as needed for the application
export interface SentimentAlert {
  timestamp: string;
  type: string;
  message: string;
  change: number;
}

export interface SentimentSummary {
  overallScore: number;
  previousScore: number;
  change: number;
  lastUpdated: string;
  alerts: SentimentAlert[];
}

export interface MarketDepth {
  buyWallStrength: number;
  sellWallStrength: number;
  supportLevels: number[];
  resistanceLevels: number[];
  currentSpread: { bid: number; ask: number } | null;
}

export interface CreatorMarketScore {
  totalScore: number;
  revenueInfluence: {
    score: number;
    weight: number;
    rawScore: number;
    factors: { name: string; impact: number; description: string; }[];
  };
  socialEngagementInfluence: {
    score: number;
    weight: number;
    rawScore: number;
    factors: { name: string; impact: number; description: string; }[];
  };
  aiSentimentScore: {
    score: number;
    weight: number;
    rawScore: number;
    factors: { name: string; impact: number; description: string; }[];
  };
  priceImpact: {
    recommendedPrice: number;
    priceChange: number;
    priceChangePercent: number;
    confidence: number;
  };
  anomalyDetection: {
    hasAnomalies: boolean;
    anomalyImpact: number;
  };
  lastUpdated: string;
}
