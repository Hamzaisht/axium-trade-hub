
import { faker } from "@faker-js/faker";
import { apiConfigService } from "../api/ApiConfigService";
import { APIKeysService, apiKeysService } from "../api/APIKeysService";

export type SentimentDirection = 'positive' | 'negative' | 'neutral';
export type SentimentStrength = 'strong' | 'moderate' | 'weak';
export type PlatformType = 'social' | 'streaming' | 'search';
export type CreatorStrength = 'strong' | 'neutral' | 'weak';

export interface PlatformSentiment {
  platform: string;
  platformType: PlatformType;
  score: number; // 0-100
  previousScore: number;
  change: number; // percentage change
  direction: SentimentDirection;
  strength: SentimentStrength;
  keywords: string[];
  lastUpdated: string;
  isRealData: boolean;
}

export interface SentimentSummary {
  overallScore: number; // 0-100
  overallChange: number;
  direction: SentimentDirection;
  strongestPlatform: string;
  weakestPlatform: string;
  alerts: SentimentAlert[];
  lastUpdated: string;
}

export interface SentimentAlert {
  platform: string;
  message: string;
  type: 'warning' | 'info' | 'critical';
  change: number;
  timestamp: string;
}

export interface CreatorMarketScore {
  score: number; // 0-100
  category: CreatorStrength;
  sentimentWeight: number;
  volumeWeight: number;
  engagementWeight: number;
  revenueWeight: number;
  components: {
    sentiment: number;
    volume: number;
    engagement: number;
    revenue: number;
  };
  lastUpdated: string;
}

export interface CreatorSentimentData {
  creatorId: string;
  platforms: PlatformSentiment[];
  summary: SentimentSummary;
  cmsScore: CreatorMarketScore;
}

// New interfaces for PR Engine
export interface PREvent {
  id: string;
  creatorId: string;
  platform: string;
  headline: string;
  summary: string;
  sentimentScore: number; // -100 to +100 scale
  impact: 'minor' | 'moderate' | 'major';
  timestamp: string;
  url?: string;
  isPositive: boolean;
}

export interface PREngineData {
  events: PREvent[];
  latestScore: number;
  historicalScores: {timestamp: string, score: number}[];
}

class SentimentAnalysisService {
  private static instance: SentimentAnalysisService;
  private creatorSentimentCache: Map<string, CreatorSentimentData> = new Map();
  private creatorPRCache: Map<string, PREngineData> = new Map();
  
  // Singleton pattern
  public static getInstance(): SentimentAnalysisService {
    if (!SentimentAnalysisService.instance) {
      SentimentAnalysisService.instance = new SentimentAnalysisService();
    }
    return SentimentAnalysisService.instance;
  }
  
  private constructor() {
    console.log('Sentiment Analysis Service initialized');
  }
  
  /**
   * Get sentiment data for a creator
   * @param creatorId The creator ID
   * @returns Sentiment data or generates mock data if none exists
   */
  public async getCreatorSentiment(creatorId: string): Promise<CreatorSentimentData> {
    // Check cache first
    if (this.creatorSentimentCache.has(creatorId)) {
      return this.creatorSentimentCache.get(creatorId)!;
    }
    
    // Generate new data
    const sentimentData = await this.generateCreatorSentiment(creatorId);
    this.creatorSentimentCache.set(creatorId, sentimentData);
    
    return sentimentData;
  }
  
  /**
   * Generate mock sentiment data for a creator
   */
  private async generateCreatorSentiment(creatorId: string): Promise<CreatorSentimentData> {
    // Get creator metrics from API config service to ensure consistency
    const creatorMetrics = await apiConfigService.getCreatorMetrics(creatorId);
    
    // Generate platform sentiments
    const platforms: PlatformSentiment[] = [
      // Social Media platforms
      this.generatePlatformSentiment('Twitter', 'social', APIKeysService.PLATFORMS.TWITTER),
      this.generatePlatformSentiment('Instagram', 'social', APIKeysService.PLATFORMS.INSTAGRAM),
      this.generatePlatformSentiment('YouTube', 'social', APIKeysService.PLATFORMS.YOUTUBE),
      this.generatePlatformSentiment('TikTok', 'social', APIKeysService.PLATFORMS.TIKTOK),
      this.generatePlatformSentiment('Snapchat', 'social', APIKeysService.PLATFORMS.SNAPCHAT),
      this.generatePlatformSentiment('Facebook', 'social'), // No API key for this yet
      
      // Streaming platforms
      this.generatePlatformSentiment('Spotify', 'streaming', APIKeysService.PLATFORMS.SPOTIFY),
      this.generatePlatformSentiment('Twitch', 'streaming', APIKeysService.PLATFORMS.TWITCH),
      this.generatePlatformSentiment('Kick', 'streaming', APIKeysService.PLATFORMS.KICK),
      this.generatePlatformSentiment('Rumble', 'streaming', APIKeysService.PLATFORMS.RUMBLE),
      
      // Search platforms
      this.generatePlatformSentiment('Google Trends', 'search', APIKeysService.PLATFORMS.GOOGLE_TRENDS),
    ];
    
    // Generate alerts for significant changes
    const alerts = this.generateSentimentAlerts(platforms);
    
    // Generate overall summary
    const summary = this.generateSentimentSummary(platforms, alerts);
    
    // Generate CMS score
    const cmsScore = this.generateCreatorMarketScore(platforms, creatorMetrics);
    
    return {
      creatorId,
      platforms,
      summary,
      cmsScore
    };
  }
  
