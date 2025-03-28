
export interface AIInsight {
  id: string;
  type: 'sentiment' | 'engagement' | 'prediction' | 'alert' | 'news';
  message: string;
  impact: 'positive' | 'negative' | 'neutral';
  timestamp: string;
  confidence?: number;
}

const sentimentMessages = [
  { message: "Positive sentiment rising on Twitter", impact: "positive" },
  { message: "Negative comments increasing on YouTube", impact: "negative" },
  { message: "Neutral social media presence", impact: "neutral" },
  { message: "Strong positive reaction to latest content", impact: "positive" },
  { message: "Mixed reception to recent announcement", impact: "neutral" }
];

const engagementMessages = [
  { message: "Engagement +14% in last 24 hours", impact: "positive" },
  { message: "Follower growth accelerating", impact: "positive" },
  { message: "Engagement metrics declining", impact: "negative" },
  { message: "Watch time increasing significantly", impact: "positive" },
  { message: "Comment rate down -8% this week", impact: "negative" }
];

const predictionMessages = [
  { message: "Predicted uptrend over next 72 hours", impact: "positive" },
  { message: "Volatility expected to increase", impact: "neutral" },
  { message: "Possible price correction incoming", impact: "negative" },
  { message: "AI model predicts stable growth", impact: "positive" },
  { message: "Bearish indicators for short-term", impact: "negative" }
];

const alertMessages = [
  { message: "Unusual trading volume detected", impact: "neutral" },
  { message: "Market manipulation risk detected", impact: "negative" },
  { message: "New sponsor deal detected", impact: "positive" },
  { message: "Whale wallet accumulating tokens", impact: "positive" },
  { message: "Token liquidity decreasing rapidly", impact: "negative" }
];

const newsMessages = [
  { message: "Upcoming collaboration announced", impact: "positive" },
  { message: "Content schedule changed", impact: "neutral" },
  { message: "Platform algorithm change affecting views", impact: "negative" },
  { message: "New merch launch imminent", impact: "positive" },
  { message: "Community event scheduled", impact: "positive" }
];

const messagesByType = {
  sentiment: sentimentMessages,
  engagement: engagementMessages,
  prediction: predictionMessages,
  alert: alertMessages,
  news: newsMessages
};

export const getMockInsights = (
  creatorId: string,
  count = 5
): AIInsight[] => {
  const insights: AIInsight[] = [];
  const types = Object.keys(messagesByType) as Array<keyof typeof messagesByType>;
  
  // Use creatorId to seed the random data
  const seed = parseInt(creatorId.substring(0, 8), 16) || Date.now();
  const seedRandom = (max: number) => {
    const x = Math.sin(seed + insights.length) * 10000;
    return Math.floor((x - Math.floor(x)) * max);
  };
  
  for (let i = 0; i < count; i++) {
    const typeIndex = seedRandom(types.length);
    const type = types[typeIndex];
    
    const messagesForType = messagesByType[type];
    const messageIndex = seedRandom(messagesForType.length);
    const { message, impact } = messagesForType[messageIndex];
    
    // Generate timestamp within the last 24 hours
    const now = new Date();
    const timestamp = new Date(
      now.getTime() - seedRandom(24 * 60 * 60 * 1000)
    ).toISOString();
    
    // Random confidence between 65% and 95%
    const confidence = type === 'prediction' || type === 'sentiment' 
      ? 65 + seedRandom(30) 
      : undefined;
    
    insights.push({
      id: `insight-${type}-${i}-${seedRandom(1000)}`,
      type,
      message,
      impact: impact as 'positive' | 'negative' | 'neutral',
      timestamp,
      confidence
    });
  }
  
  // Sort by timestamp (newest first)
  insights.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  return insights;
};

// Pre-generated insights for immediate use
export const mockInsights: AIInsight[] = getMockInsights("default", 7);
