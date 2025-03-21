/**
 * Service for managing API keys and checking their availability
 */
export class APIKeysService {
  private static instance: APIKeysService;
  private apiKeys: Record<string, string | undefined> = {};

  // List of supported platforms
  public static readonly PLATFORMS = {
    // Social Media
    TWITTER: 'twitter',
    INSTAGRAM: 'instagram',
    YOUTUBE: 'youtube',
    TIKTOK: 'tiktok',
    SNAPCHAT: 'snapchat',
    
    // Streaming
    SPOTIFY: 'spotify',
    TWITCH: 'twitch',
    KICK: 'kick',
    RUMBLE: 'rumble',
    
    // Other
    GOOGLE_TRENDS: 'googleTrends',
  };

  private constructor() {
    // Initialize API keys from environment variables
    this.apiKeys = {
      [APIKeysService.PLATFORMS.TWITTER]: import.meta.env.VITE_TWITTER_API_KEY,
      [APIKeysService.PLATFORMS.INSTAGRAM]: import.meta.env.VITE_INSTAGRAM_API_KEY,
      [APIKeysService.PLATFORMS.YOUTUBE]: import.meta.env.VITE_YOUTUBE_API_KEY,
      [APIKeysService.PLATFORMS.TIKTOK]: import.meta.env.VITE_TIKTOK_API_KEY,
      [APIKeysService.PLATFORMS.SNAPCHAT]: import.meta.env.VITE_SNAPCHAT_API_KEY,
      [APIKeysService.PLATFORMS.SPOTIFY]: import.meta.env.VITE_SPOTIFY_API_KEY,
      [APIKeysService.PLATFORMS.TWITCH]: import.meta.env.VITE_TWITCH_API_KEY,
      [APIKeysService.PLATFORMS.KICK]: import.meta.env.VITE_KICK_API_KEY,
      [APIKeysService.PLATFORMS.RUMBLE]: import.meta.env.VITE_RUMBLE_API_KEY,
      [APIKeysService.PLATFORMS.GOOGLE_TRENDS]: import.meta.env.VITE_GOOGLE_TRENDS_API_KEY,
    };

    console.log('API Keys Service initialized');
  }

  // Singleton pattern
  public static getInstance(): APIKeysService {
    if (!APIKeysService.instance) {
      APIKeysService.instance = new APIKeysService();
    }
    return APIKeysService.instance;
  }

  /**
   * Get an API key for a specific platform
   * @param platform Platform identifier
   * @returns API key or undefined if not available
   */
  public getApiKey(platform: string): string | undefined {
    return this.apiKeys[platform];
  }

  /**
   * Check if a real API key is available for a platform
   * @param platform Platform identifier
   * @returns True if a valid API key is available
   */
  public hasRealApiKey(platform: string): boolean {
    const key = this.apiKeys[platform];
    return !!key && !key.startsWith('mock-');
  }

  /**
   * Get the status of configured API keys
   * @returns Object with counts of real and mock API keys
   */
  public getApiKeyStatus(): { real: number; mock: number; total: number } {
    const platforms = Object.values(APIKeysService.PLATFORMS);
    const realCount = platforms.filter(p => this.hasRealApiKey(p)).length;
    
    return {
      real: realCount,
      mock: platforms.length - realCount,
      total: platforms.length
    };
  }

  /**
   * List all platforms with available real API keys
   * @returns Array of platform identifiers
   */
  public getAvailablePlatforms(): string[] {
    return Object.values(APIKeysService.PLATFORMS).filter(
      platform => this.hasRealApiKey(platform)
    );
  }
}

// Export a singleton instance
export const apiKeysService = APIKeysService.getInstance();
