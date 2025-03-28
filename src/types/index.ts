
import { ReactNode } from 'react';

// Order and Trade types for Trading contexts
export interface Order {
  id: string;
  userId: string;
  ipoId: string;
  price: number;
  quantity: number;
  type: 'buy' | 'sell';
  orderType?: 'market' | 'limit';
  status: 'pending' | 'filled' | 'cancelled' | 'open';
  createdAt: string;
}

export interface Trade {
  id: string;
  buyerId: string;
  sellerId: string;
  ipoId: string;
  price: number;
  quantity: number;
  timestamp: string;
  creatorSymbol?: string;
}

// Portfolio type
export interface Portfolio {
  userId: string;
  holdings: {
    ipoId: string;
    quantity: number;
    averagePurchasePrice: number;
    currentPrice?: number;
    creatorName?: string;
    creatorSymbol?: string;
    priceChange?: number;
  }[];
  totalValue: number;
  cash: number;
  invested: number;
  history?: {
    date: string;
    value: number;
  }[];
}

// MarketDepth interface for AI features
export interface MarketDepthModel {
  orderBookDepth: number;
  liquidityScore: number;
  volumeProfile: number;
  volatilityRisk: number;
  buyPressure: number;
  sellPressure: number;
  // Include any other properties from the original interface
  bidAskSpread?: number;
  depth?: {
    bids: { price: number; quantity: number }[];
    asks: { price: number; quantity: number }[];
  };
  recentTrades?: {
    price: number;
    quantity: number;
    timestamp: string;
  }[];
}
