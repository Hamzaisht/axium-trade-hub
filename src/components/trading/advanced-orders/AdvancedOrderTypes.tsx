
import { GlassCard } from "@/components/ui/GlassCard";
import { useAuth } from "@/contexts/AuthContext";
import { AdvancedOrderTypesProps } from "./types";
import { OrderTypeSelector } from "./OrderTypeSelector";
import { OrderInputFields } from "./OrderInputFields";
import { OrderButtons } from "./OrderButtons";
import { useOrderForm } from "./useOrderForm";

const AdvancedOrderTypes = ({
  symbol = "$AXM",
  currentPrice = 25.74,
  onOrderSubmit,
  className
}: AdvancedOrderTypesProps) => {
  const { user } = useAuth();
  const isInstitutional = user?.role === 'admin' || user?.role === 'investor';
  
  const { formValues, handlers } = useOrderForm({
    symbol,
    currentPrice,
    onOrderSubmit
  });
  
  return (
    <GlassCard className={className}>
      <h2 className="text-lg font-semibold mb-4">Advanced Order Entry</h2>
      
      <OrderTypeSelector
        value={formValues.orderType}
        onChange={handlers.setOrderType}
        isInstitutional={isInstitutional}
      />
      
      <OrderInputFields
        orderType={formValues.orderType}
        quantity={formValues.quantity}
        limitPrice={formValues.limitPrice}
        stopPrice={formValues.stopPrice}
        takeProfitPrice={formValues.takeProfitPrice}
        timeInForce={formValues.timeInForce}
        displaySize={formValues.displaySize}
        intervalMinutes={formValues.intervalMinutes}
        duration={formValues.duration}
        darkPoolEnabled={formValues.darkPoolEnabled}
        isInstitutional={isInstitutional}
        onQuantityChange={handlers.handleQuantityChange}
        onLimitPriceChange={handlers.handleLimitPriceChange}
        onStopPriceChange={handlers.handleStopPriceChange}
        onTakeProfitPriceChange={handlers.handleTakeProfitPriceChange}
        onDisplaySizeChange={handlers.handleDisplaySizeChange}
        onIntervalChange={handlers.handleIntervalChange}
        onDurationChange={handlers.handleDurationChange}
        onTimeInForceChange={handlers.setTimeInForce}
        onDarkPoolEnabledChange={handlers.setDarkPoolEnabled}
      />
      
      <OrderButtons
        symbol={symbol}
        onBuyClick={() => handlers.handleOrderSubmit('buy')}
        onSellClick={() => handlers.handleOrderSubmit('sell')}
      />
    </GlassCard>
  );
};

export default AdvancedOrderTypes;
