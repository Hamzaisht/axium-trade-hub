import { BaseApiService } from './BaseApiService';
import { toast } from 'sonner';

export interface SocialMediaMetrics {
  platform: string;
  followers: number;
  engagement: number;
  growth: number;
  posts: number;
  recentEngagementRate: number;
}

export class SocialMediaApiService extends BaseApiService {
  constructor(apiKey: string, useProxyEndpoint = false) {
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
      recentEngagementRate: this.generateRandomEngagementRate()
    };
  }

  protected transformApiResponse(endpoint: string, data: any): SocialMediaMetrics {
    try {
      if (endpoint.includes('twitter')) {
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
      } else if (endpoint.includes('instagram')) {
        // Transform Instagram API response
        return {
          platform: 'Instagram',
          followers: data.followers_count || 0,
          engagement: this.calculateEngagementRate(data.followers_count, data.media_count, 0),
          growth: this.generateRandomGrowth(), // Instagram doesn't provide growth directly
          posts: data.media_count || 0,
          recentEngagementRate: this.generateRandomEngagementRate()
        };
      } else if (endpoint.includes('youtube')) {
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
      } else if (endpoint.includes('tiktok')) {
        // Transform TikTok API response
        return {
          platform: 'TikTok',
          followers: data.follower_count || 0,
          engagement: this.calculateEngagementRate(data.follower_count, data.video_count, 0),
          growth: this.generateRandomGrowth(),
          posts: data.video_count || 0,
          recentEngagementRate: this.generateRandomEngagementRate()
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
    const url = `https://api.twitter.com/2/users/by/username/${username}?user.fields=public_metrics`;
    
    return this.makeApiCall<SocialMediaMetrics>(endpoint, url);
  }

  async getInstagramMetrics(username: string): Promise<SocialMediaMetrics> {
    const endpoint = `instagram/${username}`;
    const url = `https://graph.instagram.com/${username}?fields=followers_count,media_count&access_token=${this.apiKey}`;
    
    return this.makeApiCall<SocialMediaMetrics>(endpoint, url);
  }

  async getYouTubeMetrics(channelId: string): Promise<SocialMediaMetrics> {
    const endpoint = `youtube/${channelId}`;
    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${this.apiKey}`;
    
    return this.makeApiCall<SocialMediaMetrics>(endpoint, url);
  }

  async getTikTokMetrics(username: string): Promise<SocialMediaMetrics> {
    const endpoint = `tiktok/${username}`;
    const url = `https://open.tiktokapis.com/v2/user/info/?fields=follower_count,video_count&username=${username}`;
    
    return this.makeApiCall<SocialMediaMetrics>(endpoint, url);
  }
}
