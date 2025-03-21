
import { BaseApiService } from './BaseApiService';
import { APIKeysService, apiKeysService } from './APIKeysService';

export interface StreamingMetrics {
  platform: string;
  listeners: number;
  streams: number;
  growth: number;
  avgStreamTime: number;
  popularity: number;
  isRealData?: boolean;
}

export class StreamingApiService extends BaseApiService {
  constructor(apiKey: string = '', useProxyEndpoint = false) {
    super(apiKey, useProxyEndpoint);
  }

  protected generateMockData(endpoint: string): StreamingMetrics {
    const platform = endpoint.split('/')[1] || 'unknown';
    return {
      platform,
      listeners: 10000 + Math.floor(Math.random() * 1000000),
      streams: 50000 + Math.floor(Math.random() * 10000000),
      growth: -5 + Math.random() * 25,
      avgStreamTime: 30 + Math.random() * 180,
      popularity: Math.random() * 100,
      isRealData: false
    };
  }

  protected transformApiResponse(endpoint: string, data: any): StreamingMetrics {
    try {
      if (endpoint.includes('spotify')) {
        // Transform Spotify API response
        return {
          platform: 'Spotify',
          listeners: data.followers?.total || 0,
          streams: data.popularity * 100000 || 0, // Estimated from popularity
          growth: this.generateRandomGrowth(),
          avgStreamTime: 30 + Math.random() * 180, // Spotify doesn't provide this
          popularity: data.popularity || 0,
          isRealData: true
        };
      } else if (endpoint.includes('appleMusic')) {
        // Transform Apple Music API response
        return {
          platform: 'Apple Music',
          listeners: (data.attributes?.genreNames?.length || 1) * 10000, // Estimate
          streams: (data.attributes?.plays || 1) * 1000, // Estimate
          growth: this.generateRandomGrowth(),
          avgStreamTime: 30 + Math.random() * 180,
          popularity: data.attributes?.popularity || Math.random() * 100,
          isRealData: true
        };
      } else if (endpoint.includes('youtubeMusic')) {
        // Transform YouTube Music API response (using YouTube data)
        const statistics = data.items?.[0]?.statistics || {};
        return {
          platform: 'YouTube Music',
          listeners: parseInt(statistics.subscriberCount || '0'),
          streams: parseInt(statistics.viewCount || '0'),
          growth: this.generateRandomGrowth(),
          avgStreamTime: 30 + Math.random() * 180,
          popularity: Math.min(parseInt(statistics.viewCount || '0') / 10000, 100),
          isRealData: true
        };
      } else if (endpoint.includes('twitch')) {
        // Transform Twitch API response
        return {
          platform: 'Twitch',
          listeners: data.followers || 0,
          streams: data.views || 0,
          growth: data.follower_growth || this.generateRandomGrowth(),
          avgStreamTime: data.average_stream_length || (30 + Math.random() * 180),
          popularity: data.popularity || Math.random() * 100,
          isRealData: true
        };
      } else if (endpoint.includes('kick')) {
        // Transform Kick API response
        return {
          platform: 'Kick',
          listeners: data.followers || 0,
          streams: data.views || 0,
          growth: data.growth || this.generateRandomGrowth(),
          avgStreamTime: data.avg_stream_time || (30 + Math.random() * 180),
          popularity: data.popularity || Math.random() * 100,
          isRealData: true
        };
      } else if (endpoint.includes('rumble')) {
        // Transform Rumble API response
        return {
          platform: 'Rumble',
          listeners: data.subscribers || 0,
          streams: data.views || 0,
          growth: data.growth || this.generateRandomGrowth(),
          avgStreamTime: data.avg_time || (30 + Math.random() * 180),
          popularity: data.popularity || Math.random() * 100,
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

  async getSpotifyMetrics(artistId: string): Promise<StreamingMetrics> {
    const endpoint = `spotify/${artistId}`;
    const platform = APIKeysService.PLATFORMS.SPOTIFY;
    
    // Check if we have a real API key
    if (this.isRealApiKey(platform)) {
      const apiKey = apiKeysService.getApiKey(platform);
      const url = `https://api.spotify.com/v1/artists/${artistId}`;
      const headers = {
        'Authorization': `Bearer ${apiKey}`
      };
      return this.makeApiCall<StreamingMetrics>(endpoint, url, headers, 3, platform);
    } else {
      // Fall back to mock data
      console.log(`Using mock data for Spotify (no API key)`);
      return Promise.resolve({
        ...this.generateMockData(endpoint),
        platform: 'Spotify'
      });
    }
  }

  async getAppleMusicMetrics(artistId: string): Promise<StreamingMetrics> {
    const endpoint = `appleMusic/${artistId}`;
    
    // Apple Music requires a special header
    const headers = {
      'Music-User-Token': this.apiKey
    };
    
    const url = `https://api.music.apple.com/v1/catalog/us/artists/${artistId}`;
    return this.makeApiCall<StreamingMetrics>(endpoint, url, headers);
  }

  async getYouTubeMusicMetrics(channelId: string): Promise<StreamingMetrics> {
    const endpoint = `youtubeMusic/${channelId}`;
    const platform = APIKeysService.PLATFORMS.YOUTUBE;
    
    // Check if we have a real API key
    if (this.isRealApiKey(platform)) {
      const apiKey = apiKeysService.getApiKey(platform);
      const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`;
      return this.makeApiCall<StreamingMetrics>(endpoint, url, {}, 3, platform);
    } else {
      // Fall back to mock data
      console.log(`Using mock data for YouTube Music (no API key)`);
      return Promise.resolve({
        ...this.generateMockData(endpoint),
        platform: 'YouTube Music'
      });
    }
  }

  async getTwitchMetrics(username: string): Promise<StreamingMetrics> {
    const endpoint = `twitch/${username}`;
    const platform = APIKeysService.PLATFORMS.TWITCH;
    
    // Check if we have a real API key
    if (this.isRealApiKey(platform)) {
      const apiKey = apiKeysService.getApiKey(platform);
      const url = `https://api.twitch.tv/helix/users?login=${username}`;
      const headers = {
        'Client-ID': apiKey.split(':')[0] || apiKey,
        'Authorization': `Bearer ${apiKey.split(':')[1] || apiKey}`
      };
      return this.makeApiCall<StreamingMetrics>(endpoint, url, headers, 3, platform);
    } else {
      // Fall back to mock data
      console.log(`Using mock data for Twitch (no API key)`);
      return Promise.resolve({
        ...this.generateMockData(endpoint),
        platform: 'Twitch'
      });
    }
  }

  async getKickMetrics(username: string): Promise<StreamingMetrics> {
    const endpoint = `kick/${username}`;
    const platform = APIKeysService.PLATFORMS.KICK;
    
    // Check if we have a real API key
    if (this.isRealApiKey(platform)) {
      const apiKey = apiKeysService.getApiKey(platform);
      // Note: Kick doesn't have a public API yet, this is a placeholder
      const url = `https://api.kick.com/v1/channels/${username}?api_key=${apiKey}`;
      return this.makeApiCall<StreamingMetrics>(endpoint, url, {}, 3, platform);
    } else {
      // Fall back to mock data
      console.log(`Using mock data for Kick (no API key)`);
      return Promise.resolve({
        ...this.generateMockData(endpoint),
        platform: 'Kick'
      });
    }
  }

  async getRumbleMetrics(channelId: string): Promise<StreamingMetrics> {
    const endpoint = `rumble/${channelId}`;
    const platform = APIKeysService.PLATFORMS.RUMBLE;
    
    // Check if we have a real API key
    if (this.isRealApiKey(platform)) {
      const apiKey = apiKeysService.getApiKey(platform);
      // Note: Rumble doesn't have a public API yet, this is a placeholder
      const url = `https://api.rumble.com/v1/channels/${channelId}?api_key=${apiKey}`;
      return this.makeApiCall<StreamingMetrics>(endpoint, url, {}, 3, platform);
    } else {
      // Fall back to mock data
      console.log(`Using mock data for Rumble (no API key)`);
      return Promise.resolve({
        ...this.generateMockData(endpoint),
        platform: 'Rumble'
      });
    }
  }
  
  // Add getter method for creator metrics
  async getCreatorMetrics(creatorId: string): Promise<StreamingMetrics[]> {
    try {
      // For now, just return metrics for the major platforms
      const spotifyMetrics = await this.getSpotifyMetrics(creatorId);
      const youtubeMusicMetrics = await this.getYouTubeMusicMetrics(creatorId);
      const twitchMetrics = await this.getTwitchMetrics(creatorId);
      const kickMetrics = await this.getKickMetrics(creatorId);
      const rumbleMetrics = await this.getRumbleMetrics(creatorId);
      
      return [
        spotifyMetrics,
        youtubeMusicMetrics,
        twitchMetrics,
        kickMetrics,
        rumbleMetrics
      ];
    } catch (error) {
      console.error('Error fetching streaming metrics:', error);
      return [];
    }
  }
}
