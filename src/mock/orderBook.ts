
export interface Order {
  price: number;
  quantity: number;
  total: number;
  timestamp: string;
}

export interface OrderBook {
  bids: Order[];
  asks: Order[];
  spread: number;
  lastUpdated: string;
}

const generateOrder = (
  basePrice: number, 
  isBid: boolean, 
  index: number
): Order => {
  // Bids are below market price, asks are above
  const priceOffset = (isBid ? -1 : 1) * (0.05 * (index + 1));
  const price = parseFloat((basePrice * (1 + priceOffset)).toFixed(2));
  
  // Generate larger quantities near market price
  const quantity = Math.floor(
    (Math.random() * 1000) / (index + 1) + 10
  );
  
  return {
    price,
    quantity,
    total: parseFloat((price * quantity).toFixed(2)),
    timestamp: new Date().toISOString()
  };
};

export const getMockOrderBook = (
  creatorId?: string, 
  basePrice = 25.75
): OrderBook => {
  // Use the creatorId to seed the random data or provide default if undefined
  // This ensures the same creator always gets consistent data
  const idToUse = creatorId || "default";
  const seed = idToUse.charCodeAt(0) % 10;
  basePrice = basePrice + (seed - 5);
  
  const bids: Order[] = [];
  const asks: Order[] = [];
  
  // Generate 10 bids (buy orders)
  for (let i = 0; i < 10; i++) {
    bids.push(generateOrder(basePrice, true, i));
  }
  
  // Generate 10 asks (sell orders)
  for (let i = 0; i < 10; i++) {
    asks.push(generateOrder(basePrice, false, i));
  }
  
  // Sort bids in descending order (highest price first)
  bids.sort((a, b) => b.price - a.price);
  
  // Sort asks in ascending order (lowest price first)
  asks.sort((a, b) => a.price - b.price);
  
  const spread = asks[0].price - bids[0].price;
  
  return {
    bids,
    asks,
    spread,
    lastUpdated: new Date().toISOString()
  };
};

// Pre-generated data for immediate use
export const mockOrderBook: OrderBook = getMockOrderBook("default");