  /**
   * Generate sentiment for a specific platform
   */
  private generatePlatformSentiment(
    platform: string, 
    platformType: PlatformType,
    apiKeyPlatform?: string
  ): PlatformSentiment {
    // Check if we have a real API key for this platform
    const isRealData = apiKeyPlatform ? apiKeysService.hasRealApiKey(apiKeyPlatform) : false;
    
    // Generate a realistic sentiment score (0-100)
    const score = faker.number.int({ min: 20, max: 85 });
    
    // Generate a previous score with a reasonable change
    const changePercent = faker.number.float({ min: -35, max: 35, fractionDigits: 1 });
    const previousScore = Math.max(0, Math.min(100, score - (score * (changePercent / 100))));
    
    // Determine direction based on change
    let direction: SentimentDirection = 'neutral';
    if (changePercent > 5) direction = 'positive';
    else if (changePercent < -5) direction = 'negative';
    
    // Determine strength
    let strength: SentimentStrength = 'moderate';
    if (Math.abs(changePercent) > 20) strength = 'strong';
    else if (Math.abs(changePercent) < 10) strength = 'weak';
    
    // Generate relevant keywords
    const keywordCount = faker.number.int({ min: 3, max: 6 });
    const keywordPool = [
      'viral', 'trending', 'controversy', 'collaboration', 'growth',
      'decline', 'popular', 'scandal', 'award', 'announcement',
      'launch', 'partnership', 'charity', 'milestone', 'exclusive',
      'interview', 'review', 'reaction', 'drama', 'celebration'
    ];
    const keywords = faker.helpers.arrayElements(keywordPool, keywordCount);
    
    return {
      platform,
      platformType,
      score,
      previousScore,
      change: changePercent,
      direction,
      strength,
      keywords,
      lastUpdated: new Date().toISOString(),
      isRealData
    };
  }
  
  /**
   * Generate alerts for significant sentiment changes
   */
  private generateSentimentAlerts(platforms: PlatformSentiment[]): SentimentAlert[] {
    return platforms
      .filter(platform => Math.abs(platform.change) > 20)
      .map(platform => {
        const isPositive = platform.change > 0;
        
        return {
          platform: platform.platform,
          message: isPositive
            ? `Strong positive trend on ${platform.platform} with +${platform.change.toFixed(1)}% increase in sentiment`
            : `Significant drop in sentiment on ${platform.platform} with ${platform.change.toFixed(1)}% decrease`,
          type: Math.abs(platform.change) > 30 ? 'critical' : 'warning',
          change: platform.change,
          timestamp: new Date().toISOString()
        };
      });
  }
  
  /**
   * Generate overall sentiment summary
   */
  private generateSentimentSummary(
    platforms: PlatformSentiment[],
    alerts: SentimentAlert[]
  ): SentimentSummary {
    // Calculate overall score as weighted average
    const weights = {
      social: 0.6,   // Social media has highest impact
      streaming: 0.3, // Streaming platforms have medium impact
      search: 0.1     // Search trends have lowest impact
    };
    
    let totalWeight = 0;
    let weightedScore = 0;
    let totalPositiveChange = 0;
    let totalNegativeChange = 0;
    
    platforms.forEach(platform => {
      const weight = weights[platform.platformType];
      weightedScore += platform.score * weight;
      totalWeight += weight;
      
      if (platform.change > 0) totalPositiveChange += platform.change;
      else totalNegativeChange += Math.abs(platform.change);
    });
    
    const overallScore = weightedScore / totalWeight;
    
    // Calculate overall change as net of positive and negative changes
    const overallChange = totalPositiveChange - totalNegativeChange;
    
    // Determine direction
    let direction: SentimentDirection = 'neutral';
    if (overallChange > 5) direction = 'positive';
    else if (overallChange < -5) direction = 'negative';
    
    // Find strongest and weakest platforms
    const sortedPlatforms = [...platforms].sort((a, b) => b.score - a.score);
    const strongestPlatform = sortedPlatforms[0].platform;
    const weakestPlatform = sortedPlatforms[sortedPlatforms.length - 1].platform;
    
    return {
      overallScore,
      overallChange,
      direction,
      strongestPlatform,
      weakestPlatform,
      alerts,
      lastUpdated: new Date().toISOString()
    };
  }
  
