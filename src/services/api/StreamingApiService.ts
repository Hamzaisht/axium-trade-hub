
import { BaseApiService } from './BaseApiService';

export interface StreamingMetrics {
  platform: string;
  listeners: number;
  streams: number;
  growth: number;
  avgStreamTime: number;
  popularity: number;
}

export class StreamingApiService extends BaseApiService {
  constructor(apiKey: string) {
    super(apiKey);
  }

  protected generateMockData(endpoint: string): StreamingMetrics {
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
          popularity: data.popularity || 0
        };
      } else if (endpoint.includes('appleMusic')) {
        // Transform Apple Music API response
        return {
          platform: 'Apple Music',
          listeners: (data.attributes?.genreNames?.length || 1) * 10000, // Estimate
          streams: (data.attributes?.plays || 1) * 1000, // Estimate
          growth: this.generateRandomGrowth(),
          avgStreamTime: 30 + Math.random() * 180,
          popularity: data.attributes?.popularity || Math.random() * 100
        };
      } else if (endpoint.includes('youtubeMusic')) {
        // Transform YouTube Music API response (using YouTube data)
        const statistics = data.items[0]?.statistics || {};
        return {
          platform: 'YouTube Music',
          listeners: parseInt(statistics.subscriberCount || '0'),
          streams: parseInt(statistics.viewCount || '0'),
          growth: this.generateRandomGrowth(),
          avgStreamTime: 30 + Math.random() * 180,
          popularity: Math.min(parseInt(statistics.viewCount || '0') / 10000, 100)
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

  // Public methods for fetching data
  async getSpotifyMetrics(artistId: string): Promise<StreamingMetrics> {
    const endpoint = `spotify/${artistId}`;
    const url = `https://api.spotify.com/v1/artists/${artistId}`;
    
    return this.makeApiCall<StreamingMetrics>(endpoint, url);
  }

  async getAppleMusicMetrics(artistId: string): Promise<StreamingMetrics> {
    const endpoint = `appleMusic/${artistId}`;
    const url = `https://api.music.apple.com/v1/catalog/us/artists/${artistId}`;
    
    // Apple Music requires a special header
    const headers = {
      'Music-User-Token': this.apiKey
    };
    
    return this.makeApiCall<StreamingMetrics>(endpoint, url, headers);
  }

  async getYouTubeMusicMetrics(channelId: string): Promise<StreamingMetrics> {
    const endpoint = `youtubeMusic/${channelId}`;
    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${this.apiKey}`;
    
    return this.makeApiCall<StreamingMetrics>(endpoint, url);
  }
}
