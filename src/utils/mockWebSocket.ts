
// Mock WebSocket implementation
import { faker } from '@faker-js/faker';
import { IPO, Trade, Order } from './mockApi';
import { mockIPOs } from './data';

// Mock orders and trades for the mock WebSocket
const mockOrders: Order[] = [];
const mockTrades: Trade[] = [];

// WebSocket events
export enum WSEvents {
  CONNECTION = 'connection',
  PRICE_UPDATE = 'price-update',
  ORDERBOOK_UPDATE = 'orderbook-update',
  TRADE_EXECUTED = 'trade-executed'
}

// Mock WebSocket class
class MockWebSocket {
  private isConnected = false;
  private listeners: Record<string, Function[]> = {};
  private intervals: Record<string, NodeJS.Timeout> = {};
  
  // Connect to the mock WebSocket
  connect() {
    if (this.isConnected) return;
    
    this.isConnected = true;
    this.emit(WSEvents.CONNECTION, { status: 'connected' });
    
    // Start regular price updates
    this.startPriceUpdates();
    
    // Start regular order book updates
    this.startOrderBookUpdates();
    
    // Start random trade executions
    this.startTradeExecutions();
    
    console.log('WebSocket connected');
  }
  
  // Disconnect from the mock WebSocket
  disconnect() {
    if (!this.isConnected) return;
    
    this.isConnected = false;
    this.emit(WSEvents.CONNECTION, { status: 'disconnected' });
    
    // Clear all intervals
    Object.values(this.intervals).forEach(interval => clearInterval(interval));
    this.intervals = {};
    
    console.log('WebSocket disconnected');
  }
  
  // Register an event listener
  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }
  
  // Remove an event listener
  off(event: string, callback: Function) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }
  
  // Emit an event
  private emit(event: string, data: any) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => callback(data));
  }
  
  // Start price update interval
  private startPriceUpdates() {
    this.intervals.prices = setInterval(() => {
      if (!this.isConnected) return;
      
      // Randomly select an IPO to update
      const ipo = mockIPOs[Math.floor(Math.random() * mockIPOs.length)];
      
      // Generate a small price change
      const changePercent = faker.number.float({ min: -1, max: 1, fractionDigits: 2 });
      const oldPrice = ipo.currentPrice;
      const newPrice = parseFloat((oldPrice * (1 + changePercent / 100)).toFixed(2));
      
      // Update the IPO price in our mock data
      ipo.currentPrice = newPrice;
      
      // Emit the price update event
      this.emit(WSEvents.PRICE_UPDATE, {
        ipoId: ipo.id,
        symbol: ipo.symbol,
        oldPrice,
        newPrice,
        timestamp: new Date().toISOString()
      });
    }, faker.number.int({ min: 2000, max: 5000 })); // Every 2-5 seconds
  }
  
  // Start order book update interval
  private startOrderBookUpdates() {
    this.intervals.orderBook = setInterval(() => {
      if (!this.isConnected) return;
      
      // Randomly select an IPO to update
      const ipo = mockIPOs[Math.floor(Math.random() * mockIPOs.length)];
      
      // Generate mock bids and asks
      const bidsCount = faker.number.int({ min: 3, max: 10 });
      const asksCount = faker.number.int({ min: 3, max: 10 });
      
      const bids = Array.from({ length: bidsCount }, (_, i) => {
        const priceDecrement = i * faker.number.float({ min: 0.1, max: 0.5 });
        return {
          id: faker.string.uuid(),
          ipoId: ipo.id,
          userId: faker.string.uuid(),
          type: 'buy',
          orderType: 'limit',
          price: ipo.currentPrice - priceDecrement,
          quantity: faker.number.int({ min: 10, max: 1000 }),
          status: 'open',
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString()
        } as Order;
      }).sort((a, b) => b.price - a.price); // Sort by price descending
      
      const asks = Array.from({ length: asksCount }, (_, i) => {
        const priceIncrement = i * faker.number.float({ min: 0.1, max: 0.5 });
        return {
          id: faker.string.uuid(),
          ipoId: ipo.id,
          userId: faker.string.uuid(),
          type: 'sell',
          orderType: 'limit',
          price: ipo.currentPrice + priceIncrement,
          quantity: faker.number.int({ min: 10, max: 1000 }),
          status: 'open',
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString()
        } as Order;
      }).sort((a, b) => a.price - b.price); // Sort by price ascending
      
      // Emit the order book update event
      this.emit(WSEvents.ORDERBOOK_UPDATE, {
        ipoId: ipo.id,
        symbol: ipo.symbol,
        bids,
        asks,
        timestamp: new Date().toISOString()
      });
    }, faker.number.int({ min: 5000, max: 10000 })); // Every 5-10 seconds
  }
  
  // Start trade execution interval
  private startTradeExecutions() {
    this.intervals.trades = setInterval(() => {
      if (!this.isConnected) return;
      
      // Randomly decide if a trade should happen
      if (faker.number.int({ min: 1, max: 5 }) > 2) return; // 60% chance of no trade
      
      // Randomly select an IPO for the trade
      const ipo = mockIPOs[Math.floor(Math.random() * mockIPOs.length)];
      
      // Generate a random trade
      const tradePrice = ipo.currentPrice * (1 + faker.number.float({ min: -0.5, max: 0.5, fractionDigits: 2 }) / 100);
      const tradeQuantity = faker.number.int({ min: 10, max: 500 });
      const tradeSide = faker.helpers.arrayElement(['buy', 'sell']);
      
      const trade = {
        id: faker.string.uuid(),
        buyerId: faker.string.uuid(),
        sellerId: faker.string.uuid(),
        ipoId: ipo.id,
        creatorSymbol: ipo.symbol,
        price: tradePrice,
        quantity: tradeQuantity,
        timestamp: new Date().toISOString(),
        side: tradeSide as 'buy' | 'sell'
      };
      
      // Emit the trade execution event
      this.emit(WSEvents.TRADE_EXECUTED, trade);
    }, faker.number.int({ min: 3000, max: 8000 })); // Every 3-8 seconds
  }
}

export const mockWebSocket = new MockWebSocket();
