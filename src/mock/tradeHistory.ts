
export interface Trade {
  id: string;
  price: number;
  quantity: number;
  side: 'buy' | 'sell';
  timestamp: string;
  total: number;
}

const generateMockTrade = (
  basePrice: number, 
  index: number
): Trade => {
  // Fluctuate price around base price
  const priceVariation = (Math.random() - 0.5) * 0.1 * basePrice;
  const price = parseFloat((basePrice + priceVariation).toFixed(2));
  
  // Random quantity between 1 and 100
  const quantity = Math.floor(Math.random() * 100) + 1;
  
  // Random side (buy or sell)
  const side: 'buy' | 'sell' = Math.random() > 0.5 ? 'buy' : 'sell';
  
  // Generate timestamp within the last hour
  const now = new Date();
  const timestamp = new Date(
    now.getTime() - (index * 2 * 60 * 1000) // Each trade 2 minutes apart
  ).toISOString();
  
  return {
    id: `trade-${Date.now()}-${index}`,
    price,
    quantity,
    side,
    timestamp,
    total: parseFloat((price * quantity).toFixed(2))
  };
};

export const getMockTradeHistory = (
  creatorId: string,
  count = 20,
  basePrice = 25.75
): Trade[] => {
  // Use creatorId to seed the random data
  const seed = creatorId.charCodeAt(0) % 10;
  basePrice = basePrice + (seed - 5);
  
  const trades: Trade[] = [];
  
  for (let i = 0; i < count; i++) {
    trades.push(generateMockTrade(basePrice, i));
  }
  
  return trades;
};

// Pre-generated trades for immediate use
export const mockTradeHistory: Trade[] = getMockTradeHistory("default", 20);
