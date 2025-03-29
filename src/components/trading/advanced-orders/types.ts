
export type OrderType = 
  | 'limit' 
  | 'market' 
  | 'stop' 
  | 'stop-limit' 
  | 'oco' 
  | 'iceberg' 
  | 'twap' 
  | 'vwap' 
  | 'bracket';

export interface OrderFormValues {
  type: OrderType;
  quantity: string;
  limitPrice: string;
  stopPrice: string;
  takeProfitPrice: string;
  timeInForce: string;
  displaySize: string;
  intervalMinutes: string;
  duration: string;
  darkPoolEnabled: boolean;
}

export interface AdvancedOrderTypesProps {
  symbol: string;
  currentPrice: number;
  onOrderSubmit?: (orderData: any) => void;
  className?: string;
}

export interface OrderSubmitData {
  type: OrderType;
  side: 'buy' | 'sell';
  symbol: string;
  quantity: number;
  limitPrice?: number;
  stopPrice?: number;
  takeProfitPrice?: number;
  timeInForce: string;
  darkPool?: boolean;
  displaySize?: number;
  totalSize?: number;
  intervalMinutes?: number;
  durationMinutes?: number;
}
