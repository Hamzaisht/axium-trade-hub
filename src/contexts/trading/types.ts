
import { Order, Trade } from '@/utils/mockApi';

export interface OrderBookData {
  bids: Order[];
  asks: Order[];
}

export interface TradingContextType {
  isLoading: boolean;
  orders: Order[];
  trades: Trade[];
  orderBook: OrderBookData | null;
  placeOrder: (orderData: Partial<Order>) => Promise<Order>;
  cancelOrder: (orderId: string) => Promise<void>;
  fetchUserOrders: () => Promise<void>;
  fetchUserTrades: () => Promise<void>;
  fetchOrderBook: (ipoId: string) => Promise<void>;
  isConnected: boolean;
}