  /**
   * Generate Creator Market Score (CMS)
   */
  private generateCreatorMarketScore(
    platforms: PlatformSentiment[],
    creatorMetrics: any
  ): CreatorMarketScore {
    // Calculate sentiment component (0-100)
    const sentimentComponent = platforms.reduce((avg, p) => avg + p.score, 0) / platforms.length;
    
    // Calculate volume component based on simulated trading volume (0-100)
    const volumeComponent = faker.number.int({ min: 30, max: 90 });
    
    // Calculate engagement component from external metrics if available
    let engagementComponent = 50; // Default
    if (creatorMetrics && creatorMetrics.social.length > 0) {
      const avgEngagement = creatorMetrics.social.reduce(
        (sum: number, platform: any) => sum + platform.engagement, 
        0
      ) / creatorMetrics.social.length;
      
      // Scale to 0-100
      engagementComponent = Math.min(100, avgEngagement * 10);
    }
    
    // Calculate revenue component
    let revenueComponent = 50; // Default
    if (creatorMetrics && creatorMetrics.brandDeals.length > 0) {
      const totalValue = creatorMetrics.brandDeals.reduce(
        (sum: number, deal: any) => sum + deal.dealValue, 
        0
      );
      
      // Scale based on total brand deal value (higher is better)
      revenueComponent = Math.min(100, (totalValue / 100000) * 10);
    }
    
    // Define weights for CMS components
    const weights = {
      sentiment: 0.35,
      volume: 0.25,
      engagement: 0.25,
      revenue: 0.15
    };
    
    // Calculate weighted score
    const score = 
      (sentimentComponent * weights.sentiment) +
      (volumeComponent * weights.volume) +
      (engagementComponent * weights.engagement) +
      (revenueComponent * weights.revenue);
    
    // Determine category
    let category: CreatorStrength = 'neutral';
    if (score >= 70) category = 'strong';
    else if (score < 45) category = 'weak';
    
    return {
      score,
      category,
      sentimentWeight: weights.sentiment * 100,
      volumeWeight: weights.volume * 100,
      engagementWeight: weights.engagement * 100,
      revenueWeight: weights.revenue * 100,
      components: {
        sentiment: sentimentComponent,
        volume: volumeComponent,
        engagement: engagementComponent,
        revenue: revenueComponent
      },
      lastUpdated: new Date().toISOString()
    };
  }
  
  /**
   * Refresh sentiment data for a creator
   */
  public async refreshCreatorSentiment(creatorId: string): Promise<CreatorSentimentData> {
    // Generate new data
    const sentimentData = await this.generateCreatorSentiment(creatorId);
    this.creatorSentimentCache.set(creatorId, sentimentData);
    
    return sentimentData;
  }

  /**
   * Get PR events for a creator
   * @param creatorId The creator ID
   * @returns PR events data or generates mock data if none exists
   */
  public async getCreatorPREvents(creatorId: string): Promise<PREngineData> {
    // Check cache first
    if (this.creatorPRCache.has(creatorId)) {
      return this.creatorPRCache.get(creatorId)!;
    }
    
    // Generate new data
    const prData = this.generateCreatorPREvents(creatorId);
    this.creatorPRCache.set(creatorId, prData);
    
    return prData;
  }

