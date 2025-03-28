
import { faker } from '@faker-js/faker';

// Types for sentiment analysis
export interface PlatformSentiment {
  platform: string;
  score: number;
  change: number;
  posts: number;
  engagement: number;
}

export interface SentimentAlert {
  timestamp: string;
  message: string;
  change: number;
  source: string;
}

export interface CreatorSentimentData {
  summary: {
    overallScore: number;
    previousScore: number;
    change: number;
    lastUpdated: string;
    alerts: SentimentAlert[];
  };
  platforms: PlatformSentiment[];
  topics: {
    name: string;
    sentiment: number;
    volume: number;
  }[];
  recentMentions: {
    source: string;
    text: string;
    sentiment: number;
    timestamp: string;
  }[];
}

// Service implementation
class SentimentAnalysisService {
  // Get sentiment for a creator
  async getCreatorSentiment(creatorId: string): Promise<CreatorSentimentData> {
    await this.simulateApiDelay();
    return this.generateSentimentData(creatorId);
  }

  // Refresh sentiment data
  async refreshCreatorSentiment(creatorId: string): Promise<boolean> {
    await this.simulateApiDelay(2000);
    return true;
  }

  // Helper method to generate mock sentiment data
  private generateSentimentData(creatorId: string): CreatorSentimentData {
    const overallScore = faker.number.int({ min: 30, max: 95 });
    const previousScore = overallScore + (faker.number.int({ min: -15, max: 15 }));
    const change = overallScore - previousScore;

    // Generate platform data
    const platforms = ['Twitter', 'Instagram', 'YouTube', 'TikTok', 'Reddit', 'News Media'];
    const platformData: PlatformSentiment[] = platforms.map(platform => ({
      platform,
      score: faker.number.int({ min: 20, max: 100 }),
      change: faker.number.float({ min: -8, max: 8, fractionDigits: 1 }),
      posts: faker.number.int({ min: 50, max: 5000 }),
      engagement: faker.number.int({ min: 1000, max: 500000 })
    }));

    // Generate topic data
    const topics = ['Music', 'Style', 'Personality', 'Performance', 'Controversy', 'Philanthropy'];
    const topicData = topics.map(name => ({
      name,
      sentiment: faker.number.int({ min: 20, max: 95 }),
      volume: faker.number.int({ min: 100, max: 10000 })
    }));

    // Generate alerts
    const alertCount = faker.number.int({ min: 3, max: 8 });
    const alerts: SentimentAlert[] = Array.from({ length: alertCount }, () => {
      const isPositive = faker.datatype.boolean();
      return {
        timestamp: faker.date.recent({ days: 14 }).toISOString(),
        message: isPositive 
          ? faker.helpers.arrayElement([
              'Positive reaction to new content',
              'Favorable media coverage',
              'Viral social media post',
              'Successful brand collaboration announced',
              'Positive fan engagement spike'
            ])
          : faker.helpers.arrayElement([
              'Negative comments on recent post',
              'Controversial statement coverage',
              'Declining engagement trend',
              'Criticism from industry peers',
              'Unfavorable media coverage'
            ]),
        change: isPositive 
          ? faker.number.float({ min: 1, max: 15, fractionDigits: 1 }) 
          : faker.number.float({ min: -15, max: -1, fractionDigits: 1 }),
        source: faker.helpers.arrayElement(platforms)
      };
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Generate recent mentions
    const mentionCount = faker.number.int({ min: 5, max: 12 });
    const recentMentions = Array.from({ length: mentionCount }, () => {
      const sentimentScore = faker.number.int({ min: 0, max: 100 });
      return {
        source: faker.helpers.arrayElement(platforms),
        text: faker.helpers.arrayElement([
          `${faker.word.adjective()} performance by this creator!`,
          `Their new release is ${faker.word.adjective()}.`,
          `I ${faker.word.adverb()} ${faker.datatype.boolean() ? 'love' : 'dislike'} their content lately.`,
          `Their ${faker.commerce.productAdjective()} style is really ${faker.word.adjective()}.`,
          `Can't believe they ${faker.word.verb()} that collaboration!`
        ]),
        sentiment: sentimentScore,
        timestamp: faker.date.recent({ days: 7 }).toISOString()
      };
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return {
      summary: {
        overallScore,
        previousScore,
        change,
        lastUpdated: new Date().toISOString(),
        alerts
      },
      platforms: platformData,
      topics: topicData,
      recentMentions
    };
  }

  // Simulate API delay
  private async simulateApiDelay(ms: number = 800): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const sentimentAnalysisService = new SentimentAnalysisService();
