
import { SocialMediaApiService, SocialMediaMetrics } from './SocialMediaApiService';
import { StreamingApiService, StreamingMetrics } from './StreamingApiService';
import { BrandDealsApiService, BrandDealMetrics } from './BrandDealsApiService';
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
  private apiKeys: Record<string, string> = {
    twitter: import.meta.env.VITE_TWITTER_API_KEY || 'mock-twitter-key',
    instagram: import.meta.env.VITE_INSTAGRAM_API_KEY || 'mock-instagram-key',
    youtube: import.meta.env.VITE_YOUTUBE_API_KEY || 'mock-youtube-key',
    tiktok: import.meta.env.VITE_TIKTOK_API_KEY || 'mock-tiktok-key',
    spotify: import.meta.env.VITE_SPOTIFY_API_KEY || 'mock-spotify-key',
    appleMusic: import.meta.env.VITE_APPLE_MUSIC_API_KEY || 'mock-apple-music-key',
    googleTrends: import.meta.env.VITE_GOOGLE_TRENDS_API_KEY || 'mock-google-trends-key',
  };

  private socialMediaService: SocialMediaApiService;
  private streamingService: StreamingApiService;
  private brandDealsService: BrandDealsApiService;

  constructor() {
    // Initialize services
    this.socialMediaService = new SocialMediaApiService(this.apiKeys.twitter);
    this.streamingService = new StreamingApiService(this.apiKeys.spotify);
    this.brandDealsService = new BrandDealsApiService(this.apiKeys.googleTrends);
    
    console.log('API Configuration Service initialized');
  }

  // Method to check if we have valid API keys (non-mock)
  areRealApisConfigured(): boolean {
    return Object.values(this.apiKeys).some(key => key && !key.startsWith('mock-'));
  }

  // Get all creator metrics in one call
  async getCreatorMetrics(creatorId: string): Promise<CreatorMetrics> {
    try {
      // In a real implementation, these would be the creator's actual social handles
      const socialHandles = {
        twitter: `creator_${creatorId}`,
        instagram: `creator_${creatorId}`,
        youtube: `channel_${creatorId}`,
        tiktok: `creator_${creatorId}`
      };
      
      // Fetch all metrics in parallel
      const [
        twitter,
        instagram,
        youtube,
        tiktok,
        spotify,
        appleMusic,
        youtubeMusic,
        brandDeals
      ] = await Promise.all([
        this.socialMediaService.getTwitterMetrics(socialHandles.twitter).catch(e => null),
        this.socialMediaService.getInstagramMetrics(socialHandles.instagram).catch(e => null),
        this.socialMediaService.getYouTubeMetrics(socialHandles.youtube).catch(e => null),
        this.socialMediaService.getTikTokMetrics(socialHandles.tiktok).catch(e => null),
        this.streamingService.getSpotifyMetrics(creatorId).catch(e => null),
        this.streamingService.getAppleMusicMetrics(creatorId).catch(e => null),
        this.streamingService.getYouTubeMusicMetrics(socialHandles.youtube).catch(e => null),
        this.brandDealsService.getBrandDeals(creatorId).catch(e => [])
      ]);
      
      // Filter out any null values (failed API calls)
      const social = [twitter, instagram, youtube, tiktok].filter(Boolean) as SocialMediaMetrics[];
      const streaming = [spotify, appleMusic, youtubeMusic].filter(Boolean) as StreamingMetrics[];
      
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
