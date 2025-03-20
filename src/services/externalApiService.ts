
import { toast } from 'sonner';

// Interface for all social media metrics
export interface SocialMediaMetrics {
  platform: string;
  followers: number;
  engagement: number;
  growth: number;
  posts: number;
  recentEngagementRate: number;
}

// Interface for streaming service metrics
export interface StreamingMetrics {
  platform: string;
  listeners: number;
  streams: number;
  growth: number;
  avgStreamTime: number;
  popularity: number;
}

// Interface for brand deals and sponsorships
export interface BrandDealMetrics {
  brand: string;
  dealValue: number;
  startDate: string;
  endDate: string;
  engagement: number;
  conversionRate: number;
}

// Interface for combined creator metrics
export interface CreatorMetrics {
  creatorId: string;
  social: SocialMediaMetrics[];
  streaming: StreamingMetrics[];
  brandDeals: BrandDealMetrics[];
  lastUpdated: string;
}

class ExternalApiService {
  private apiKeys: Record<string, string> = {
    twitter: process.env.TWITTER_API_KEY || 'mock-twitter-key',
    instagram: process.env.INSTAGRAM_API_KEY || 'mock-instagram-key',
    youtube: process.env.YOUTUBE_API_KEY || 'mock-youtube-key',
    tiktok: process.env.TIKTOK_API_KEY || 'mock-tiktok-key',
    spotify: process.env.SPOTIFY_API_KEY || 'mock-spotify-key',
    appleMusic: process.env.APPLE_MUSIC_API_KEY || 'mock-apple-music-key',
    googleTrends: process.env.GOOGLE_TRENDS_API_KEY || 'mock-google-trends-key',
  };

  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  constructor() {
    // Initialize cache
    console.log('External API Service initialized');
  }

  // Utility method for caching
  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log(`Using cached data for ${key}`);
      return cached.data as T;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Mock API call with error handling and retry logic
  private async makeApiCall<T>(
    endpoint: string, 
    apiKey: string, 
    retries = 3
  ): Promise<T> {
    // Check cache first
    const cacheKey = `${endpoint}-${apiKey}`;
    const cachedData = this.getCachedData<T>(cacheKey);
    if (cachedData) return cachedData;

    // In a real implementation, this would make an actual API call
    // For now we'll simulate the API with random data and occasional errors
    try {
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      // Simulate occasional API failures (10% chance)
      if (Math.random() < 0.1) {
        throw new Error(`API error: ${endpoint} request failed`);
      }
      
      // Generate mock data based on the endpoint
      let data: any;
      
      if (endpoint.includes('social')) {
        data = this.generateMockSocialData(endpoint);
      } else if (endpoint.includes('streaming')) {
        data = this.generateMockStreamingData(endpoint);
      } else if (endpoint.includes('brand')) {
        data = this.generateMockBrandDealData(endpoint);
      } else {
        data = { message: 'Unknown endpoint' };
      }
      
      // Cache the result
      this.setCachedData(cacheKey, data);
      return data as T;
    } catch (error) {
      console.error(`API error (${endpoint}):`, error);
      
      // Retry logic
      if (retries > 0) {
        console.log(`Retrying ${endpoint} (${retries} attempts left)...`);
        return this.makeApiCall<T>(endpoint, apiKey, retries - 1);
      }
      
      // After retries are exhausted, throw the error
      toast.error(`Failed to fetch data from ${endpoint.split('/')[0]}`);
      throw error;
    }
  }

  // Mock data generators
  private generateMockSocialData(endpoint: string): SocialMediaMetrics {
    const platform = endpoint.split('/')[1] || 'unknown';
    return {
      platform,
      followers: 50000 + Math.floor(Math.random() * 5000000),
      engagement: 1 + Math.random() * 8,
      growth: -2 + Math.random() * 15,
      posts: 10 + Math.floor(Math.random() * 100),
      recentEngagementRate: 0.5 + Math.random() * 10
    };
  }

