
import { Creator } from "@/utils/ClaudeInsights";

export const getMockCreator = (id: string): Creator => {
  // Generate consistent but random-looking data based on creator ID
  const seedNumber = parseInt(id.replace(/\D/g, '').substring(0, 4) || '1234', 10);
  const normalizedSeed = seedNumber / 10000; // Between 0 and 1
  
  // Base values
  const basePrice = 15 + (normalizedSeed * 30); // $15 to $45
  const baseEngagement = 20 + (normalizedSeed * 60); // 20% to 80%
  const baseFollowers = 100000 + (normalizedSeed * 900000); // 100K to 1M
  
  // Calculate change (recent movement)
  const changeBias = Math.sin(seedNumber); // Between -1 and 1
  const change = changeBias * 15; // -15% to +15%
  
  // Calculate market cap
  const marketCap = basePrice * baseFollowers * 0.01;
  
  // Format followers into a readable string
  const formatFollowers = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };
  
  // AI score (0-100)
  const aiScore = Math.floor(50 + (normalizedSeed + changeBias) * 25);
  
  return {
    id,
    name: `Creator ${id.substring(0, 5)}`,
    symbol: `CR${id.substring(0, 3)}`,
    price: parseFloat(basePrice.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    marketCap: parseFloat(marketCap.toFixed(2)),
    followers: formatFollowers(Math.floor(baseFollowers)),
    engagement: parseFloat(baseEngagement.toFixed(2)),
    aiScore,
    socialMetrics: {
      currentEngagement: baseEngagement,
      previousEngagement: baseEngagement * (0.8 + Math.random() * 0.4),
      growthRate: 5 + (normalizedSeed * 15),
      brandMentions: 120 + Math.floor(normalizedSeed * 400),
      previousBrandMentions: 100 + Math.floor(normalizedSeed * 350),
      sentiment: 0.2 + (normalizedSeed * 0.6),
      previousSentiment: 0.15 + (normalizedSeed * 0.55)
    },
    tradeMetrics: {
      volume24h: 50000 + Math.floor(normalizedSeed * 200000),
      previousVolume24h: 45000 + Math.floor(normalizedSeed * 180000),
      buyPercentage: 0.4 + (normalizedSeed * 0.4),
      previousBuyPercentage: 0.35 + (normalizedSeed * 0.4)
    },
    priceMetrics: {
      volatility: 0.05 + (normalizedSeed * 0.15),
      previousVolatility: 0.04 + (normalizedSeed * 0.14),
      support: basePrice * 0.9,
      resistance: basePrice * 1.1
    }
  };
};

export const mockCreators: Record<string, Creator> = {
  "creator1": getMockCreator("creator1"),
  "creator2": getMockCreator("creator2"),
  "creator3": getMockCreator("creator3"),
  "default": getMockCreator("default")
};

export const getCreatorById = (id?: string): Creator | undefined => {
  if (!id) return mockCreators["default"];
  return mockCreators[id] || getMockCreator(id);
};
