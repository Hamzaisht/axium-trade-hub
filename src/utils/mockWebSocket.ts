
/**
 * Mock WebSocket Service
 * Simulates real-time data streaming for market prices, order execution, etc.
 */

import { IPO, Order, Trade } from "./mockApi";
import { EventEmitter } from "events";

// Create a global event emitter to simulate WebSocket events
class WebSocketEmulator extends EventEmitter {
  private static instance: WebSocketEmulator;
  private connected: boolean = false;
  private reconnectInterval: number = 3000;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private intervalIds: NodeJS.Timeout[] = [];
  
  private constructor() {
    super();
    // Set max listeners to avoid memory leak warnings
    this.setMaxListeners(50);
  }
  
  public static getInstance(): WebSocketEmulator {
    if (!WebSocketEmulator.instance) {
      WebSocketEmulator.instance = new WebSocketEmulator();
    }
    return WebSocketEmulator.instance;
  }
  
  public connect(): void {
    if (this.connected) return;
    
    console.log("WebSocket: Connecting...");
    
    // Simulate connection delay
    setTimeout(() => {
      this.connected = true;
      this.reconnectAttempts = 0;
      this.emit("connection", { status: "connected" });
      console.log("WebSocket: Connected successfully");
      
      // Start price update simulations for all IPOs
      this.startPriceSimulation();
    }, 1000);
  }
  
  public disconnect(): void {
    if (!this.connected) return;
    
    console.log("WebSocket: Disconnecting...");
    
    // Clear all interval timers
    this.intervalIds.forEach(id => clearInterval(id));
    this.intervalIds = [];
    
    this.connected = false;
    this.emit("connection", { status: "disconnected" });
    console.log("WebSocket: Disconnected");
  }
  
  public reconnect(): void {
    if (this.connected || this.reconnectAttempts >= this.maxReconnectAttempts) return;
    
    this.reconnectAttempts++;
    console.log(`WebSocket: Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
    
    setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  }
  
  private startPriceSimulation(): void {
    // Simulate price updates every 5 seconds
    const priceUpdateId = setInterval(() => {
      if (!this.connected) return;
      
      // Import mockIPOAPI dynamically to avoid circular dependencies
      import("./mockApi").then(({ mockIPOs }) => {
        mockIPOs.forEach(ipo => {
          // Apply random price change based on volatility factor
          const volatilityFactor = this.getVolatilityFactor(ipo);
          const priceChange = this.calculatePriceChange(ipo.currentPrice, volatilityFactor);
          
          const oldPrice = ipo.currentPrice;
          ipo.currentPrice = parseFloat((ipo.currentPrice + priceChange).toFixed(2));
          
          // Ensure price doesn't go below 0.01
          if (ipo.currentPrice < 0.01) {
            ipo.currentPrice = 0.01;
          }
          
          // Emit price update event
          this.emit("price_update", {
            ipoId: ipo.id,
            symbol: ipo.symbol,
            oldPrice,
            newPrice: ipo.currentPrice,
            timestamp: new Date().toISOString()
          });
        });
      });
    }, 5000);
    
    this.intervalIds.push(priceUpdateId);
    
    // Simulate order book updates every 3 seconds
    const orderBookUpdateId = setInterval(() => {
      if (!this.connected) return;
      
      import("./mockApi").then(({ mockIPOs, mockOrders }) => {
        mockIPOs.forEach(ipo => {
          const openOrders = mockOrders.filter(o => o.ipoId === ipo.id && o.status === 'open');
          
          const bids = openOrders.filter(o => o.type === 'buy').sort((a, b) => b.price - a.price);
          const asks = openOrders.filter(o => o.type === 'sell').sort((a, b) => a.price - b.price);
          
          this.emit("orderbook_update", {
            ipoId: ipo.id,
            symbol: ipo.symbol,
            bids,
            asks,
            timestamp: new Date().toISOString()
          });
        });
      });
    }, 3000);
    
    this.intervalIds.push(orderBookUpdateId);
    
    // Simulate random trade executions every 8 seconds
    const tradeExecutionId = setInterval(() => {
      if (!this.connected) return;
      
      import("./mockApi").then(({ mockIPOs, mockTrades }) => {
        // Randomly select an IPO to simulate a trade for
        const randomIndex = Math.floor(Math.random() * mockIPOs.length);
        const ipo = mockIPOs[randomIndex];
        
        // Create a simulated trade
        const simulatedTrade = {
          id: `sim-trade-${Date.now()}`,
          buyerId: `sim-buyer-${Math.floor(Math.random() * 1000)}`,
          sellerId: `sim-seller-${Math.floor(Math.random() * 1000)}`,
          ipoId: ipo.id,
          creatorSymbol: ipo.symbol,
          price: parseFloat((ipo.currentPrice * (0.95 + Math.random() * 0.1)).toFixed(2)),
          quantity: Math.floor(Math.random() * 10) + 1,
          timestamp: new Date().toISOString()
        };
        
        // Add trade to mock data
        mockTrades.push(simulatedTrade);
        
        // Emit trade execution event
        this.emit("trade_executed", simulatedTrade);
      });
    }, 8000);
    
    this.intervalIds.push(tradeExecutionId);
  }
  
  private getVolatilityFactor(ipo: IPO): number {
    // Calculate volatility based on engagement score and AI score
    // Higher scores generally mean less volatility, but with randomness
    const baseVolatility = 0.05; // 5% base volatility
    const engagementImpact = (100 - ipo.engagementScore) / 1000; // Lower engagement = higher volatility
    const aiScoreImpact = (100 - ipo.aiScore) / 800; // Lower AI score = higher volatility
    
    return baseVolatility + engagementImpact + aiScoreImpact;
  }
  
  private calculatePriceChange(currentPrice: number, volatilityFactor: number): number {
    // Random walk model with mean reversion tendency
    const randomFactor = (Math.random() * 2 - 1); // Random value between -1 and 1
    const maxChange = currentPrice * volatilityFactor;
    return randomFactor * maxChange;
  }
  
  // Subscribe to specific event
  public on(event: string, listener: (...args: any[]) => void): this {
    super.on(event, listener);
    return this;
  }
  
  // Unsubscribe from specific event
  public off(event: string, listener: (...args: any[]) => void): this {
    super.off(event, listener);
    return this;
  }
  
  // For debugging - get current connection status
  public isConnected(): boolean {
    return this.connected;
  }
}

// Export singleton instance
export const mockWebSocket = WebSocketEmulator.getInstance();

// Common event names for consumers to use
export const WSEvents = {
  CONNECTION: "connection",
  PRICE_UPDATE: "price_update",
  ORDERBOOK_UPDATE: "orderbook_update",
  TRADE_EXECUTED: "trade_executed",
  ORDER_UPDATED: "order_updated",
  PORTFOLIO_UPDATED: "portfolio_updated"
};

// Hook to use the mock WebSocket
export const useWebSocketMock = () => {
  const connect = () => mockWebSocket.connect();
  const disconnect = () => mockWebSocket.disconnect();
  const subscribe = (event: string, callback: (...args: any[]) => void) => {
    mockWebSocket.on(event, callback);
    return () => mockWebSocket.off(event, callback);
  };
  
  return {
    connect,
    disconnect,
    subscribe,
    isConnected: () => mockWebSocket.isConnected(),
    events: WSEvents
  };
};
