
import { BaseApiService } from './BaseApiService';
import { toast } from 'sonner';
import { APIKeysService, apiKeysService } from './APIKeysService';

export interface SocialMediaMetrics {
  platform: string;
  followers: number;
  engagement: number;
  growth: number;
  posts: number;
  recentEngagementRate: number;
  isRealData?: boolean;
}

export class SocialMediaApiService extends BaseApiService {
  constructor(apiKey: string = '', useProxyEndpoint = false) {
    super(apiKey, useProxyEndpoint);
  }

  protected generateMockData(endpoint: string): SocialMediaMetrics {
    const platform = endpoint.split('/')[1] || 'unknown';
    return {
      platform,
      followers: 50000 + Math.floor(Math.random() * 5000000),
      engagement: 1 + Math.random() * 8,
      growth: this.generateRandomGrowth(),
      posts: 10 + Math.floor(Math.random() * 100),
      recentEngagementRate: this.generateRandomEngagementRate(),
      isRealData: false
    };
  }

  protected transformApiResponse(endpoint: string, data: any): SocialMediaMetrics {
    try {
      if (endpoint.includes('twitter')) {
        // Transform Twitter API response
        const metrics = data.data?.public_metrics || {};
        return {
          platform: 'Twitter',
          followers: metrics.followers_count || 0,
          engagement: this.calculateEngagementRate(metrics.followers_count, metrics.tweet_count, metrics.listed_count),
          growth: this.generateRandomGrowth(), // Twitter doesn't provide growth directly
          posts: metrics.tweet_count || 0,
          recentEngagementRate: this.calculateRecentEngagementRate(metrics),
          isRealData: true
        };
      } else if (endpoint.includes('instagram')) {
        // Transform Instagram API response
        return {
          platform: 'Instagram',
          followers: data.followers_count || 0,
          engagement: this.calculateEngagementRate(data.followers_count, data.media_count, 0),
          growth: this.generateRandomGrowth(), // Instagram doesn't provide growth directly
          posts: data.media_count || 0,
          recentEngagementRate: this.generateRandomEngagementRate(),
          isRealData: true
        };
      } else if (endpoint.includes('youtube')) {
        // Transform YouTube API response
        const statistics = data.items?.[0]?.statistics || {};
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
          recentEngagementRate: this.generateRandomEngagementRate(),
          isRealData: true
        };
      } else if (endpoint.includes('tiktok')) {
        // Transform TikTok API response
        return {
          platform: 'TikTok',
          followers: data.follower_count || 0,
          engagement: this.calculateEngagementRate(data.follower_count, data.video_count, 0),
          growth: this.generateRandomGrowth(),
          posts: data.video_count || 0,
          recentEngagementRate: this.generateRandomEngagementRate(),
          isRealData: true
        };
      } else if (endpoint.includes('snapchat')) {
        // Transform Snapchat API response
        return {
          platform: 'Snapchat',
          followers: data.followers || 0,
          engagement: data.engagement || this.generateRandomEngagementRate(),
          growth: data.growth || this.generateRandomGrowth(),
          posts: data.stories || 0,
          recentEngagementRate: data.recent_engagement || this.generateRandomEngagementRate(),
          isRealData: true
        };
      }
      
      // If no specific transformation is available, return generic data
      return this.generateMockData(endpoint);
    } catch (error) {
      console.error('Error transforming API response:', error);
      // Return mock data as fallback
      return this.generateMockData(endpoint);
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

  // Public methods for fetching data
  async getTwitterMetrics(username: string): Promise<SocialMediaMetrics> {
    const endpoint = `twitter/${username}`;
    const platform = APIKeysService.PLATFORMS.TWITTER;
    
    // Check if we have a real API key
    if (this.isRealApiKey(platform)) {
      const url = `https://api.twitter.com/2/users/by/username/${username}?user.fields=public_metrics`;
      return this.makeApiCall<SocialMediaMetrics>(endpoint, url, {}, 3, platform);
    } else {
      // Fall back to mock data if no API key
      console.log(`Using mock data for Twitter (no API key)`);
      return Promise.resolve({
        ...this.generateMockData(endpoint),
        platform: 'Twitter'
      });
    }
  }

  async getInstagramMetrics(username: string): Promise<SocialMediaMetrics> {
    const endpoint = `instagram/${username}`;
    const platform = APIKeysService.PLATFORMS.INSTAGRAM;
    
    // Check if we have a real API key
    if (this.isRealApiKey(platform)) {
      const apiKey = apiKeysService.getApiKey(platform);
      const url = `https://graph.instagram.com/${username}?fields=followers_count,media_count&access_token=${apiKey}`;
      return this.makeApiCall<SocialMediaMetrics>(endpoint, url, {}, 3, platform);
    } else {
      // Fall back to mock data if no API key
      console.log(`Using mock data for Instagram (no API key)`);
      return Promise.resolve({
        ...this.generateMockData(endpoint),
        platform: 'Instagram'
      });
    }
  }

  async getYouTubeMetrics(channelId: string): Promise<SocialMediaMetrics> {
    const endpoint = `youtube/${channelId}`;
    const platform = APIKeysService.PLATFORMS.YOUTUBE;
    
    // Check if we have a real API key
    if (this.isRealApiKey(platform)) {
      const apiKey = apiKeysService.getApiKey(platform);
      const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`;
      return this.makeApiCall<SocialMediaMetrics>(endpoint, url, {}, 3, platform);
    } else {
      // Fall back to mock data if no API key
      console.log(`Using mock data for YouTube (no API key)`);
      return Promise.resolve({
        ...this.generateMockData(endpoint),
        platform: 'YouTube'
      });
    }
  }

  async getTikTokMetrics(username: string): Promise<SocialMediaMetrics> {
    const endpoint = `tiktok/${username}`;
    const platform = APIKeysService.PLATFORMS.TIKTOK;
    
    // Check if we have a real API key
    if (this.isRealApiKey(platform)) {
      const apiKey = apiKeysService.getApiKey(platform);
      const url = `https://open.tiktokapis.com/v2/user/info/?fields=follower_count,video_count&username=${username}`;
      const headers = {
        'Authorization': `Bearer ${apiKey}`
      };
      return this.makeApiCall<SocialMediaMetrics>(endpoint, url, headers, 3, platform);
    } else {
      // Fall back to mock data if no API key
      console.log(`Using mock data for TikTok (no API key)`);
      return Promise.resolve({
        ...this.generateMockData(endpoint),
        platform: 'TikTok'
      });
    }
  }

  async getSnapchatMetrics(username: string): Promise<SocialMediaMetrics> {
    const endpoint = `snapchat/${username}`;
    const platform = APIKeysService.PLATFORMS.SNAPCHAT;
    
    // Check if we have a real API key
    if (this.isRealApiKey(platform)) {
      const apiKey = apiKeysService.getApiKey(platform);
      // Note: Snapchat doesn't have a public API, this is a placeholder
      const url = `https://api.snapchat.com/v1/users/${username}?key=${apiKey}`;
      return this.makeApiCall<SocialMediaMetrics>(endpoint, url, {}, 3, platform);
    } else {
      // Fall back to mock data if no API key
      console.log(`Using mock data for Snapchat (no API key)`);
      return Promise.resolve({
        ...this.generateMockData(endpoint),
        platform: 'Snapchat'
      });
    }
  }
  
  // Add getter method for creator metrics
  async getCreatorMetrics(creatorId: string): Promise<SocialMediaMetrics[]> {
    try {
      // For now, just return metrics for the major platforms
      const twitterMetrics = await this.getTwitterMetrics(creatorId);
      const instagramMetrics = await this.getInstagramMetrics(creatorId);
      const youtubeMetrics = await this.getYouTubeMetrics(creatorId);
      const tiktokMetrics = await this.getTikTokMetrics(creatorId);
      const snapchatMetrics = await this.getSnapchatMetrics(creatorId);
      
      return [
        twitterMetrics,
        instagramMetrics,
        youtubeMetrics,
        tiktokMetrics,
        snapchatMetrics
      ];
    } catch (error) {
      console.error('Error fetching social media metrics:', error);
      toast.error('Error fetching social media data');
      return [];
    }
  }
}