  /**
   * Generate mock PR events for a creator
   */
  private generateCreatorPREvents(creatorId: string): PREngineData {
    // Generate PR events from different platforms
    const platforms = [
      'Twitter', 'Instagram', 'TikTok', 'YouTube', 
      'Reddit', 'News', 'Google Trends', 'Twitch'
    ];
    
    // Generate between 5-15 random PR events
    const eventCount = faker.number.int({ min: 5, max: 15 });
    const events: PREvent[] = [];
    
    // Generate past dates up to 30 days ago, with newest first
    const dates = Array.from({ length: eventCount }, () => {
      return new Date(Date.now() - faker.number.int({ min: 0, max: 30 }) * 24 * 60 * 60 * 1000);
    }).sort((a, b) => b.getTime() - a.getTime());
    
    // Headlines and summaries
    const positiveHeadlines = [
      "Creator launches charity drive",
      "Viral video breaks records",
      "Collaboration with major brand announced",
      "New milestone reached",
      "Award nomination announced",
      "Surpassed a million followers",
      "Trending hashtag takes off",
      "Highly anticipated content release",
      "Featured in mainstream news",
      "Praised for community impact"
    ];
    
    const negativeHeadlines = [
      "Controversy emerges over comments",
      "Backlash from fanbase over decision",
      "Criticized for brand partnership",
      "Failed to meet anticipated metrics",
      "Technical issues plague new release",
      "Allegations surface about past behavior",
      "Content removed from platform",
      "Social media hiatus announced",
      "Negative review from major outlet",
      "Copyright strike issued"
    ];
    
    // Generate events
    for (let i = 0; i < eventCount; i++) {
      // Determine if this is a positive or negative event (60% positive bias)
      const isPositive = faker.number.int({ min: 1, max: 10 }) <= 6;
      
      // Generate a sentiment score (-100 to +100)
      // Positive scores range from 10 to 100, negative from -10 to -100
      const baseScore = faker.number.int({ min: 10, max: 100 });
      const sentimentScore = isPositive ? baseScore : -baseScore;
      
      // Determine impact level based on score magnitude
      let impact: 'minor' | 'moderate' | 'major' = 'minor';
      
      if (Math.abs(sentimentScore) >= 80) impact = 'major';
      else if (Math.abs(sentimentScore) >= 50) impact = 'moderate';
      
      // Choose a random platform
      const platform = faker.helpers.arrayElement(platforms);
      
      // Select headlines based on sentiment
      const headline = isPositive 
        ? faker.helpers.arrayElement(positiveHeadlines) 
        : faker.helpers.arrayElement(negativeHeadlines);
      
      // Generate a summary
      const summary = faker.lorem.sentences(2);
      
      events.push({
        id: faker.string.uuid(),
        creatorId,
        platform,
        headline,
        summary,
        sentimentScore,
        impact,
        timestamp: dates[i].toISOString(),
        isPositive
      });
    }
    
    // Ensure at least one major event in the last 24 hours (50% chance)
    if (faker.number.int({ min: 1, max: 2 }) === 1) {
      const isPositive = faker.number.int({ min: 1, max: 10 }) <= 5;
      const headline = isPositive
        ? "Viral content breaks platform records"
        : "Major controversy erupts over recent statements";
      
      events.unshift({
        id: faker.string.uuid(),
        creatorId,
        platform: faker.helpers.arrayElement(platforms),
        headline,
        summary: faker.lorem.sentences(3),
        sentimentScore: isPositive ? faker.number.int({ min: 80, max: 100 }) : faker.number.int({ min: -100, max: -80 }),
        impact: 'major',
        timestamp: new Date(Date.now() - faker.number.int({ min: 0, max: 24 }) * 60 * 60 * 1000).toISOString(),
        isPositive
      });
    }
    
    // Calculate latest sentiment score as weighted average of recent events
    // More recent events have higher weight
    let scoreSum = 0;
    let weightSum = 0;
    
    events.forEach((event, index) => {
      const weight = events.length - index; // newest has highest weight
      scoreSum += event.sentimentScore * weight;
      weightSum += weight;
    });
    
    const latestScore = scoreSum / weightSum;
    
    // Generate historical scores for the past 30 days
    const historicalScores = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      
      // Generate a score that has some continuity with nearby dates
      // Base it on events if they exist for that day
      const eventsOnDate = events.filter(e => 
        new Date(e.timestamp).toDateString() === date.toDateString()
      );
      
      let score;
      if (eventsOnDate.length > 0) {
        // Average the scores of events on this date
        score = eventsOnDate.reduce((sum, e) => sum + e.sentimentScore, 0) / eventsOnDate.length;
      } else {
        // Create a score with some randomness but following a trend
        const previousScore = i > 0 ? historicalScores[i-1]?.score : 0;
        const changeAmount = faker.number.float({ min: -15, max: 15 });
        score = previousScore 
          ? Math.max(-100, Math.min(100, previousScore + changeAmount)) 
          : faker.number.int({ min: -20, max: 60 });
      }
      
      return {
        timestamp: date.toISOString(),
        score
      };
    });
    
    return {
      events,
      latestScore,
      historicalScores
    };
  }

  /**
   * Refresh PR events for a creator
   */
  public async refreshCreatorPREvents(creatorId: string): Promise<PREngineData> {
    // Generate new data
    const prData = this.generateCreatorPREvents(creatorId);
    this.creatorPRCache.set(creatorId, prData);
    
    return prData;
  }
}

// Export a singleton instance
export const sentimentAnalysisService = SentimentAnalysisService.getInstance();
