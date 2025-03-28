
import React, { createContext, useContext, ReactNode } from 'react';
import { useMarketDataWithFallback } from '@/hooks/useMarketDataWithFallback';
import { PriceUpdate, OrderBookUpdate, TradeUpdate } from '@/hooks/useMarketData';
import { Loader2, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MarketDataContextType {
  isConnected: boolean;
  priceUpdates: PriceUpdate[];
  latestPrices: Record<string, number>;
  orderBook: OrderBookUpdate | null;
  recentTrades: TradeUpdate[];
  isLoading: boolean;
  dataStale: boolean;
  reconnect: () => void;
}

const MarketDataContext = createContext<MarketDataContextType | undefined>(undefined);

export const useMarketDataContext = () => {
  const context = useContext(MarketDataContext);
  if (!context) {
    throw new Error('useMarketDataContext must be used within a MarketDataProvider');
  }
  return context;
};

interface MarketDataProviderProps {
  children: ReactNode;
  ipoId?: string;
  showConnectionStatus?: boolean;
  renderLoadingState?: () => ReactNode;
  renderDisconnectedState?: () => ReactNode;
}

export const MarketDataProvider: React.FC<MarketDataProviderProps> = ({
  children,
  ipoId,
  showConnectionStatus = false,
  renderLoadingState,
  renderDisconnectedState
}) => {
  const {
    isConnected,
    priceUpdates,
    latestPrices,
    orderBook,
    recentTrades,
    isLoading,
    dataStale,
    forceReconnect
  } = useMarketDataWithFallback(ipoId);

  // Standard loading state
  const defaultLoadingState = (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-axium-blue mx-auto mb-2" />
        <p className="text-sm text-axium-gray-600">Connecting to market data...</p>
      </div>
    </div>
  );

  // Standard disconnected state
  const defaultDisconnectedState = (
    <Alert variant="warning" className="my-4">
      <WifiOff className="h-4 w-4" />
      <AlertDescription className="flex justify-between items-center">
        <span>Market data connection lost. Some data may not be current.</span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={forceReconnect}
          className="ml-4"
        >
          Reconnect
        </Button>
      </AlertDescription>
    </Alert>
  );

  return (
    <MarketDataContext.Provider
      value={{
        isConnected,
        priceUpdates,
        latestPrices,
        orderBook,
        recentTrades,
        isLoading,
        dataStale,
        reconnect: forceReconnect
      }}
    >
      {showConnectionStatus && !isConnected && !isLoading && (
        renderDisconnectedState ? renderDisconnectedState() : defaultDisconnectedState
      )}
      
      {isLoading ? (
        renderLoadingState ? renderLoadingState() : defaultLoadingState
      ) : (
        children
      )}
    </MarketDataContext.Provider>
  );
};

export default MarketDataProvider;
