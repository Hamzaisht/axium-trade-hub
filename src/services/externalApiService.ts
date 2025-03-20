
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
    twitter: import.meta.env.VITE_TWITTER_API_KEY || 'mock-twitter-key',
    instagram: import.meta.env.VITE_INSTAGRAM_API_KEY || 'mock-instagram-key',
    youtube: import.meta.env.VITE_YOUTUBE_API_KEY || 'mock-youtube-key',
    tiktok: import.meta.env.VITE_TIKTOK_API_KEY || 'mock-tiktok-key',
    spotify: import.meta.env.VITE_SPOTIFY_API_KEY || 'mock-spotify-key',
    appleMusic: import.meta.env.VITE_APPLE_MUSIC_API_KEY || 'mock-apple-music-key',
    googleTrends: import.meta.env.VITE_GOOGLE_TRENDS_API_KEY || 'mock-google-trends-key',
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

  // Real API call with error handling and retry logic
  private async makeApiCall<T>(
    endpoint: string, 
    apiKey: string, 
    retries = 3
  ): Promise<T> {
    // Check cache first
    const cacheKey = `${endpoint}-${apiKey}`;
    const cachedData = this.getCachedData<T>(cacheKey);
    if (cachedData) return cachedData;

    try {
      // Determine which API to call based on the endpoint
      let apiUrl = '';
      let headers: Record<string, string> = {
        'Authorization': `Bearer ${apiKey}`
      };
      
      // Build the appropriate API URL based on the endpoint
      if (endpoint.includes('social/twitter')) {
        const username = endpoint.split('/')[2];
        apiUrl = `https://api.twitter.com/2/users/by/username/${username}?user.fields=public_metrics`;
      } else if (endpoint.includes('social/instagram')) {
        const username = endpoint.split('/')[2];
        apiUrl = `https://graph.instagram.com/${username}?fields=followers_count,media_count&access_token=${apiKey}`;
      } else if (endpoint.includes('social/youtube')) {
        const channelId = endpoint.split('/')[2];
        apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`;
      } else if (endpoint.includes('social/tiktok')) {
        const username = endpoint.split('/')[2];
        apiUrl = `https://open.tiktokapis.com/v2/user/info/?fields=follower_count,video_count&username=${username}`;
      } else if (endpoint.includes('streaming/spotify')) {
        const artistId = endpoint.split('/')[2];
        apiUrl = `https://api.spotify.com/v1/artists/${artistId}`;
      } else if (endpoint.includes('streaming/appleMusic')) {
        const artistId = endpoint.split('/')[2];
        apiUrl = `https://api.music.apple.com/v1/catalog/us/artists/${artistId}`;
        headers = {
          ...headers,
          'Music-User-Token': apiKey
        };
      } else if (endpoint.includes('brand/deals')) {
        // For brand deals, we're using Google Trends API or similar
        const creatorId = endpoint.split('/')[2];
        apiUrl = `https://trends.google.com/trends/api/explore?q=${creatorId}&geo=US`;
      }
      
      // If we're in development or have missing API keys, use mock data
      if (
        import.meta.env.DEV || 
        !apiKey || 
        apiKey.startsWith('mock-') || 
        !apiUrl
      ) {
        console.log(`Using mock data for ${endpoint} (development mode or missing API key)`);
        return this.generateMockDataBasedOnEndpoint(endpoint);
      }
      
      console.log(`Making API call to ${apiUrl}`);
      
      // Make the actual API call
      const response = await fetch(apiUrl, { headers });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Transform the API response into our standardized format
      const transformedData = this.transformApiResponse(endpoint, data);
      
      // Cache the result
      this.setCachedData(cacheKey, transformedData);
      return transformedData as T;
    } catch (error) {
      console.error(`API error (${endpoint}):`, error);
      
      // Retry logic
      if (retries > 0) {
        console.log(`Retrying ${endpoint} (${retries} attempts left)...`);
        return this.makeApiCall<T>(endpoint, apiKey, retries - 1);
      }
      
      // After retries are exhausted, throw the error
      toast.error(`Failed to fetch data from ${endpoint.split('/')[0]}`);
      
      // Fall back to mock data on API failure
      console.log(`Falling back to mock data for ${endpoint}`);
      return this.generateMockDataBasedOnEndpoint(endpoint);
    }
  }
  
  // Helper to transform API responses into our standardized format
  private transformApiResponse(endpoint: string, data: any): any {
    try {
      if (endpoint.includes('social/twitter')) {
        // Transform Twitter API response
        const metrics = data.data.public_metrics || {};
        return {
          platform: 'Twitter',
          followers: metrics.followers_count || 0,
          engagement: this.calculateEngagementRate(metrics.followers_count, metrics.tweet_count, metrics.listed_count),
          growth: this.generateRandomGrowth(), // Twitter doesn't provide growth directly
          posts: metrics.tweet_count || 0,
          recentEngagementRate: this.calculateRecentEngagementRate(metrics)
        };
      } else if (endpoint.includes('social/instagram')) {
        // Transform Instagram API response
        return {
          platform: 'Instagram',
          followers: data.followers_count || 0,
          engagement: this.calculateEngagementRate(data.followers_count, data.media_count, 0),
          growth: this.generateRandomGrowth(), // Instagram doesn't provide growth directly
          posts: data.media_count || 0,
          recentEngagementRate: this.generateRandomEngagementRate()
        };
      } else if (endpoint.includes('social/youtube')) {
        // Transform YouTube API response
        const statistics = data.items[0]?.statistics || {};
        return {
          platform: 'YouTube',
          followers: parseInt(statistics.subscriberCount || '0'),
          engagement: this.calculateEngagementRate(
            parseInt(statistics.subscriberCount || '0'),
            parseInt(statistics.videoCount || '0'),
            parseInt(statistics.viewCount || '0')
          ),
          growth: this.generateRandomGrowth(),
          posts: parseInt(statistics.videoCount || '0'),
          recentEngagementRate: this.generateRandomEngagementRate()
        };
      }
      // Add other platform transformations as needed
      
      // If no specific transformation is available, return the data as is
      return data;
    } catch (error) {
      console.error('Error transforming API response:', error);
      // Return mock data as fallback
      return this.generateMockDataBasedOnEndpoint(endpoint);
    }
  }
  
  // Helper methods for calculations
  private calculateEngagementRate(followers: number, posts: number, additionalMetric: number): number {
    if (!followers || followers === 0) return 0;
    // Simple engagement formula that can be improved with real metrics
    return ((posts * 0.5) + (additionalMetric * 0.2)) / followers * 100;
  }
  
  private calculateRecentEngagementRate(metrics: any): number {
    // This would use recent engagement metrics if available
    return 0.5 + Math.random() * 10; // For now returning random rate
  }
  
  private generateRandomGrowth(): number {
    return -2 + Math.random() * 15;
  }
  
  private generateRandomEngagementRate(): number {
    return 0.5 + Math.random() * 10;
  }

  // Determine which mock data generator to use based on the endpoint
  private generateMockDataBasedOnEndpoint(endpoint: string): any {
    if (endpoint.includes('social')) {
      return this.generateMockSocialData(endpoint);
    } else if (endpoint.includes('streaming')) {
      return this.generateMockStreamingData(endpoint);
    } else if (endpoint.includes('brand')) {
      return this.generateMockBrandDealData(endpoint);
    } else {
      return { message: 'Unknown endpoint' };
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
  
  // Method to check if we have valid API keys (non-mock)
  areRealApisConfigured(): boolean {
    return Object.values(this.apiKeys).some(key => key && !key.startsWith('mock-'));
  }
}

// Export a singleton instance
export const externalApiService = new ExternalApiService();
