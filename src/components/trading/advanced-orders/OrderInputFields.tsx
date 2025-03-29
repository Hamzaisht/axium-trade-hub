
import { OrderType } from "./types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface OrderInputFieldsProps {
  orderType: OrderType;
  quantity: string;
  limitPrice: string;
  stopPrice: string;
  takeProfitPrice: string;
  timeInForce: string;
  displaySize: string;
  intervalMinutes: string;
  duration: string;
  darkPoolEnabled: boolean;
  isInstitutional: boolean;
  onQuantityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLimitPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStopPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTakeProfitPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDisplaySizeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onIntervalChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDurationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTimeInForceChange: (value: string) => void;
  onDarkPoolEnabledChange: (value: boolean) => void;
}

export const OrderInputFields = ({
  orderType,
  quantity,
  limitPrice,
  stopPrice,
  takeProfitPrice,
  timeInForce,
  displaySize,
  intervalMinutes,
  duration,
  darkPoolEnabled,
  isInstitutional,
  onQuantityChange,
  onLimitPriceChange,
  onStopPriceChange,
  onTakeProfitPriceChange,
  onDisplaySizeChange,
  onIntervalChange,
  onDurationChange,
  onTimeInForceChange,
  onDarkPoolEnabledChange
}: OrderInputFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="quantity" className="mb-2 block">Quantity</Label>
        <Input
          id="quantity"
          type="text"
          value={quantity}
          onChange={onQuantityChange}
          className="w-full"
        />
      </div>
      
      {orderType !== 'market' && (
        <div>
          <Label htmlFor="limit-price" className="mb-2 block">Limit Price</Label>
          <Input
            id="limit-price"
            type="text"
            value={limitPrice}
            onChange={onLimitPriceChange}
            className="w-full"
          />
        </div>
      )}
      
      {['stop', 'stop-limit', 'oco', 'bracket'].includes(orderType) && (
        <div>
          <Label htmlFor="stop-price" className="mb-2 block">Stop Price</Label>
          <Input
            id="stop-price"
            type="text"
            value={stopPrice}
            onChange={onStopPriceChange}
            className="w-full"
          />
        </div>
      )}
      
      {['oco', 'bracket'].includes(orderType) && (
        <div>
          <Label htmlFor="take-profit" className="mb-2 block">Take Profit Price</Label>
          <Input
            id="take-profit"
            type="text"
            value={takeProfitPrice}
            onChange={onTakeProfitPriceChange}
            className="w-full"
          />
        </div>
      )}
      
      {/* Time in Force selector */}
      <div>
        <Label htmlFor="time-in-force" className="mb-2 block">Time in Force</Label>
        <Select
          value={timeInForce}
          onValueChange={onTimeInForceChange}
        >
          <SelectTrigger id="time-in-force" className="w-full">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Day Only</SelectItem>
            <SelectItem value="gtc">Good Till Canceled (GTC)</SelectItem>
            <SelectItem value="ioc">Immediate or Cancel (IOC)</SelectItem>
            <SelectItem value="fok">Fill or Kill (FOK)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Special parameters for institutional order types */}
      {orderType === 'iceberg' && (
        <div>
          <Label htmlFor="display-size" className="mb-2 block">Display Size</Label>
          <Input
            id="display-size"
            type="text"
            value={displaySize}
            onChange={onDisplaySizeChange}
            className="w-full"
            placeholder="Visible quantity"
          />
          <p className="text-xs text-axium-gray-500 mt-1">
            Only {displaySize} out of {quantity} will be visible to the market
          </p>
        </div>
      )}
      
      {['twap', 'vwap'].includes(orderType) && (
        <>
          <div>
            <Label htmlFor="duration" className="mb-2 block">Duration (minutes)</Label>
            <Input
              id="duration"
              type="text"
              value={duration}
              onChange={onDurationChange}
              className="w-full"
            />
          </div>
          
          {orderType === 'twap' && (
            <div>
              <Label htmlFor="interval" className="mb-2 block">Interval (minutes)</Label>
              <Input
                id="interval"
                type="text"
                value={intervalMinutes}
                onChange={onIntervalChange}
                className="w-full"
              />
            </div>
          )}
        </>
      )}
      
      {/* Dark pool option for institutional clients */}
      {isInstitutional && (
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="dark-pool" className="mb-0 flex items-center">
              Dark Pool Execution
            </Label>
            <p className="text-xs text-axium-gray-500">Hide your order from the public order book</p>
          </div>
          <Switch
            id="dark-pool"
            checked={darkPoolEnabled}
            onCheckedChange={onDarkPoolEnabledChange}
          />
        </div>
      )}
    </div>
  );
};
