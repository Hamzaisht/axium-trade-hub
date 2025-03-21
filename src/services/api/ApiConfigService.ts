
import { SocialMediaApiService, SocialMediaMetrics } from './SocialMediaApiService';
import { StreamingApiService, StreamingMetrics } from './StreamingApiService';
import { BrandDealsApiService, BrandDealMetrics } from './BrandDealsApiService';
import { apiKeysService } from './APIKeysService';
import { toast } from 'sonner';

// Interface for combined creator metrics
export interface CreatorMetrics {
  creatorId: string;
  social: SocialMediaMetrics[];
  streaming: StreamingMetrics[];
  brandDeals: BrandDealMetrics[];
  lastUpdated: string;
}

class ApiConfigService {
  private socialMediaService: SocialMediaApiService;
  private streamingService: StreamingApiService;
  private brandDealsService: BrandDealsApiService;
  private useProxyEndpoints: boolean;

  constructor() {
    // Check if we should use proxy endpoints (more secure)
    this.useProxyEndpoints = import.meta.env.VITE_USE_API_PROXY === 'true';
    
    // Initialize services with appropriate API keys
    this.socialMediaService = new SocialMediaApiService(
      apiKeysService.getApiKey(apiKeysService.PLATFORMS.TWITTER) || 'mock-twitter-key', 
      this.useProxyEndpoints
    );
    
    this.streamingService = new StreamingApiService(
      apiKeysService.getApiKey(apiKeysService.PLATFORMS.SPOTIFY) || 'mock-spotify-key', 
      this.useProxyEndpoints
    );
    
    this.brandDealsService = new BrandDealsApiService(
      apiKeysService.getApiKey(apiKeysService.PLATFORMS.GOOGLE_TRENDS) || 'mock-google-trends-key', 
      this.useProxyEndpoints
    );
    
    console.log(`API Configuration Service initialized (${this.useProxyEndpoints ? 'proxy mode' : 'direct mode'})`);
  }

  // Method to check if we have valid API keys (non-mock)
  areRealApisConfigured(): boolean {
    const { real, total } = apiKeysService.getApiKeyStatus();
    return real > 0;
  }

  // Method to get API configuration status
  getApiStatus(): { real: number; mock: number; total: number; useProxy: boolean } {
    const { real, mock, total } = apiKeysService.getApiKeyStatus();
    return {
      real,
      mock,
      total,
      useProxy: this.useProxyEndpoints
    };
  }

  // Method to check if we're using proxy endpoints
  isUsingProxyEndpoints(): boolean {
    return this.useProxyEndpoints;
  }

  // Get all creator metrics in one call
  async getCreatorMetrics(creatorId: string): Promise<CreatorMetrics> {
    try {
      // In a real implementation, these would be the creator's actual social handles
      const socialHandles = {
        twitter: `creator_${creatorId}`,
        instagram: `creator_${creatorId}`,
        youtube: `channel_${creatorId}`,
        tiktok: `creator_${creatorId}`,
        snapchat: `creator_${creatorId}`,
        twitch: `creator_${creatorId}`,
        kick: `creator_${creatorId}`,
        rumble: `creator_${creatorId}`
      };
      
      // Fetch all metrics in parallel with proper error handling for each platform
      const [
        twitter,
        instagram,
        youtube,
        tiktok,
        snapchat,
        spotify,
        appleMusic,
        youtubeMusic,
        twitch,
        kick,
        rumble,
        brandDeals
      ] = await Promise.all([
        this.socialMediaService.getTwitterMetrics(socialHandles.twitter).catch(e => {
          console.error('Twitter API error:', e);
          return null;
        }),
        this.socialMediaService.getInstagramMetrics(socialHandles.instagram).catch(e => {
          console.error('Instagram API error:', e);
          return null;
        }),
        this.socialMediaService.getYouTubeMetrics(socialHandles.youtube).catch(e => {
          console.error('YouTube API error:', e);
          return null;
        }),
        this.socialMediaService.getTikTokMetrics(socialHandles.tiktok).catch(e => {
          console.error('TikTok API error:', e);
          return null;
        }),
        this.socialMediaService.getSnapchatMetrics(socialHandles.snapchat).catch(e => {
          console.error('Snapchat API error:', e);
          return null;
        }),
        this.streamingService.getSpotifyMetrics(creatorId).catch(e => {
          console.error('Spotify API error:', e);
          return null;
        }),
        this.streamingService.getAppleMusicMetrics(creatorId).catch(e => {
          console.error('Apple Music API error:', e);
          return null;
        }),
        this.streamingService.getYouTubeMusicMetrics(socialHandles.youtube).catch(e => {
          console.error('YouTube Music API error:', e);
          return null;
        }),
        this.streamingService.getTwitchMetrics(socialHandles.twitch).catch(e => {
          console.error('Twitch API error:', e);
          return null;
        }),
        this.streamingService.getKickMetrics(socialHandles.kick).catch(e => {
          console.error('Kick API error:', e);
          return null;
        }),
        this.streamingService.getRumbleMetrics(socialHandles.rumble).catch(e => {
          console.error('Rumble API error:', e);
          return null;
        }),
        this.brandDealsService.getBrandDeals(creatorId).catch(e => {
          console.error('Brand Deals API error:', e);
          return [];
        })
      ]);
      
      // Filter out any null values (failed API calls)
      const social = [twitter, instagram, youtube, tiktok, snapchat].filter(Boolean) as SocialMediaMetrics[];
      const streaming = [spotify, appleMusic, youtubeMusic, twitch, kick, rumble].filter(Boolean) as StreamingMetrics[];
      
      // Check if we have any real data
      const hasRealSocialData = social.some(platform => platform.isRealData);
      const hasRealStreamingData = streaming.some(platform => platform.isRealData);
      
      // Log the data sources
      console.log(`Creator ${creatorId} data sources:`, {
        socialPlatforms: social.map(s => s.platform),
        streamingPlatforms: streaming.map(s => s.platform),
        hasRealSocialData,
        hasRealStreamingData
      });
      
      return {
        creatorId,
        social,
        streaming,
        brandDeals: brandDeals || [],
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching creator metrics:', error);
      toast.error('Failed to load creator metrics');
      throw error;
    }
  }
}

// Export a singleton instance
export const apiConfigService = new ApiConfigService();
