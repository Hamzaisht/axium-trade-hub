
import { mockTradingAPI, Order, Trade } from '@/utils/mockApi';
import { toast } from 'sonner';
import { OrderBookData } from '@/contexts/trading/types';
import { mockWebSocket, WSEvents } from '@/utils/mockWebSocket';
import { placeOrder as placeOrderLib } from '@/lib/placeOrder';

export class TradingService {
  static async placeOrder(orderData: Partial<Order>, userId: string): Promise<Order> {
    try {
      const orderWithUserId = {
        ...orderData,
        userId
      };
      
      // Determine the order type properly based on available properties
      const orderType = orderWithUserId.type || "buy"; // Default to "buy" if not specified
      
      await placeOrderLib({
        userId,
        creatorId: orderWithUserId.ipoId || '',
        type: orderType as "buy" | "sell",
        quantity: orderWithUserId.quantity || 0,
        price: orderWithUserId.price || 0
      });
      
      const newOrder = await mockTradingAPI.placeOrder(orderWithUserId);
      
      mockWebSocket.emit(WSEvents.ORDER_UPDATED, newOrder);
      
      return newOrder;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to place order');
      throw error;
    }
  }

  static async cancelOrder(orderId: string): Promise<Order> {
    try {
      const cancelledOrder = await mockTradingAPI.cancelOrder(orderId);
      
      mockWebSocket.emit(WSEvents.ORDER_UPDATED, cancelledOrder);
      
      toast.success('Order cancelled successfully');
      return cancelledOrder;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to cancel order');
      throw error;
    }
  }

  static async getUserOrders(): Promise<Order[]> {
    try {
      return await mockTradingAPI.getUserOrders();
    } catch (error) {
      toast.error('Failed to fetch orders');
      throw error;
    }
  }

  static async getUserTrades(): Promise<Trade[]> {
    try {
      return await mockTradingAPI.getUserTrades();
    } catch (error) {
      toast.error('Failed to fetch trades');
      throw error;
    }
  }

  static async getOrderBook(ipoId: string): Promise<OrderBookData> {
    try {
      return await mockTradingAPI.getOrderBook(ipoId);
    } catch (error) {
      toast.error('Failed to fetch order book');
      throw error;
    }
  }
}