  private generateMockStreamingData(endpoint: string): StreamingMetrics {
    const platform = endpoint.split('/')[1] || 'unknown';
    return {
      platform,
      listeners: 10000 + Math.floor(Math.random() * 1000000),
      streams: 50000 + Math.floor(Math.random() * 10000000),
      growth: -5 + Math.random() * 25,
      avgStreamTime: 30 + Math.random() * 180,
      popularity: Math.random() * 100
    };
  }

  private generateMockBrandDealData(endpoint: string): BrandDealMetrics {
    const brands = ['Nike', 'Adidas', 'Puma', 'Apple', 'Samsung', 'Google', 'Amazon', 'Coca-Cola'];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    
    // Random date in the last 3 months
    const now = new Date();
    const startDate = new Date(now.getTime() - Math.random() * 7776000000); // 90 days in ms
    const endDate = new Date(startDate.getTime() + Math.random() * 7776000000); // Up to 90 days later
    
    return {
      brand,
      dealValue: 5000 + Math.random() * 995000, // $5K to $1M
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      engagement: 1 + Math.random() * 20,
      conversionRate: Math.random() * 5
    };
  }

  // Public methods for fetching data
  
  // Social Media API methods
  async getTwitterMetrics(username: string): Promise<SocialMediaMetrics> {
    return this.makeApiCall<SocialMediaMetrics>(
      `social/twitter/${username}`, 
      this.apiKeys.twitter
    );
  }

  async getInstagramMetrics(username: string): Promise<SocialMediaMetrics> {
    return this.makeApiCall<SocialMediaMetrics>(
      `social/instagram/${username}`, 
      this.apiKeys.instagram
    );
  }

  async getYouTubeMetrics(channelId: string): Promise<SocialMediaMetrics> {
    return this.makeApiCall<SocialMediaMetrics>(
      `social/youtube/${channelId}`, 
      this.apiKeys.youtube
    );
  }

  async getTikTokMetrics(username: string): Promise<SocialMediaMetrics> {
    return this.makeApiCall<SocialMediaMetrics>(
      `social/tiktok/${username}`, 
      this.apiKeys.tiktok
    );
  }
  
  // Streaming service API methods
  async getSpotifyMetrics(artistId: string): Promise<StreamingMetrics> {
    return this.makeApiCall<StreamingMetrics>(
      `streaming/spotify/${artistId}`, 
      this.apiKeys.spotify
    );
  }

  async getAppleMusicMetrics(artistId: string): Promise<StreamingMetrics> {
    return this.makeApiCall<StreamingMetrics>(
      `streaming/appleMusic/${artistId}`, 
      this.apiKeys.appleMusic
    );
  }

  async getYouTubeMusicMetrics(channelId: string): Promise<StreamingMetrics> {
    return this.makeApiCall<StreamingMetrics>(
      `streaming/youtubeMusic/${channelId}`, 
      this.apiKeys.youtube
    );
  }
  
  // Brand deals API methods
  async getBrandDeals(creatorId: string): Promise<BrandDealMetrics[]> {
    // For mock purposes, generate 1-5 random brand deals
    const numDeals = 1 + Math.floor(Math.random() * 5);
    const deals: BrandDealMetrics[] = [];
    
    for (let i = 0; i < numDeals; i++) {
      deals.push(
        await this.makeApiCall<BrandDealMetrics>(
          `brand/deals/${creatorId}/${i}`, 
          this.apiKeys.googleTrends
        )
      );
    }
    
    return deals;
  }
  
  // Aggregated creator metrics
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
        this.getTwitterMetrics(socialHandles.twitter).catch(e => null),
        this.getInstagramMetrics(socialHandles.instagram).catch(e => null),
        this.getYouTubeMetrics(socialHandles.youtube).catch(e => null),
        this.getTikTokMetrics(socialHandles.tiktok).catch(e => null),
        this.getSpotifyMetrics(creatorId).catch(e => null),
        this.getAppleMusicMetrics(creatorId).catch(e => null),
        this.getYouTubeMusicMetrics(socialHandles.youtube).catch(e => null),
        this.getBrandDeals(creatorId).catch(e => [])
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
export const externalApiService = new ExternalApiService();
