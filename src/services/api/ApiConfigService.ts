
/**
 * Service for managing API configuration and status
 */
import { BrandDealsApiService } from './BrandDealsApiService';
import { SocialMediaApiService } from './SocialMediaApiService';
import { StreamingApiService } from './StreamingApiService';
import { APIKeysService } from './APIKeysService';

export interface SocialPlatformMetrics {
  platform: string;
  followers: number;
  engagement: number;
  posts: number;
  growth: number;
  isRealData: boolean;
}

export interface StreamingPlatformMetrics {
  platform: string;
  listeners: number;
  streams: number;
  popularity: number;
  avgStreamTime: number;
  growth: number;
  isRealData: boolean;
}

export interface BrandDealMetrics {
  brand: string;
  dealValue: number;
  startDate: string;
  endDate: string;
  engagement: number;
}

export interface CreatorMetrics {
  creatorId: string;
  social: SocialPlatformMetrics[];
  streaming: StreamingPlatformMetrics[];
  brandDeals: BrandDealMetrics[];
  lastUpdated: string;
}

class ApiConfigService {
  private static instance: ApiConfigService;
  private socialMediaApi: SocialMediaApiService;
  private streamingApi: StreamingApiService;
  private brandDealsApi: BrandDealsApiService;

  private constructor() {
    // Initialize API services with empty constructor params
    this.socialMediaApi = new SocialMediaApiService();
    this.streamingApi = new StreamingApiService();
    this.brandDealsApi = new BrandDealsApiService('');
  }

  // Singleton pattern
  public static getInstance(): ApiConfigService {
    if (!ApiConfigService.instance) {
      ApiConfigService.instance = new ApiConfigService();
    }
    return ApiConfigService.instance;
  }

  /**
   * Get the current API status
   * @returns Object with counts of real and mock APIs
   */
  public getApiStatus(): { real: number; mock: number; total: number; useProxy: boolean } {
    // Check if we have Twitter API key
    const hasTwitterApi = APIKeysService.getInstance().hasRealApiKey(APIKeysService.PLATFORMS.TWITTER);
    
    // Check if we have Instagram API key
    const hasInstagramApi = APIKeysService.getInstance().hasRealApiKey(APIKeysService.PLATFORMS.INSTAGRAM);
    
    // Check if we have YouTube API key
    const hasYoutubeApi = APIKeysService.getInstance().hasRealApiKey(APIKeysService.PLATFORMS.YOUTUBE);
    
    // Check if we have Spotify API key
    const hasSpotifyApi = APIKeysService.getInstance().hasRealApiKey(APIKeysService.PLATFORMS.SPOTIFY);
    
    // Check if we have Twitch API key
    const hasTwitchApi = APIKeysService.getInstance().hasRealApiKey(APIKeysService.PLATFORMS.TWITCH);
    
    // Get API key status
    const apiKeyStatus = APIKeysService.getInstance().getApiKeyStatus();
    
    // Check if we're using proxy endpoints (for security)
    const useProxy = true; // For now, always use proxy
    
    return {
      ...apiKeyStatus,
      useProxy
    };
  }

  /**
   * Get creator metrics from various APIs
   * @param creatorId The creator's ID
   * @returns Aggregated metrics from all APIs
   */
  public async getCreatorMetrics(creatorId: string): Promise<CreatorMetrics> {
    // Get social media metrics
    const socialMetrics = await this.socialMediaApi.getCreatorMetrics(creatorId);
    
    // Get streaming metrics
    const streamingMetrics = await this.streamingApi.getCreatorMetrics(creatorId);
    
    // Get brand deal metrics
    const brandDealMetrics = await this.brandDealsApi.getCreatorDeals(creatorId);
    
    // Ensure isRealData property is present and convert types
    const normalizedSocialMetrics = socialMetrics.map(metric => ({
      ...metric,
      isRealData: metric.isRealData ?? false
    })) as SocialPlatformMetrics[];
    
    const normalizedStreamingMetrics = streamingMetrics.map(metric => ({
      ...metric,
      isRealData: metric.isRealData ?? false
    })) as StreamingPlatformMetrics[];
    
    return {
      creatorId,
      social: normalizedSocialMetrics,
      streaming: normalizedStreamingMetrics,
      brandDeals: brandDealMetrics,
      lastUpdated: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const apiConfigService = ApiConfigService.getInstance();
