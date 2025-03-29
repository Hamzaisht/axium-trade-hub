
import { Trade } from "@/mock/tradeHistory";
import { AIInsight } from "@/mock/insights";

export interface Creator {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  marketCap: number;
  followers: string;
  engagement: number;
  aiScore: number;
  // Add additional fields that might be used for insights
  socialMetrics?: {
    currentEngagement: number;
    previousEngagement: number;
    growthRate: number;
    brandMentions: number;
    previousBrandMentions: number;
    sentiment: number;
    previousSentiment: number;
  };
  tradeMetrics?: {
    volume24h: number;
    previousVolume24h: number;
    buyPercentage: number;
    previousBuyPercentage: number;
  };
  priceMetrics?: {
    volatility: number;
    previousVolatility: number;
    support: number;
    resistance: number;
  };
}

export interface ClaudeInsight extends AIInsight {
  category: 'engagement' | 'valuation' | 'trend' | 'prediction' | 'risk';
  source: 'claude' | 'mock';
}

// Mocked logic to simulate Claude AI insights generation
export function generateClaudeInsights(creator?: Creator, recentTrades?: Trade[]): ClaudeInsight[] {
  if (!creator) return [];
  
  const now = new Date();
  const insights: ClaudeInsight[] = [];
  
  // Simple mock insights generator
  const mockInsightData = [
    // Engagement insights
    {
      category: 'engagement',
      type: 'engagement',
      message: creator.socialMetrics?.currentEngagement && creator.socialMetrics.previousEngagement 
        ? `Engagement ${creator.socialMetrics.currentEngagement > creator.socialMetrics.previousEngagement ? 'increased' : 'decreased'} by ${Math.abs(Math.round((creator.socialMetrics.currentEngagement - creator.socialMetrics.previousEngagement) / creator.socialMetrics.previousEngagement * 100))}% in the last 24h`
        : `Engagement trend shows ${Math.random() > 0.5 ? 'positive' : 'negative'} momentum with ${Math.floor(Math.random() * 15) + 5}% change`,
      impact: Math.random() > 0.4 ? 'positive' : 'negative',
    },
    
    // Valuation insights
    {
      category: 'valuation',
      type: 'prediction',
      message: creator.socialMetrics?.brandMentions && creator.socialMetrics.previousBrandMentions 
        ? `Valuation spike driven by ${Math.round((creator.socialMetrics.brandMentions - creator.socialMetrics.previousBrandMentions) / creator.socialMetrics.previousBrandMentions * 100)}% increase in brand mentions across platforms`
        : `AI model predicts ${Math.floor(Math.random() * 20) + 5}% valuation ${Math.random() > 0.6 ? 'growth' : 'correction'} based on market sentiment`,
      impact: Math.random() > 0.5 ? 'positive' : 'negative',
    },
    
    // Trend insights
    {
      category: 'trend',
      type: 'sentiment',
      message: creator.socialMetrics?.sentiment && creator.socialMetrics.previousSentiment
        ? `Social sentiment has ${creator.socialMetrics.sentiment > creator.socialMetrics.previousSentiment ? 'improved' : 'declined'} by ${Math.abs(Math.round((creator.socialMetrics.sentiment - creator.socialMetrics.previousSentiment) * 10))} points in last 48h`
        : `Social sentiment trending ${Math.random() > 0.5 ? 'positive' : 'negative'} across ${Math.floor(Math.random() * 3) + 2} major platforms`,
      impact: Math.random() > 0.5 ? 'positive' : 'negative',
    },
    
    // Predictive insights
    {
      category: 'prediction',
      type: 'prediction',
      message: recentTrades && recentTrades.length > 0
        ? `Pattern analysis suggests ${Math.random() > 0.5 ? 'bullish' : 'bearish'} trend over next ${Math.floor(Math.random() * 48) + 24}h based on recent trade volume`
        : `AI models project ${Math.random() > 0.5 ? 'sustained growth' : 'short-term volatility'} in next trading session`,
      impact: Math.random() > 0.6 ? 'positive' : Math.random() > 0.5 ? 'neutral' : 'negative',
    },
    
    // Risk insights
    {
      category: 'risk',
      type: 'alert',
      message: creator.tradeMetrics?.buyPercentage && creator.tradeMetrics.previousBuyPercentage
        ? `Buy/sell ratio has ${creator.tradeMetrics.buyPercentage > creator.tradeMetrics.previousBuyPercentage ? 'increased' : 'decreased'} by ${Math.abs(Math.round((creator.tradeMetrics.buyPercentage - creator.tradeMetrics.previousBuyPercentage) * 100))}%, indicating ${creator.tradeMetrics.buyPercentage > creator.tradeMetrics.previousBuyPercentage ? 'growing' : 'declining'} market confidence`
        : `Volatility metrics show ${Math.random() > 0.5 ? 'lower than average' : 'higher than usual'} risk profile`,
      impact: Math.random() > 0.7 ? 'positive' : Math.random() > 0.4 ? 'neutral' : 'negative',
    }
  ];
  
  // Create mock insights from the data
  for (let i = 0; i < mockInsightData.length; i++) {
    const mockData = mockInsightData[i];
    const minutesAgo = Math.floor(Math.random() * 180); // Random time within last 3 hours
    
    insights.push({
      id: `claude-insight-${i}-${Date.now()}`,
      category: mockData.category as any,
      type: mockData.type as any,
      message: mockData.message,
      impact: mockData.impact as any,
      timestamp: new Date(now.getTime() - minutesAgo * 60 * 1000).toISOString(),
      confidence: Math.floor(Math.random() * 15) + 80, // 80-95% confidence
      source: 'mock' // This would be 'claude' when actually using the API
    });
  }
  
  // Sort by timestamp (newest first)
  insights.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  return insights;
}

// This would be the actual function to call Claude API when integrated
export async function getClaudeInsights(creator?: Creator, recentTrades?: Trade[]): Promise<ClaudeInsight[]> {
  // For now, just return mock insights
  // In the future, this would call a Claude API endpoint
  return generateClaudeInsights(creator, recentTrades);
}
